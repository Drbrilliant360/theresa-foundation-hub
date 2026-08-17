import { Link } from "@tanstack/react-router";
import { Users, CalendarClock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { imageFor } from "@/lib/images";
import { formatTZS, progressPercent, daysRemaining } from "@/lib/format";

type Campaign = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  image_key: string;
  raised_amount: number;
  goal_amount: number;
  donor_count: number;
  end_date: string | null;
};

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const pct = progressPercent(campaign.raised_amount, campaign.goal_amount);
  const days = daysRemaining(campaign.end_date);

  return (
    <Card className="group overflow-hidden p-0 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-lift)]">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageFor(campaign.image_key)}
          alt={campaign.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground capitalize">
          {campaign.category}
        </Badge>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">{campaign.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{campaign.summary}</p>
        </div>
        <div className="space-y-2">
          <Progress value={pct} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-secondary">{formatTZS(campaign.raised_amount)}</span>
            <span className="text-muted-foreground">of {formatTZS(campaign.goal_amount)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" /> {campaign.donor_count} donors
          </span>
          {days !== null && (
            <span className="flex items-center gap-1">
              <CalendarClock className="size-3.5" /> {days} days left
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="flex-1">
            <Link to="/campaigns/$slug" params={{ slug: campaign.slug }}>
              Details
            </Link>
          </Button>
          <Button
            asChild
            className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            <Link to="/donate" search={{ campaign: campaign.slug }}>
              Donate
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
