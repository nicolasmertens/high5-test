import { useCallback, useRef } from "react";
import { toPng } from "html-to-image";

export function useShareImage() {
  const cardRef = useRef<HTMLDivElement>(null);

  const generateImage = useCallback(async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: 1200,
        height: 630,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });
      return dataUrl;
    } catch {
      return null;
    }
  }, []);

  const downloadImage = useCallback(
    async (filename: string = "1test-results.png") => {
      const dataUrl = await generateImage();
      if (!dataUrl) return;

      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [generateImage],
  );

  return { cardRef, generateImage, downloadImage };
}