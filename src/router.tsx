import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { routeTree } from "./routeTree.gen";

function friendlyError(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error ?? "");
  if (/fetch|network|Failed to fetch/i.test(msg)) return "Connection problem. Check your internet and try again.";
  return msg || "Something went wrong. Please try again.";
}

export const getRouter = () => {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (typeof window !== "undefined")
          toast.error("Couldn't load data", { description: friendlyError(error) });
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => toast.error("Action failed", { description: friendlyError(error) }),
    }),
    defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultPendingMs: 150,
  });

  return router;
};
