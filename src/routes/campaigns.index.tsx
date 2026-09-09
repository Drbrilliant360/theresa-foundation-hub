import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { CampaignCard } from "@/components/site/CampaignCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCampaigns } from "@/hooks/useData";

export const Route = createFileRoute("/campaigns/")({
  head: () => ({
    meta: [
      { title: "Campaigns — Theresa Foundation" },
      {
        name: "description",
        content:
          "Browse active Theresa Foundation campaigns in education, healthcare, water and emergency relief, and support the cause closest to your heart.",
      },
      { property: "og:title", content: "Campaigns — Theresa Foundation" },
      {
        property: "og:description",
        content: "Active fundraising campaigns supporting communities across Tanzania.",
      },
    ],
  }),
  component: Campaigns,
});

function Campaigns() {
  const { data, isLoading } = useCampaigns();
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set((data ?? []).map((c) => c.category)))],
    [data],
  );

  const filtered = (data ?? []).filter(
    (c) =>
      (category === "all" || c.category === category) &&
      c.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Campaigns"
        title="Choose a cause to support"
        description="Every campaign shows live progress toward its goal, so you always know where your donation lands."
        background={heroImage}
      />

      <section className="container-page py-12">
        <div className="flex flex-wrap items-center gap-3">
          {categories.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? "default" : "outline"}
              className="capitalize"
              onClick={() => setCategory(c)}
            >
              {c}
            </Button>
          ))}
          <Input
            placeholder="Search campaigns…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="ml-auto w-full sm:w-64"
          />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-xl" />
              ))
            : filtered.map((c) => <CampaignCard key={c.slug} campaign={c} />)}
        </div>

        {!isLoading && filtered.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">No campaigns match your filters.</p>
        )}
      </section>
    </SiteLayout>
  );
}
