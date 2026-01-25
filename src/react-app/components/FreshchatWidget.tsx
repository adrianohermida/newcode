import { useEffect } from "react";
export const FreshchatWidget = ({ widgetId }: { widgetId?: string }) => {
  useEffect(() => {
    const scriptId = widgetId ? `freshchat-widget-${widgetId}` : "freshchat-widget-public";
    // Remove any existing widget scripts
    document.querySelectorAll('[id^="freshchat-widget"]').forEach((el) => el.remove());
    // Inject new script
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "//eu.fw-cdn.com/10713913/375987.js";
    script.setAttribute("chat", "true");
    if (widgetId) script.setAttribute("widgetId", widgetId);
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [widgetId]);
  return null;
};
