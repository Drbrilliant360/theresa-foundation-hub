import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AdminPageTitle } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAdminOrders, useInvalidateAdmin } from "@/hooks/useAdmin";
import { formatDate, ORDER_STEPS, ORDER_STEP_LABELS } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const { data: orders } = useAdminOrders();
  const invalidate = useInvalidateAdmin();

  const setStatus = async (id: string, value: string) => {
    const { error } = await supabase
      .from("tshirt_orders")
      .update({ status: value as (typeof ORDER_STEPS)[number] })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Order status updated");
    void invalidate("orders");
  };


  return (
    <>
      <AdminPageTitle title="T-shirt orders" description="Fulfil supporter t-shirt orders." />

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-border text-left text-muted-foreground">
            <tr>
              <th className="p-3 font-medium">Donor</th>
              <th className="p-3 font-medium">Design</th>
              <th className="p-3 font-medium">Size</th>
              <th className="p-3 font-medium">Qty</th>
              <th className="p-3 font-medium">Ordered</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0">
                <td className="p-3">
                  <p className="font-medium">{o.donations?.donor_name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{o.donations?.reference}</p>
                </td>
                <td className="p-3 text-muted-foreground">{o.tshirt_templates?.name ?? "—"}</td>
                <td className="p-3"><Badge variant="outline">{o.size}</Badge></td>
                <td className="p-3">{o.quantity}</td>
                <td className="p-3 text-muted-foreground">{formatDate(o.created_at)}</td>
                <td className="p-3">
                  <Select value={o.status} onValueChange={(v) => void setStatus(o.id, v)}>
                    <SelectTrigger className="h-8 w-44"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ORDER_STEPS.map((s) => (
                        <SelectItem key={s} value={s}>{ORDER_STEP_LABELS[s] ?? s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
            {!(orders ?? []).length && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">No orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}
