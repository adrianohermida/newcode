declare global {
  interface Window {
    posthog?: {
      capture?: (eventName: string, properties: Record<string, any>) => void;
    };
    fbq?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    pintrk?: (...args: any[]) => void;
    ttq?: {
      track?: (...args: any[]) => void;
    };
  }
}

// ✅ 平台安全封装
function safePosthogCapture(
  event: string,
  properties: Record<string, any> = {}
) {
  if (window.posthog?.capture) {
    window.posthog.capture(event, {
      event_id: crypto.randomUUID(), // 保证事件不被合并
      ...properties,
    });
  }
}

function safeMetaPixelCapture(
  event: string,
  properties: Record<string, any> = {}
) {
  if (window.fbq) {
    // Meta 推荐使用标准事件，否则用 trackCustom
    const standardEvents = [
      "PageView",
      "AddToCart",
      "Purchase",
      "InitiateCheckout",
    ];
    if (standardEvents.includes(event)) {
      window.fbq("track", event, properties);
    } else {
      window.fbq("trackCustom", event, properties);
    }
  }
}

function safeGoogleCapture(
  event: string,
  properties: Record<string, any> = {}
) {
  if (window.gtag) {
    window.gtag("event", event, properties);
  }
}

function safePinterestCapture(
  event: string,
  properties: Record<string, any> = {}
) {
  if ((window as any).pintrk) {
    (window as any).pintrk("track", event, properties);
  }
}

function safeTikTokCapture(
  event: string,
  properties: Record<string, any> = {}
) {
  if ((window as any).ttq?.track) {
    (window as any).ttq.track(event, properties);
  }
}

// ✅ 统一埋点函数
export function trackEvent(
  event: string,
  properties: Record<string, any> = {}
) {
  safePosthogCapture(event, properties);
  safeMetaPixelCapture(event, properties);
  safeGoogleCapture(event, properties);
  safePinterestCapture(event, properties);
  safeTikTokCapture(event, properties);
}

type PurchaseItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type PurchaseEvent = {
  orderId: string;
  value: number; // 总金额
  currency: string; // ISO 货币代码，例如 'USD', 'CNY'
  items: PurchaseItem[];
};

export function trackPurchase(event: PurchaseEvent) {
  const { orderId, value, currency, items } = event;

  // --- ✅ 1. PostHog ---
  // 订单维度事件
  safePosthogCapture("Purchase", {
    order_id: orderId,
    value,
    currency,
    items,
  });

  // 商品维度事件
  items.forEach((item) => {
    safePosthogCapture("Purchase_Item", {
      order_id: orderId,
      product_id: item.id,
      product_name: item.name,
      product_quantity: item.quantity,
      product_price: item.price,
    });
  });

  // --- ✅ 2. Meta Pixel ---
  safeMetaPixelCapture("Purchase", {
    value,
    currency,
    transaction_id: orderId,
    contents: items.map((i) => ({
      id: i.id,
      quantity: i.quantity,
      item_price: i.price,
    })),
    content_type: "product",
  });

  // --- ✅ 3. Google Analytics (GA4) ---
  safeGoogleCapture("purchase", {
    transaction_id: orderId,
    value,
    currency,
    items: items.map((i) => ({
      item_id: i.id,
      item_name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
  });

  // --- ✅ 4. Pinterest ---
  safePinterestCapture("checkout", {
    value,
    order_id: orderId,
    currency,
    line_items: items.map((i) => ({
      product_id: i.id,
      product_quantity: i.quantity,
      product_price: i.price,
    })),
  });

  // --- ✅ 5. TikTok ---
  safeGoogleCapture("CompletePayment", {
    contents: items.map((i) => ({
      content_id: i.id,
      content_name: i.name,
      quantity: i.quantity,
      price: i.price,
    })),
    value,
    currency,
    order_id: orderId,
  });
}

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
};

// ----------------------
// 加入购物车
// ----------------------
export function trackAddToCart(item: CartItem) {
  const { id, name } = item;

  // --- ✅ 1. PostHog ---
  safePosthogCapture("AddToCart", {
    product_id: id,
    product_name: name,
  });

  // --- ✅ 2. Meta Pixel ---
  safeMetaPixelCapture("AddToCart", {
    contents: [{ id, name }],
    content_type: "product",
  });

  // --- ✅ 3. Google Analytics (GA4) ---
  safeGoogleCapture("add_to_cart", {
    items: [{ item_id: id, item_name: name }],
  });

  // --- ✅ 4. Pinterest ---
  safePinterestCapture("addtocart", {
    product_id: id,
    product_name: name,
  });

  // --- ✅ 5. TikTok ---
  safeTikTokCapture("AddToCart", {
    contents: [{ content_id: id, content_name: name }],
  });
}

// ----------------------
// 开始结账
// ----------------------
export function trackInitiateCheckout(items: CartItem[], orderId?: string) {
  // --- ✅ 1. PostHog ---
  safePosthogCapture("InitiateCheckout", {
    order_id: orderId,
    items,
  });

  // --- ✅ 2. Meta Pixel ---
  safeMetaPixelCapture("InitiateCheckout", {
    contents: items.map((i) => ({
      id: i.id,
      quantity: i.quantity,
    })),
    content_type: "product",
  });

  // --- ✅ 3. Google Analytics (GA4) ---
  safeGoogleCapture("begin_checkout", {
    items: items.map((i) => ({
      item_id: i.id,
      quantity: i.quantity,
    })),
  });

  // --- ✅ 4. Pinterest ---
  safePinterestCapture("checkout", {
    order_id: orderId,
    line_items: items.map((i) => ({
      product_id: i.id,
      product_quantity: i.quantity,
    })),
  });

  // --- ✅ 5. TikTok ---
  safeGoogleCapture("InitiateCheckout", {
    contents: items.map((i) => ({
      content_id: i.id,
      quantity: i.quantity,
    })),
    order_id: orderId,
  });
}
