export type Variant = "A" | "B";

const AB_VARIANT_KEY = "1test_ab_variant";

export function getVariant(experimentName: string): Variant {
  if (typeof window === "undefined") return "A";

  const stored = sessionStorage.getItem(`${AB_VARIANT_KEY}_${experimentName}`);
  if (stored === "A" || stored === "B") return stored;

  const urlParams = new URLSearchParams(window.location.search);
  const urlVariant = urlParams.get("variant");
  if (urlVariant === "A" || urlVariant === "B") {
    sessionStorage.setItem(`${AB_VARIANT_KEY}_${experimentName}`, urlVariant);
    return urlVariant;
  }

  const variant = Math.random() < 0.5 ? "A" : "B";
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
  });
}