import { createFileRoute } from "@tanstack/react-router";
import { HandCoins, Megaphone, Package, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminPageTitle } from "@/components/admin/AdminShell";
import {
  useAdminCampaigns,
  useAdminDonations,
  useAdminOrders,
  useAdminProfiles,
} from "@/hooks/useAdmin";
import { formatDate, formatTZS } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Admin Overview — Theresa Foundation" },
      { name: "description", content: "Foundation performance and admin dashboard." },
      { property: "og:title", content: "Admin Overview — Theresa Foundation" },
      { property: "og:description", content: "Foundation performance and admin dashboard." },
    ],
  }),
  component: AdminOverview,
});


function AdminOverview() {
  const { data: campaigns } = useAdminCampaigns();
  const { data: donations } = useAdminDonations();
  const { data: orders } = useAdminOrders();
  const { data: profiles } = useAdminProfiles();

  const completed = (donations ?? []).filter((d) => d.status === "completed");
  const raised = completed.reduce((s, d) => s + Number(d.amount), 0);
  const pending = (donations ?? []).filter((d) => d.status === "pending").length;

  const stats = [
    { label: "Total raised", value: formatTZS(raised), icon: HandCoins, hint: `${completed.length} completed gifts` },
    { label: "Active campaigns", value: String((campaigns ?? []).filter((c) => c.status === "active").length), icon: Megaphone, hint: `${(campaigns ?? []).length} total` },
    { label: "T-shirt orders", value: String((orders ?? []).length), icon: Package, hint: `${(orders ?? []).filter((o) => o.status !== "delivered").length} in progress` },
    { label: "Registered donors", value: String((profiles ?? []).length), icon: Users, hint: `${pending} pending payments` },
  ];

  return (
    <>
      <AdminPageTitle title="Overview" description="Foundation performance at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <s.icon className="size-4 text-primary" />
            </div>
            <p className="mt-2 break-words text-xl font-bold sm:text-2xl">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-display font-semibold">Recent donations</h2>
          <div className="mt-4 space-y-3">
            {(donations ?? []).slice(0, 6).map((d) => (
              <div key={d.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border pb-3 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{d.donor_name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {d.reference} · {formatDate(d.created_at)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold">{formatTZS(d.amount)}</p>
                  <Badge variant={d.status === "completed" ? "default" : "secondary"} className="mt-1 text-[10px]">
                    {d.status}
                  </Badge>
                </div>
              </div>
            ))}
            {!(donations ?? []).length && <p className="text-sm text-muted-foreground">No donations yet.</p>}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-display font-semibold">Campaign progress</h2>
          <div className="mt-4 space-y-4">
            {(campaigns ?? []).slice(0, 6).map((c) => {
              const pct = Number(c.goal_amount) ? Math.min(100, Math.round((Number(c.raised_amount) / Number(c.goal_amount)) * 100)) : 0;
              return (
                <div key={c.id}>
                  <div className="flex justify-between gap-2 text-sm">
                    <span className="min-w-0 truncate font-medium">{c.title}</span>
                    <span className="shrink-0 text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-secondary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {!(campaigns ?? []).length && <p className="text-sm text-muted-foreground">No campaigns yet.</p>}
          </div>
        </Card>
      </div>
    </>
  );
}
