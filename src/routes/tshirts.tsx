import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { imageFor } from "@/lib/images";
import { formatTZS } from "@/lib/format";
import { useTemplates } from "@/hooks/useData";

export const Route = createFileRoute("/tshirts")({
  head: () => ({
    meta: [
      { title: "Supporter T-Shirts — Theresa Foundation" },
      {
        name: "description",
        content:
          "Qualifying donations earn a limited-edition Theresa Foundation supporter t-shirt. Browse the designs and donation thresholds.",
      },
      { property: "og:title", content: "Supporter T-Shirts — Theresa Foundation" },
      {
        property: "og:description",
        content: "Limited-edition supporter t-shirts for qualifying donations.",
      },
    ],
  }),
  component: Tshirts,
});

function Tshirts() {
  const { data, isLoading } = useTemplates();

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="T-Shirts"
        title="Wear the change you fund"
        description="Donate above a design's threshold and we'll reserve a supporter t-shirt in your size."
      />

      <section className="container-page grid gap-6 py-10 sm:grid-cols-2 sm:py-14 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-96 rounded-xl" />)
          : (data ?? []).map((t) => (
              <Card key={t.id} className="overflow-hidden p-0">
                <img
                  src={imageFor(t.image_key)}
                  alt={`${t.name} supporter t-shirt`}
                  loading="lazy"
                  className="h-64 w-full object-cover"
                />
                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold">{t.name}</h3>
                    <Badge variant="secondary">{formatTZS(t.min_donation_amount)}+</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Button asChild variant="outline">
                      <Link to="/donate">Donate</Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    >
                      <Link to="/checkout" search={{ design: t.id }}>
                        Claim shirt
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
      </section>
    </SiteLayout>
  );
}
