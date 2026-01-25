import { useEffect } from "react";
export const FreshchatWidget = ({ widgetId }: { widgetId?: string }) => {
  useEffect(() => {
    if (document.getElementById("freshchat-widget")) return;
    const script = document.createElement("script");
    script.id = "freshchat-widget";
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
