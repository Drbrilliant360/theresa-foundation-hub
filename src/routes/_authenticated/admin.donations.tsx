import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AdminPageTitle } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAdminDonations, useInvalidateAdmin } from "@/hooks/useAdmin";
import { formatDate, formatTZS, paymentLabel } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/donations")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Donations — Admin — Theresa Foundation" },
      { name: "description", content: "Track and update donations for the Theresa Foundation." },
      { property: "og:title", content: "Donations — Admin — Theresa Foundation" },
      { property: "og:description", content: "Track and update donations for the Theresa Foundation." },
    ],
  }),
  component: AdminDonations,
});


const STATUSES = ["pending", "completed", "failed", "refunded"] as const;

function AdminDonations() {
  const { data: donations } = useAdminDonations();
  const invalidate = useInvalidateAdmin();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (donations ?? []).filter((d) => {
      const matchesStatus = status === "all" || d.status === status;
      const matchesTerm =
        !term ||
        d.donor_name.toLowerCase().includes(term) ||
        d.donor_email.toLowerCase().includes(term) ||
        d.reference.toLowerCase().includes(term);
      return matchesStatus && matchesTerm;
    });
  }, [donations, q, status]);

  const total = rows.filter((d) => d.status === "completed").reduce((s, d) => s + Number(d.amount), 0);

  const setDonationStatus = async (id: string, value: string) => {
    const { error } = await supabase
      .from("donations")
      .update({ status: value as (typeof STATUSES)[number] })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Donation updated");
    void invalidate("donations");
  };


  return (
    <>
      <AdminPageTitle
        title="Donations"
        description={`${rows.length} records · ${formatTZS(total)} completed`}
      />

      <div className="mb-4 grid gap-3 sm:flex">
        <Input
          className="w-full sm:max-w-xs"
          placeholder="Search name, email or reference"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-x-auto">
        <table className="admin-data-table w-full min-w-[860px] text-sm">
          <thead className="border-b border-border text-left text-muted-foreground">
            <tr>
              <th className="p-3 font-medium">Reference</th>
              <th className="p-3 font-medium">Donor</th>
              <th className="p-3 font-medium">Campaign</th>
              <th className="p-3 font-medium">Amount</th>
              <th className="p-3 font-medium">Method</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id} className="border-b border-border last:border-0">
                <td className="p-3 font-mono text-xs" data-label="Reference"><div>{d.reference}</div></td>
                <td className="p-3" data-label="Donor"><div>
                  <p className="font-medium">{d.anonymous ? "Anonymous" : d.donor_name}</p>
                  <p className="text-xs text-muted-foreground">{d.donor_email}</p>
                </div></td>
                <td className="p-3 text-muted-foreground" data-label="Campaign"><div>{d.campaigns?.title ?? "General fund"}</div></td>
                <td className="p-3 font-semibold" data-label="Amount"><div>{formatTZS(d.amount)}</div></td>
                <td className="p-3 text-muted-foreground" data-label="Method"><div>{paymentLabel(d.payment_method)}</div></td>
                <td className="p-3 text-muted-foreground" data-label="Date"><div>{formatDate(d.created_at)}</div></td>
                <td className="p-3" data-label="Status"><div>
                  <Select value={d.status} onValueChange={(v) => void setDonationStatus(d.id, v)}>
                    <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div></td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted-foreground">No donations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
        {STATUSES.map((s) => (
          <Badge key={s} variant="outline">
            {s}: {(donations ?? []).filter((d) => d.status === s).length}
          </Badge>
        ))}
      </div>
    </>
  );
}
