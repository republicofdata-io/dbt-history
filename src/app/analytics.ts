import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Sends one Google Analytics page view per route change, so every chapter,
 * tab and walkthrough step shows up as a page. The property is configured in
 * index.html with send_page_view off; nothing is sent from a local dev server.
 */
export function usePageViews() {
  const location = useLocation();
  useEffect(() => {
    if (!window.gtag || location.pathname.length === 0) return;
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;
    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: `${import.meta.env.BASE_URL.replace(/\/$/, "")}${location.pathname}${location.search}`,
    });
  }, [location.pathname, location.search]);
}
