import { useEffect, useState } from "react";
import { readPresentation, writePresentation } from "./state";

/** Presentation mode toggle, persisted per browser and mirrored on <html data-presentation>. */
export function usePresentation() {
  const [on, setOn] = useState(readPresentation);
  useEffect(() => {
    writePresentation(on);
  }, [on]);
  return [on, setOn] as const;
}
