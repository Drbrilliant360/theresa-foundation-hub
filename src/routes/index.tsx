import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  HeartHandshake,
  GraduationCap,
  Stethoscope,
  Users,
  Sparkles,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CampaignCard } from "@/components/site/CampaignCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { heroImage, aboutImage, savannaImage } from "@/lib/images";
import { formatTZS, formatCompact } from "@/lib/format";
import { useCampaigns, useFaqs, useImpactStats, useTestimonials } from "@/hooks/useData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Theresa Foundation — Together We Can Change Lives" },
      {
        name: "description",
        content:
          "Support education, healthcare and clean water projects across Tanzania. Donate securely and track your impact with the Theresa Foundation.",
      },
      { property: "og:title", content: "Theresa Foundation — Together We Can Change Lives" },
      {
        property: "og:description",
        content: "Donate to community projects across Tanzania and track your impact.",
      },
    ],
  }),
  component: Index,
});

function Counter({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    const total = 45;
    const tick = () => {
      frame += 1;
      setDisplay(Math.round((value * frame) / total));
      if (frame < total) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [value]);

  return (
    <span ref={ref}>
      {prefix}
      {formatCompact(display)}
    </span>
  );
}

const allocation = [
  { label: "Education", pct: 40 },
  { label: "Healthcare", pct: 25 },
  { label: "Community", pct: 20 },
  { label: "Administration", pct: 15 },
];

function Index() {
  const { data: campaigns } = useCampaigns();
  const { data: stats } = useImpactStats();
  const { data: testimonials } = useTestimonials();
  const { data: faqs } = useFaqs();
  const featured = (campaigns ?? []).slice(0, 6);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="container-page grid items-center gap-10 py-12 sm:py-20 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
              <Sparkles className="size-3.5" /> Serving Tanzanian communities since 2012
            </span>
            <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Together We Can Change Lives
            </h1>
            <p className="mt-4 max-w-lg text-base opacity-85">
              Every donation funds education, healthcare and clean water for families who
              need it most — and every shilling is tracked, transparently.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <Link to="/donate">
                  Donate Now <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent hover:bg-primary-foreground/10"
              >
                <Link to="/campaigns">Explore campaigns</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Founder and executive director of the Theresa Foundation"
              className="h-60 w-full rounded-3xl object-cover object-top shadow-[var(--shadow-lift)] sm:h-80 lg:h-[26rem]"
            />
            <Card className="mt-4 flex w-full flex-col gap-1 p-5 shadow-[var(--shadow-lift)] sm:absolute sm:-bottom-6 sm:left-4 sm:mt-0 sm:w-56">
              <span className="text-xs text-muted-foreground">Total raised</span>
              <span className="font-display text-2xl font-bold text-secondary">
                {formatTZS(stats?.raised ?? 0)}
              </span>
              <span className="text-xs text-muted-foreground">
                across {stats?.campaigns ?? 0} active campaigns
              </span>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact counters */}
      <section className="bg-surface py-10 sm:py-16">
        <div className="container-page grid grid-cols-2 gap-6 lg:grid-cols-5">
          {[
            { label: "TZS raised", value: stats?.raised ?? 0 },
            { label: "Donors", value: stats?.donors ?? 0 },
            { label: "Volunteers", value: stats?.volunteers ?? 0 },
            { label: "Campaigns", value: stats?.campaigns ?? 0 },
            { label: "Beneficiaries", value: stats?.beneficiaries ?? 0 },
          ].map((s) => (
            <Card key={s.label} className="items-center gap-1 p-6 text-center">
              <span className="font-display text-3xl font-bold text-primary">
                <Counter value={s.value} />
              </span>
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                {s.label}
              </span>
            </Card>
          ))}
        </div>
      </section>

      {/* About preview */}
      <section className="py-12 sm:py-20">
        <div className="container-page grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
          <img
            src={aboutImage}
            alt="Foundation volunteers working with a local community"
            loading="lazy"
            className="h-60 w-full rounded-3xl object-cover sm:h-80"
          />
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
              Who we are
            </span>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Local roots, lasting change</h2>
            <p className="mt-4 text-muted-foreground">
              The Theresa Foundation partners with schools, clinics and village committees
              across Tanzania to deliver programmes designed by the people they serve.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: GraduationCap, title: "Mission", text: "Education for every child" },
                { icon: Stethoscope, title: "Vision", text: "Healthy, thriving villages" },
                { icon: HeartHandshake, title: "Values", text: "Dignity, trust, transparency" },
              ].map((v) => (
                <Card key={v.title} className="gap-2 p-5">
                  <v.icon className="size-5 text-secondary" />
                  <span className="font-semibold">{v.title}</span>
                  <span className="text-sm text-muted-foreground">{v.text}</span>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Campaigns */}
      <section className="bg-surface py-12 sm:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
                Campaigns
              </span>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Where your donation goes</h2>
            </div>
            <Button asChild variant="outline" className="shrink-0">
              <Link to="/campaigns">View all campaigns</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <CampaignCard key={c.slug} campaign={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Allocation */}
      <section className="py-12 sm:py-20">
        <div className="container-page grid gap-8 sm:gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">How donations help</h2>
            <p className="mt-3 text-muted-foreground">
              We publish exactly how every contribution is allocated across our programmes.
            </p>
          </div>
          <div className="space-y-5">
            {allocation.map((a) => (
              <div key={a.label}>
                <div className="flex justify-between text-sm font-medium">
                  <span>{a.label}</span>
                  <span className="text-muted-foreground">{a.pct}%</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-secondary"
                    style={{ width: `${a.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-surface py-12 sm:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-bold sm:text-3xl">Voices from our community</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {(testimonials ?? []).slice(0, 3).map((t) => (
              <Card key={t.id} className="gap-4 p-6">
                <Users className="size-5 text-accent" />
                <p className="text-sm text-muted-foreground">“{t.story}”</p>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-20">
        <div className="container-page max-w-3xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-8">
            {(faqs ?? []).map((f) => (
              <AccordionItem key={f.id} value={f.id}>
                <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-5 py-10 text-center text-primary-foreground sm:px-8 sm:py-14">
          <img
            src={savannaImage}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/85" />
          <div className="relative">
            <h2 className="text-2xl font-bold sm:text-3xl">Your gift changes a life today</h2>
            <p className="mx-auto mt-3 max-w-xl opacity-85">
              Give once or monthly — and receive a limited-edition Theresa Foundation t-shirt
              with qualifying donations.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <Link to="/donate">Donate Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
