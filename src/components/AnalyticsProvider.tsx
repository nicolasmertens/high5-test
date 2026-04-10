import { type ReactNode } from "react";
import { useAnalytics } from "../hooks/useAnalytics";

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  useAnalytics();
  return <>{children}</>;
}