import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCampaigns } from "@/hooks/useData";
import { formatTZS, PAYMENT_METHODS } from "@/lib/format";

type DonateSearch = { campaign?: string | undefined };

const PRESETS = [10000, 25000, 50000, 100000];

export const Route = createFileRoute("/donate")({
  validateSearch: (search: Record<string, unknown>): DonateSearch => ({
    campaign: typeof search["campaign"] === "string" ? (search["campaign"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Donate — Theresa Foundation" },
      {
        name: "description",
        content:
          "Make a secure donation to Theresa Foundation with M-Pesa, Airtel Money, Tigo Pesa or card and receive an instant receipt.",
      },
      { property: "og:title", content: "Donate — Theresa Foundation" },
      {
        property: "og:description",
        content: "Support education, healthcare and community projects across Tanzania.",
      },
    ],
  }),
  component: DonatePage,
});

function DonatePage() {
  const { campaign } = Route.useSearch();
  const { user } = useAuth();
  const { data: campaigns } = useCampaigns();
  const [amount, setAmount] = useState<number>(25000);
  const [campaignSlug, setCampaignSlug] = useState<string>(campaign ?? "");
  const [method, setMethod] = useState<string>("mpesa");
  const [processing, setProcessing] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const selected = campaigns?.find((c) => c.slug === campaignSlug);
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    const { data, error } = await supabase
      .from("donations")
      .insert({
        user_id: user?.id ?? null,
        donor_name: String(fd.get("donor_name")),
        donor_email: String(fd.get("donor_email")),
        donor_phone: String(fd.get("donor_phone") ?? ""),
        amount,
        campaign_id: selected?.id ?? null,
        payment_method: method,
        status: "completed",
      })
      .select("reference")
      .maybeSingle();
    setProcessing(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setReference(data?.reference ?? "TF");
    toast.success("Thank you for your donation!");
  }

  if (reference) {
    return (
      <SiteLayout>
        <section className="container-page flex justify-center py-20">
          <Card className="w-full max-w-lg p-10 text-center">
            <CheckCircle2 className="mx-auto size-14 text-secondary" />
            <h1 className="mt-4 text-2xl font-bold">Donation successful</h1>
            <p className="mt-2 text-muted-foreground">
              Your donation of {formatTZS(amount)} has been received.
            </p>
            <p className="mt-4 rounded-lg bg-surface px-4 py-3 font-mono text-sm">{reference}</p>
            <Button className="mt-6 w-full" onClick={() => setReference(null)}>
              Make another donation
            </Button>
          </Card>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Give today"
        title="Make a donation"
        description="Every contribution funds education, healthcare and community programs in Tanzania."
      />
      <section className="container-page py-12">
        <Card className="mx-auto max-w-2xl p-8">
          <form className="space-y-6" onSubmit={submit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="donor_name">Full name</Label>
                <Input id="donor_name" name="donor_name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donor_email">Email</Label>
                <Input id="donor_email" name="donor_email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donor_phone">Phone</Label>
                <Input id="donor_phone" name="donor_phone" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign">Campaign</Label>
                <select
                  id="campaign"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={campaignSlug}
                  onChange={(e) => setCampaignSlug(e.target.value)}
                >
                  <option value="">General fund</option>
                  {campaigns?.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Amount</Label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <Button
                    key={p}
                    type="button"
                    variant={amount === p ? "default" : "outline"}
                    onClick={() => setAmount(p)}
                  >
                    {formatTZS(p)}
                  </Button>
                ))}
              </div>
              <Input
                type="number"
                min={1000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Payment method</Label>
              <div className="grid gap-2 sm:grid-cols-3">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                      method === m.id ? "border-primary bg-surface" : "border-border"
                    }`}
                  >
                    <span className="font-medium">{m.label}</span>
                    <span className="block text-xs text-muted-foreground">{m.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={processing}
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Processing payment…
                </>
              ) : (
                `Donate ${formatTZS(amount)}`
              )}
            </Button>
          </form>
        </Card>
      </section>
    </SiteLayout>
  );
}
