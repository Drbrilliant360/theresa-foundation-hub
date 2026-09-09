import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { formatTZS } from "@/lib/format";
import { useImpactStats, useTestimonials } from "@/hooks/useData";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Our Impact — Theresa Foundation" },
      {
        name: "description",
        content:
          "See the measurable results of Theresa Foundation programmes: funds raised, donors, beneficiaries and community stories from Tanzania.",
      },
      { property: "og:title", content: "Our Impact — Theresa Foundation" },
      {
        property: "og:description",
        content: "Measurable results from our education, healthcare and water programmes.",
      },
    ],
  }),
  component: Impact,
});

const outcomes = [
  { title: "Classrooms built", value: "128", text: "Across 41 primary schools" },
  { title: "Clinic visits funded", value: "23,400", text: "Mobile and static clinics" },
  { title: "Boreholes drilled", value: "62", text: "Clean water within 1km" },
  { title: "Scholarships awarded", value: "1,850", text: "Secondary and vocational" },
];

function Impact() {
  const { data: stats } = useImpactStats();
  const { data: testimonials } = useTestimonials();

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Impact"
        title="Results you can measure"
        description="We report on outcomes, not just activity — here is what your support has achieved."
        background={careHandsImage}
      />

      <section className="container-page grid grid-cols-2 gap-6 py-10 sm:py-14 lg:grid-cols-4">
        <Card className="gap-1 p-6">
          <span className="font-display text-2xl font-bold text-primary">
            {formatTZS(stats?.raised ?? 0)}
          </span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Raised</span>
        </Card>
        <Card className="gap-1 p-6">
          <span className="font-display text-2xl font-bold text-primary">{stats?.donors ?? 0}</span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Donors</span>
        </Card>
        <Card className="gap-1 p-6">
          <span className="font-display text-2xl font-bold text-primary">
            {stats?.beneficiaries ?? 0}
          </span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            Beneficiaries
          </span>
        </Card>
        <Card className="gap-1 p-6">
          <span className="font-display text-2xl font-bold text-primary">
            {stats?.volunteers ?? 0}
          </span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Volunteers</span>
        </Card>
      </section>

      <section className="bg-surface py-16">
        <div className="container-page">
          <h2 className="text-2xl font-bold sm:text-3xl">Programme outcomes</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {outcomes.map((o) => (
              <Card key={o.title} className="gap-1 p-6">
                <span className="font-display text-3xl font-bold text-secondary">{o.value}</span>
                <span className="font-semibold">{o.title}</span>
                <span className="text-sm text-muted-foreground">{o.text}</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-2xl font-bold sm:text-3xl">Stories from the field</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {(testimonials ?? []).map((t) => (
            <Card key={t.id} className="gap-3 p-6">
              <p className="text-sm text-muted-foreground">“{t.story}”</p>
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
