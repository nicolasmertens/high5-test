export type Variant = "A" | "B" | "C";

const AB_VARIANT_KEY = "1test_ab_variant";

const VARIANT_COUNTS: Record<string, number> = {
  upsell_messaging: 3,
  email_capture_moment: 3,
};

export function getVariant(experimentName: string): Variant {
  if (typeof window === "undefined") return "A";

  const stored = sessionStorage.getItem(`${AB_VARIANT_KEY}_${experimentName}`);
  if (stored === "A" || stored === "B" || stored === "C") return stored;

  const urlParams = new URLSearchParams(window.location.search);
  const urlVariant = urlParams.get("variant");
  if (urlVariant === "A" || urlVariant === "B" || urlVariant === "C") {
    sessionStorage.setItem(`${AB_VARIANT_KEY}_${experimentName}`, urlVariant);
    return urlVariant;
  }

  const count = VARIANT_COUNTS[experimentName] || 2;
  const roll = Math.random();
  let variant: Variant;
  if (count === 3) {
    variant = roll < 1 / 3 ? "A" : roll < 2 / 3 ? "B" : "C";
  } else {
    variant = roll < 0.5 ? "A" : "B";
  }
  sessionStorage.setItem(`${AB_VARIANT_KEY}_${experimentName}`, variant);
  return variant;
}

export function trackExperimentView(experimentName: string, variant: Variant): void {
  if (typeof window === "undefined") return;
  import("posthog-js").then((ph) => {
    ph.default.capture("experiment_viewed", {
      experiment_name: experimentName,
      experiment_variant: variant,
    });
    const properties: Record<string, string> = {
      [`experiment_${experimentName}`]: variant,
    };
    if (experimentName === "upsell_messaging") {
      properties.upsell_variant = variant;
    }
    if (experimentName === "email_capture_moment") {
      properties.email_capture_variant = variant;
    }
    ph.default.setPersonProperties(properties);
  });
}