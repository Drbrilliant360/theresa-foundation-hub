import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useClaimAdmin, useIsAdmin } from "@/hooks/useAdmin";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { isAdmin, loading } = useIsAdmin();
  const claim = useClaimAdmin();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Checking permissions…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-6">
        <Card className="max-w-md p-8 text-center">
          <h1 className="font-display text-xl font-semibold">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account does not have administrator permissions. If this is a new foundation
            workspace, you can claim the first admin seat.
          </p>
          <Button
            className="mt-6"
            disabled={claim.isPending}
            onClick={() => claim.mutate()}
          >
            {claim.isPending ? "Claiming…" : "Claim admin access"}
          </Button>
          {claim.isSuccess && !claim.data && (
            <p className="mt-3 text-sm text-destructive">
              An administrator already exists. Ask them to grant you access.
            </p>
          )}
        </Card>
      </div>
    );
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
