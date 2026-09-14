import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Loader2, ShieldCheck, Truck } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTemplates } from "@/hooks/useData";
import { imageFor } from "@/lib/images";
import { formatTZS, PAYMENT_METHODS, TSHIRT_SIZES } from "@/lib/format";

type CheckoutSearch = { design?: string | undefined };

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>): CheckoutSearch => ({
    design: typeof search["design"] === "string" ? (search["design"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Checkout — Supporter T-Shirts — Theresa Foundation" },
      {
        name: "description",
        content:
          "Demo checkout for Theresa Foundation supporter t-shirts: pick your size, add delivery details and confirm your donation.",
      },
      { property: "og:title", content: "Checkout — Supporter T-Shirts" },
      {
        property: "og:description",
        content: "Reserve your supporter t-shirt with a qualifying donation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

const DELIVERY_FEE = 5000;

function CheckoutPage() {
  const { design } = Route.useSearch();
  const { data: templates, isLoading } = useTemplates();
  const [selectedId, setSelectedId] = useState<string | null>(design ?? null);
  const [size, setSize] = useState<string>("M");
  const [method, setMethod] = useState<string>("mpesa");
  const [processing, setProcessing] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const list = templates ?? [];
  const selected = list.find((t) => t.id === selectedId) ?? list[0];
  const donation = Number(selected?.min_donation_amount ?? 0);
  const total = donation + DELIVERY_FEE;

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setReference(`TF-TS-${Math.floor(100000 + Math.random() * 899999)}`);
    }, 1500);
  }

  if (reference) {
    return (
      <SiteLayout>
        <section className="container-page flex justify-center py-12 sm:py-20">
          <Card className="w-full max-w-lg p-6 text-center sm:p-10">
            <CheckCircle2 className="mx-auto size-14 text-secondary" />
            <h1 className="mt-4 text-2xl font-bold">Order confirmed</h1>
            <p className="mt-2 text-muted-foreground">
              Your {selected?.name} in size {size} is reserved. We'll contact you when it is ready
              for pickup or delivery.
            </p>
            <p className="mt-4 rounded-lg bg-surface px-4 py-3 font-mono text-sm">{reference}</p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <Button asChild variant="outline">
                <Link to="/tshirts">Back to designs</Link>
              </Button>
              <Button asChild>
                <Link to="/dashboard">View my orders</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              This is a demo checkout — no real payment was taken.
            </p>
          </Card>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Checkout"
        title="Reserve your supporter t-shirt"
        description="Choose a design and size, then confirm your donation. This is a demo checkout — no real payment is processed."
      />

      <section className="container-page grid gap-6 py-10 sm:py-14 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-5 sm:p-8">
          <form className="space-y-8" onSubmit={submit}>
            <div className="space-y-3">
              <Label>Design</Label>
              {isLoading ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-40 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-3">
                  {list.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedId(t.id)}
                      className={`overflow-hidden rounded-xl border text-left transition-colors ${
                        selected?.id === t.id ? "border-primary ring-2 ring-primary/30" : "border-border"
                      }`}
                    >
                      <img
                        src={imageFor(t.image_key)}
                        alt={`${t.name} supporter t-shirt`}
                        loading="lazy"
                        className="h-28 w-full object-cover"
                      />
                      <span className="block p-2 text-xs font-medium">{t.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Size</Label>
              <div className="flex flex-wrap gap-2">
                {TSHIRT_SIZES.map((s) => (
                  <Button
                    key={s}
                    type="button"
                    variant={size === s ? "default" : "outline"}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" defaultValue="Dar es Salaam" required />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Delivery address</Label>
                <Input id="address" name="address" required />
              </div>
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
              disabled={processing || !selected}
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Processing payment…
                </>
              ) : (
                `Pay ${formatTZS(total)}`
              )}
            </Button>
          </form>
        </Card>

        <Card className="h-fit overflow-hidden p-0">
          {selected && (
            <img
              src={imageFor(selected.image_key)}
              alt={`${selected.name} supporter t-shirt`}
              loading="lazy"
              decoding="async"
              className="h-56 w-full object-cover"
            />
          )}
          <div className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-display text-lg font-semibold">{selected?.name ?? "Select a design"}</h2>
                <p className="text-sm text-muted-foreground">Size {size}</p>
              </div>
              <Badge variant="secondary" className="shrink-0">
                {formatTZS(donation)}+
              </Badge>
            </div>
            <div className="space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Donation</span>
                <span>{formatTZS(donation)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span>{formatTZS(DELIVERY_FEE)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-semibold">
                <span>Total</span>
                <span>{formatTZS(total)}</span>
              </div>
            </div>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 shrink-0" /> Demo checkout — no real payment is taken.
            </p>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="size-4 shrink-0" /> Delivery within 5–7 working days in Tanzania.
            </p>
          </div>
        </Card>
      </section>
    </SiteLayout>
  );
}
