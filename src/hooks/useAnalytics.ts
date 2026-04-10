import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  initAnalytics,
  trackPageView,
  initScrollTracking,
  resetScrollTracking,
} from "../utils/analytics";

export function useAnalytics() {
  const location = useLocation();
  const initialized = useRef(false);
  const prevPath = useRef("");

  useEffect(() => {
    if (!initialized.current) {
      initAnalytics();
      initialized.current = true;
    }

    if (prevPath.current !== location.pathname) {
      prevPath.current = location.pathname;
      trackPageView(location.pathname, document.title);
      resetScrollTracking();
      initScrollTracking();
    }
  }, [location.pathname]);
}