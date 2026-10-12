import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { AdminPageTitle } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAdminProfiles, useInvalidateAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({
    meta: [
      { title: "Users — Admin — Theresa Foundation" },
      { name: "description", content: "Manage donor accounts and administrator roles." },
      { property: "og:title", content: "Users — Admin — Theresa Foundation" },
      { property: "og:description", content: "Manage donor accounts and administrator roles." },
    ],
  }),
  component: AdminUsers,
});


function AdminUsers() {
  const { data: profiles } = useAdminProfiles();
  const invalidate = useInvalidateAdmin();
  const { user } = useAuth();

  const grant = async (userId: string) => {
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Admin role granted");
    void invalidate("profiles");
  };

  const revoke = async (userId: string) => {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", "admin");
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Admin role revoked");
    void invalidate("profiles");
  };

  return (
    <>
      <AdminPageTitle title="Users" description="Donor accounts and administrator roles." />

      <Card className="overflow-x-auto">
        <table className="admin-data-table w-full min-w-[760px] text-sm">
          <thead className="border-b border-border text-left text-muted-foreground">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Phone</th>
              <th className="p-3 font-medium">Joined</th>
              <th className="p-3 font-medium">Roles</th>
              <th className="p-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(profiles ?? []).map((p) => {
              const isAdmin = p.roles.includes("admin");
              const isSelf = p.id === user?.id;
              return (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="p-3 font-medium" data-label="Name"><div>{p.full_name || "—"}</div></td>
                  <td className="p-3 text-muted-foreground" data-label="Email"><div>{p.email}</div></td>
                  <td className="p-3 text-muted-foreground" data-label="Phone"><div>{p.phone || "—"}</div></td>
                  <td className="p-3 text-muted-foreground" data-label="Joined"><div>{formatDate(p.created_at)}</div></td>
                  <td className="p-3" data-label="Roles"><div>
                    {p.roles.length ? (
                      p.roles.map((r) => (
                        <Badge key={r} variant={r === "admin" ? "default" : "secondary"} className="mr-1">
                          {r}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary">donor</Badge>
                    )}
                  </div></td>
                  <td className="p-3 text-right" data-label="Actions"><div>
                    {isAdmin ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isSelf}
                        onClick={() => void revoke(p.id)}
                      >
                        <ShieldOff className="mr-2 size-4" /> Revoke admin
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => void grant(p.id)}>
                        <ShieldCheck className="mr-2 size-4" /> Make admin
                      </Button>
                    )}
                  </div></td>
                </tr>
              );
            })}
            {!(profiles ?? []).length && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">No users yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}
