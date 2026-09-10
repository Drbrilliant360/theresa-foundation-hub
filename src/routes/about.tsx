import { createFileRoute } from "@tanstack/react-router";
import { HeartHandshake, Target, Eye, ShieldCheck } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { aboutImage, givingHandsImage } from "@/lib/images";

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
  { year: "2026", text: "Constitution adopted on 05 January 2026 as Karungi Foundation (KARFOU)." },
];

const facts = [
  { label: "Registered name", value: "Karungi Foundation (KARFOU)" },
  { label: "Status", value: "Non-governmental, non-profit organisation registered in Tanzania" },
  { label: "Head office", value: "Igabiro–Bunyagongo, Nshamba, Muleba District, Kagera Region" },
  { label: "Area of operation", value: "Muleba District, expanding to other districts and regions" },
];

const focusAreas = [
  "Education support for vulnerable children",
  "Health education, HIV/AIDS awareness and sanitation",
  "Agriculture, food security and market access",
  "Entrepreneurship and youth skills training",
  "Women and youth economic empowerment",
  "Environmental conservation and disaster response",
  "Orphan care, shelter and nutrition",
  "Human rights, legal aid and counselling",
];

function About() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="About us"
        title="Community-led change across Tanzania"
        description="We work alongside local leaders, teachers and health workers so that every programme is designed by the people it serves."
        background={givingHandsImage}
      />

      <section className="container-page grid items-center gap-12 py-16 lg:grid-cols-2">
        <img
          src={aboutImage}
          alt="Theresa Foundation team meeting with community members"
          className="h-80 w-full rounded-3xl object-cover"
        />
        <div className="space-y-6">
          {[
            { icon: Target, title: "Our mission", text: "To capacitate the Tanzanian community to fight poverty and ignorance through health, water and education support and local economic activities, in a sustainable way." },
            { icon: Eye, title: "Our vision", text: "An empowered community of Tanzania in which people effectively manage their own lives." },
            { icon: ShieldCheck, title: "Our goal", text: "That all youth, women, children and people with disabilities are empowered to engage in income-generating activities and contribute to their own prosperity." },
            { icon: HeartHandshake, title: "Our core values", text: "Professional, empathetic understanding of human values, gender equality, transparency and sustainable, community-led development." },
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
          <h2 className="text-2xl font-bold sm:text-3xl">Our journey</h2>
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
