import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { trackPurchase, type UpgradeType } from "../utils/analytics";

interface PaymentState {
  isPaid: boolean;
  isLoading: boolean;
  email: string | null;
  stripeSessionId: string | null;
  tier: string | null;
  unlock: (email: string, sessionId: string, tier?: string) => void;
  checkSession: (sessionId: string) => Promise<boolean>;
  verifyPayment: (email: string) => Promise<boolean>;
}

const PaymentContext = createContext<PaymentState>({
  isPaid: false,
  isLoading: true,
  email: null,
  stripeSessionId: null,
  tier: null,
  unlock: () => {},
  checkSession: async () => false,
  verifyPayment: async () => false,
});

const PAID_KEY = "1test-paid";
const EMAIL_KEY = "1test-email";
const SESSION_KEY = "1test-session";
const TIER_KEY = "1test-tier";

function clearPaymentStorage() {
  localStorage.removeItem(PAID_KEY);
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(TIER_KEY);
}

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [stripeSessionId, setStripeSessionId] = useState<string | null>(null);
  const [tier, setTier] = useState<string | null>(null);

  const unlock = useCallback(
    (userEmail: string, sessionId: string, paymentTier: string = "full_profile") => {
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
    },
    [],
  );

  const checkSession = useCallback(
    async (sessionId: string): Promise<boolean> => {
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
    },
    [unlock],
  );

  const verifyPayment = useCallback(
    async (userEmail: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/verify-payment?email=${encodeURIComponent(userEmail)}`);
        if (!res.ok) return false;
        const data = await res.json();
        if (data.paid && data.email) {
          unlock(data.email, data.sessionId || "", data.tier || "full_profile");
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [unlock],
  );

  useEffect(() => {
    const stored = localStorage.getItem(PAID_KEY);
    const storedEmail = localStorage.getItem(EMAIL_KEY);
    const storedSession = localStorage.getItem(SESSION_KEY);
    const storedTier = localStorage.getItem(TIER_KEY);

    if (stored === "true" && storedEmail) {
      setIsPaid(true);
      setEmail(storedEmail);
      setStripeSessionId(storedSession);
      setTier(storedTier);

      verifyPayment(storedEmail).then((serverVerified) => {
        if (serverVerified) {
          setIsLoading(false);
          return;
        }
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("session_id");
        if (sessionId) {
          checkSession(sessionId).then(() => setIsLoading(false));
          return;
        }
        setIsPaid(false);
        setEmail(null);
        setStripeSessionId(null);
        setTier(null);
        clearPaymentStorage();
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [verifyPayment, checkSession]);

  return (
    <PaymentContext.Provider
      value={{ isPaid, isLoading, email, stripeSessionId, tier, unlock, checkSession, verifyPayment }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  return useContext(PaymentContext);
}
