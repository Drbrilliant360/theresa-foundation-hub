import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, Users, Target } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { imageFor } from "@/lib/images";
import { formatTZS, progressPercent, daysRemaining, formatDate } from "@/lib/format";
import { useCampaign } from "@/hooks/useData";

export const Route = createFileRoute("/campaigns/$slug")({
  head: () => ({
    meta: [
      { title: "Campaign — Theresa Foundation" },
      {
        name: "description",
        content: "Campaign details, fundraising progress and donation options.",
      },
      { property: "og:title", content: "Campaign — Theresa Foundation" },
      {
        property: "og:description",
        content: "Campaign details, fundraising progress and donation options.",
      },
    ],
  }),
  component: CampaignDetail,
});

function CampaignDetail() {
  const { slug } = Route.useParams();
  const { data: campaign, isLoading } = useCampaign(slug);

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="container-page py-16">
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </SiteLayout>
    );
  }

  if (!campaign) {
    return (
      <SiteLayout>
        <div className="container-page py-24 text-center">
          <h1 className="text-2xl font-bold">Campaign not found</h1>
          <Button asChild className="mt-6">
            <Link to="/campaigns">Back to campaigns</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const pct = progressPercent(campaign.raised_amount, campaign.goal_amount);
  const days = daysRemaining(campaign.end_date);

  return (
    <SiteLayout>
      <div className="container-page grid gap-10 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <img
            src={imageFor(campaign.image_key)}
            alt={campaign.title}
            className="h-80 w-full rounded-3xl object-cover"
          />
          <Badge className="mt-6 bg-accent capitalize text-accent-foreground">
            {campaign.category}
          </Badge>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{campaign.title}</h1>
          <p className="mt-3 text-muted-foreground">{campaign.summary}</p>
          <div className="mt-6 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
            {campaign.description}
          </div>
        </div>

        <aside className="space-y-6">
          <Card className="gap-4 p-6 shadow-[var(--shadow-card)]">
            <div>
              <span className="font-display text-3xl font-bold text-secondary">
                {formatTZS(campaign.raised_amount)}
              </span>
              <p className="text-sm text-muted-foreground">
                raised of {formatTZS(campaign.goal_amount)} goal
              </p>
            </div>
            <Progress value={pct} className="h-2.5" />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="size-4" /> {campaign.donor_count} donors
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="size-4" /> {pct}% funded
              </div>
              {days !== null && (
                <div className="col-span-2 flex items-center gap-2 text-muted-foreground">
                  <CalendarClock className="size-4" /> {days} days left · ends{" "}
                  {formatDate(campaign.end_date)}
                </div>
              )}
            </div>
            <Button
              asChild
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <Link to="/donate" search={{ campaign: campaign.slug }}>
                Donate to this campaign
              </Link>
            </Button>
          </Card>
        </aside>
      </div>
    </SiteLayout>
  );
}
