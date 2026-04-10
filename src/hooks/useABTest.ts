import { useMemo } from "react";
import { getVariant, trackExperimentView, type Variant } from "../utils/abTesting";

export function useABTest(experimentName: string): Variant {
  return useMemo(() => {
    const variant = getVariant(experimentName);
    trackExperimentView(experimentName, variant);
    return variant;
  }, [experimentName]);
}