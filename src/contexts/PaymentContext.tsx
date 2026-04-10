import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { trackPurchase } from "../utils/analytics";

interface PaymentState {
  isPaid: boolean;
  isLoading: boolean;
  email: string | null;
  stripeSessionId: string | null;
  unlock: (email: string, sessionId: string) => void;
  checkSession: (sessionId: string) => Promise<boolean>;
}

const PaymentContext = createContext<PaymentState>({
  isPaid: false,
  isLoading: true,
  email: null,
  stripeSessionId: null,
  unlock: () => {},
  checkSession: async () => false,
});

const PAID_KEY = "1test-paid";
const EMAIL_KEY = "1test-email";
const SESSION_KEY = "1test-session";

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [stripeSessionId, setStripeSessionId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(PAID_KEY);
    if (stored === "true") {
      setIsPaid(true);
      setEmail(localStorage.getItem(EMAIL_KEY));
      setStripeSessionId(localStorage.getItem(SESSION_KEY));
    }
    setIsLoading(false);
  }, []);

  const unlock = (userEmail: string, sessionId: string) => {
    setIsPaid(true);
    setEmail(userEmail);
    setStripeSessionId(sessionId);
    localStorage.setItem(PAID_KEY, "true");
    localStorage.setItem(EMAIL_KEY, userEmail);
    localStorage.setItem(SESSION_KEY, sessionId);
    trackPurchase({
      upgradeType: "full_profile",
      revenueAmount: 12,
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
        unlock(data.email, sessionId);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <PaymentContext.Provider value={{ isPaid, isLoading, email, stripeSessionId, unlock, checkSession }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  return useContext(PaymentContext);
}