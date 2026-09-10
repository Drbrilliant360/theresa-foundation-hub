import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { AdminPageTitle } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { supabase } from "@/integrations/supabase/client";
import { useAdminTemplates, useInvalidateAdmin } from "@/hooks/useAdmin";
import { formatTZS, TSHIRT_SIZES, type TshirtSize } from "@/lib/format";
import { imageFor } from "@/lib/images";

export const Route = createFileRoute("/_authenticated/admin/tshirts")({
  head: () => ({
    meta: [
      { title: "T-Shirts — Admin — Theresa Foundation" },
      { name: "description", content: "Manage supporter t-shirt designs and inventory." },
      { property: "og:title", content: "T-Shirts — Admin — Theresa Foundation" },
      { property: "og:description", content: "Manage supporter t-shirt designs and inventory." },
    ],
  }),
  component: AdminTshirts,
});


type Draft = {
  id?: string;
  name: string;
  description: string;
  image_key: string;
  min_donation_amount: string;
};

const emptyDraft: Draft = {
  name: "",
  description: "",
  image_key: "tshirt-white",
  min_donation_amount: "25000",
};

const DESIGN_IMAGES = [
  { key: "tshirt-white", label: "Heritage White Tee" },
  { key: "tshirt-blue", label: "Royal Blue Tee" },
  { key: "hoodie-navy", label: "Navy Heritage Hoodie" },
];

function AdminTshirts() {
  const { data: templates } = useAdminTemplates();
  const invalidate = useInvalidateAdmin();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const saveTemplate = async () => {
    if (!draft) return;
    if (!draft.name.trim()) {
      toast.error("Please add a design name");
      return;
    }
    setSaving(true);
    const payload = {
      name: draft.name,
      description: draft.description,
      image_key: draft.image_key,
      min_donation_amount: Number(draft.min_donation_amount || 0),
    };
    const { error } = draft.id
      ? await supabase.from("tshirt_templates").update(payload).eq("id", draft.id)
      : await supabase.from("tshirt_templates").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(draft.id ? "Design updated" : "Design created");
    setDraft(null);
    void invalidate("templates");
  };

  const toggleActive = async (id: string, active: boolean) => {
    const { error } = await supabase.from("tshirt_templates").update({ active }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    void invalidate("templates");
  };

  const setStock = async (templateId: string, size: TshirtSize, quantity: number, rowId?: string) => {
    const { error } = rowId
      ? await supabase.from("tshirt_inventory").update({ quantity_available: quantity }).eq("id", rowId)
      : await supabase
          .from("tshirt_inventory")
          .insert({ template_id: templateId, size, quantity_available: quantity });
    if (error) {
      toast.error(error.message);
      return;
    }
    void invalidate("templates");
  };

  return (
    <>
      <AdminPageTitle
        title="T-shirts"
        description="Supporter designs and per-size stock levels."
        action={
          <Button onClick={() => setDraft({ ...emptyDraft })}>
            <Plus className="mr-2 size-4" /> New design
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {(templates ?? []).map((t) => (
          <Card key={t.id} className="overflow-hidden">
            <img src={imageFor(t.image_key)} alt={t.name} className="h-44 w-full object-cover" loading="lazy" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display font-semibold">{t.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    Unlocks from {formatTZS(t.min_donation_amount)}
                  </p>
                </div>
                <Badge variant={t.active ? "default" : "secondary"}>{t.active ? "Active" : "Hidden"}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>

              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {TSHIRT_SIZES.map((size) => {
                  const row = (t.tshirt_inventory ?? []).find((i) => i.size === size);
                  return (
                    <div key={size}>
                      <Label className="text-xs text-muted-foreground">{size}</Label>
                      <Input
                        className="h-8"
                        type="number"
                        defaultValue={row?.quantity_available ?? 0}
                        onBlur={(e) =>
                          void setStock(t.id, size, Number(e.target.value || 0), row?.id)
                        }
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setDraft({
                      id: t.id,
                      name: t.name,
                      description: t.description,
                      image_key: t.image_key,
                      min_donation_amount: String(t.min_donation_amount),
                    })
                  }
                >
                  Edit design
                </Button>
                <Button size="sm" variant="outline" onClick={() => void toggleActive(t.id, !t.active)}>
                  {t.active ? "Hide design" : "Publish design"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {!(templates ?? []).length && (
          <Card className="p-8 text-center text-muted-foreground">No designs yet.</Card>
        )}
      </div>

      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{draft?.id ? "Edit t-shirt design" : "New t-shirt design"}</DialogTitle>
          </DialogHeader>
          {draft && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="min">Minimum donation (TZS)</Label>
                <Input id="min" type="number" value={draft.min_donation_amount} onChange={(e) => setDraft({ ...draft, min_donation_amount: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
            <Button disabled={saving} onClick={() => void createTemplate()}>
              {saving ? "Saving…" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
