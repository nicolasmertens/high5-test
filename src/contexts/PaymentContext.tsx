import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { trackPurchase, type UpgradeType } from "../utils/analytics";

interface PaymentState {
  isPaid: boolean;
  isLoading: boolean;
  email: string | null;
  stripeSessionId: string | null;
  tier: string | null;
  unlock: (email: string, sessionId: string, tier?: string) => void;
  checkSession: (sessionId: string) => Promise<boolean>;
}

const PaymentContext = createContext<PaymentState>({
  isPaid: false,
  isLoading: true,
  email: null,
  stripeSessionId: null,
  tier: null,
  unlock: () => {},
  checkSession: async () => false,
});

const PAID_KEY = "1test-paid";
const EMAIL_KEY = "1test-email";
const SESSION_KEY = "1test-session";
const TIER_KEY = "1test-tier";

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [stripeSessionId, setStripeSessionId] = useState<string | null>(null);
  const [tier, setTier] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(PAID_KEY);
    if (stored === "true") {
      setIsPaid(true);
      setEmail(localStorage.getItem(EMAIL_KEY));
      setStripeSessionId(localStorage.getItem(SESSION_KEY));
      setTier(localStorage.getItem(TIER_KEY));
    }
    setIsLoading(false);
  }, []);

  const unlock = (userEmail: string, sessionId: string, paymentTier: string = "full_profile") => {
    setIsPaid(true);
    setEmail(userEmail);
    setStripeSessionId(sessionId);
    setTier(paymentTier);
    localStorage.setItem(PAID_KEY, "true");
    localStorage.setItem(EMAIL_KEY, userEmail);
    localStorage.setItem(SESSION_KEY, sessionId);
    localStorage.setItem(TIER_KEY, paymentTier);
    trackPurchase({
      upgradeType: paymentTier as UpgradeType,
      revenueAmount: paymentTier === "ai_playbook" ? 19 : paymentTier === "team_monthly" ? 29 : 12,
      currency: "USD",
      transactionId: sessionId,
    });
  };

  const checkSession = async (sessionId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/verify-session?session_id=${sessionId}`);
      if (!res.ok) return false;
      const data = await res.json();
      if (data.paid && data.email) {
        unlock(data.email, sessionId, data.tier || "full_profile");
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <PaymentContext.Provider value={{ isPaid, isLoading, email, stripeSessionId, tier, unlock, checkSession }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  return useContext(PaymentContext);
}