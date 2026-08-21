import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPageTitle } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAdminCampaigns, useInvalidateAdmin } from "@/hooks/useAdmin";
import { formatTZS } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/campaigns")({
  head: () => ({
    meta: [
      { title: "Campaigns — Admin — Theresa Foundation" },
      { name: "description", content: "Manage fundraising campaigns for the Theresa Foundation." },
      { property: "og:title", content: "Campaigns — Admin — Theresa Foundation" },
      { property: "og:description", content: "Manage fundraising campaigns for the Theresa Foundation." },
    ],
  }),
  component: AdminCampaigns,
});


type Draft = {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  image_key: string;
  goal_amount: string;
  status: string;
  featured: boolean;
};

const empty: Draft = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  category: "Education",
  image_key: "education",
  goal_amount: "1000000",
  status: "active",
  featured: false,
};

const IMAGE_KEYS = ["education", "water", "women", "child", "healthcare", "emergency"];
const STATUSES = ["draft", "active", "paused", "completed"];

function AdminCampaigns() {
  const { data: campaigns, isLoading } = useAdminCampaigns();
  const invalidate = useInvalidateAdmin();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    const payload = {
      title: draft.title,
      slug: draft.slug || draft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      summary: draft.summary,
      description: draft.description,
      category: draft.category,
      image_key: draft.image_key,
      goal_amount: Number(draft.goal_amount || 0),
      status: draft.status as "draft" | "active" | "paused" | "completed",
      featured: draft.featured,
    };
    const { error } = draft.id
      ? await supabase.from("campaigns").update(payload).eq("id", draft.id)
      : await supabase.from("campaigns").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(draft.id ? "Campaign updated" : "Campaign created");
    setDraft(null);
    void invalidate("campaigns");
  };

  const remove = async (id: string, title: string) => {
    if (!confirm(`Delete campaign "${title}"?`)) return;
    const { error } = await supabase.from("campaigns").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Campaign deleted");
    void invalidate("campaigns");
  };


  return (
    <>
      <AdminPageTitle
        title="Campaigns"
        description="Create and manage fundraising campaigns."
        action={
          <Button onClick={() => setDraft({ ...empty })}>
            <Plus className="mr-2 size-4" /> New campaign
          </Button>
        }
      />

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-border text-left text-muted-foreground">
            <tr>
              <th className="p-3 font-medium">Campaign</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Raised / Goal</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(campaigns ?? []).map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="p-3">
                  <p className="font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">/{c.slug}</p>
                </td>
                <td className="p-3 text-muted-foreground">{c.category}</td>
                <td className="p-3">
                  {formatTZS(c.raised_amount)}{" "}
                  <span className="text-muted-foreground">/ {formatTZS(c.goal_amount)}</span>
                </td>
                <td className="p-3">
                  <Badge variant={c.status === "active" ? "default" : "secondary"}>{c.status}</Badge>
                  {c.featured && <Badge variant="outline" className="ml-2">Featured</Badge>}
                </td>
                <td className="p-3 text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      setDraft({
                        id: c.id,
                        title: c.title,
                        slug: c.slug,
                        summary: c.summary,
                        description: c.description,
                        category: c.category,
                        image_key: c.image_key,
                        goal_amount: String(c.goal_amount),
                        status: c.status,
                        featured: c.featured,
                      })
                    }
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => void remove(c.id, c.title)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
            {!isLoading && !(campaigns ?? []).length && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  No campaigns yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft?.id ? "Edit campaign" : "New campaign"}</DialogTitle>
          </DialogHeader>
          {draft && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" placeholder="auto from title" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="summary">Summary</Label>
                <Input id="summary" value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={4} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="goal">Goal (TZS)</Label>
                  <Input id="goal" type="number" value={draft.goal_amount} onChange={(e) => setDraft({ ...draft, goal_amount: e.target.value })} />
                </div>
                <div>
                  <Label>Image</Label>
                  <Select value={draft.image_key} onValueChange={(v) => setDraft({ ...draft, image_key: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {IMAGE_KEYS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={draft.status} onValueChange={(v) => setDraft({ ...draft, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                />
                Feature on the home page
              </label>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
            <Button disabled={saving} onClick={() => void save()}>{saving ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
