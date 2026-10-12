import { createFileRoute, Link } from "@tanstack/react-router";
import { HandCoins, Megaphone, Shirt } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMyDonations, useMyOrders, useProfile } from "@/hooks/useData";
import { useIsAdmin } from "@/hooks/useAdmin";
import { formatDate, formatTZS } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Donor Dashboard — Theresa Foundation" },
      { name: "description", content: "Track your donations, receipts and t-shirt orders." },
      { property: "og:title", content: "Donor Dashboard — Theresa Foundation" },
      { property: "og:description", content: "Your giving history with Theresa Foundation." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: donations } = useMyDonations(user?.id);
  const { data: orders } = useMyOrders(user?.id);
  const { isAdmin } = useIsAdmin();

  const total = (donations ?? []).reduce((s, d) => s + Number(d.amount), 0);
  const campaigns = new Set((donations ?? []).map((d) => d.campaign_id).filter(Boolean)).size;
  const shirts = (orders ?? []).reduce((s, o) => s + o.quantity, 0);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Donor portal"
        title={`Welcome, ${profile?.full_name || user?.email || "friend"}`}
        description="Your donations, receipts and supporter t-shirts in one place."
      />
      <section className="container-page space-y-8 py-10">
        {isAdmin && (
          <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <p className="font-semibold">You have administrator access</p>
              <p className="text-sm text-muted-foreground">
                Manage campaigns, donations, orders and site content.
              </p>
            </div>
            <Button asChild>
              <Link to="/admin">Open admin panel</Link>
            </Button>
          </Card>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={HandCoins} label="Total donated" value={formatTZS(total)} />
          <StatCard icon={Megaphone} label="Campaigns supported" value={String(campaigns)} />
          <StatCard icon={Shirt} label="T-shirts earned" value={String(shirts)} />
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold">Recent donations</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="py-2">Reference</th>
                  <th>Campaign</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(donations ?? []).map((d) => (
                  <tr key={d.id} className="border-t border-border">
                    <td className="py-3 font-mono text-xs">{d.reference}</td>
                    <td>{d.campaigns?.title ?? "General fund"}</td>
                    <td>{formatTZS(d.amount)}</td>
                    <td>{formatDate(d.created_at)}</td>
                    <td>
                      <Badge variant="secondary">{d.status}</Badge>
                    </td>
                  </tr>
                ))}
                {!donations?.length && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">
                      No donations yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold">My t-shirts</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(orders ?? []).map((o) => (
              <div key={o.id} className="rounded-lg border border-border p-4 text-sm">
                <p className="font-medium">{o.tshirt_templates?.name}</p>
                <p className="text-muted-foreground">
                  Size {o.size} · Qty {o.quantity}
                </p>
                <Badge className="mt-2" variant="outline">
                  {o.status}
                </Badge>
              </div>
            ))}
            {!orders?.length && (
              <p className="text-sm text-muted-foreground">No t-shirt orders yet.</p>
            )}
          </div>
        </Card>
      </section>
    </SiteLayout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof HandCoins;
  label: string;
  value: string;
}) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </Card>
  );
}
