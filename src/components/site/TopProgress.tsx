import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

/** Thin bar at the top of the screen while pages, data or saves are in progress. */
export function TopProgress() {
  const navigating = useRouterState({ select: (s) => s.status === "pending" });
  const fetching = useIsFetching();
  const mutating = useIsMutating();
  const busy = navigating || fetching > 0 || mutating > 0;
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (busy) {
      setVisible(true);
      setProgress((p) => (p < 10 ? 10 : p));
      const id = setInterval(() => setProgress((p) => (p < 90 ? p + (90 - p) * 0.1 : p)), 200);
      return () => clearInterval(id);
    }
    setProgress(100);
    const t = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
    return () => clearTimeout(t);
  }, [busy]);

  return (
    <div
      aria-hidden={!visible}
      role="progressbar"
      aria-label="Loading"
      aria-valuenow={Math.round(progress)}
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-1"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 300ms" }}
    >
      <div
        className="h-full bg-accent shadow-[0_0_8px_var(--color-accent)]"
        style={{ width: `${progress}%`, transition: "width 200ms ease-out" }}
      />
    </div>
  );
}
