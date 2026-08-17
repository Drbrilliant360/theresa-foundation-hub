import { createFileRoute } from "@tanstack/react-router";
import { HeartHandshake, Target, Eye, ShieldCheck } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { aboutImage } from "@/lib/images";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Theresa Foundation" },
      {
        name: "description",
        content:
          "Learn how the Theresa Foundation partners with Tanzanian communities to deliver education, healthcare and clean water programmes.",
      },
      { property: "og:title", content: "About Us — Theresa Foundation" },
      {
        property: "og:description",
        content: "Our mission, vision and values, and the communities we serve in Tanzania.",
      },
    ],
  }),
  component: About,
});

const milestones = [
  { year: "2012", text: "Foundation established in Dar es Salaam with a single school project." },
  { year: "2016", text: "First mobile clinic launched, reaching 12 rural villages." },
  { year: "2020", text: "Clean water programme delivers 30 boreholes across Dodoma." },
  { year: "2025", text: "Over 40,000 beneficiaries supported nationwide." },
];

function About() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="About us"
        title="Community-led change across Tanzania"
        description="We work alongside local leaders, teachers and health workers so that every programme is designed by the people it serves."
      />

      <section className="container-page grid items-center gap-12 py-16 lg:grid-cols-2">
        <img
          src={aboutImage}
          alt="Theresa Foundation team meeting with community members"
          className="h-80 w-full rounded-3xl object-cover"
        />
        <div className="space-y-6">
          {[
            { icon: Target, title: "Our mission", text: "To unlock opportunity for children and families through education, health and sustainable livelihoods." },
            { icon: Eye, title: "Our vision", text: "A Tanzania where no child's future is limited by where they were born." },
            { icon: ShieldCheck, title: "Our promise", text: "Every donation is tracked and reported. 85% of funds go directly to programmes." },
            { icon: HeartHandshake, title: "Our approach", text: "Partnership first — communities set the priorities, we help resource them." },
          ].map((v) => (
            <Card key={v.title} className="flex-row items-start gap-4 p-5">
              <v.icon className="mt-1 size-5 shrink-0 text-secondary" />
              <div>
                <h3 className="font-semibold">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.text}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container-page">
          <h2 className="text-3xl font-bold">Our journey</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {milestones.map((m) => (
              <Card key={m.year} className="gap-2 p-6">
                <span className="font-display text-2xl font-bold text-primary">{m.year}</span>
                <p className="text-sm text-muted-foreground">{m.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
