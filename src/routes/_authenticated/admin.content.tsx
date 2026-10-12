import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPageTitle } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAdminFaqs, useAdminTestimonials, useInvalidateAdmin } from "@/hooks/useAdmin";

export const Route = createFileRoute("/_authenticated/admin/content")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Site Content — Admin — Theresa Foundation" },
      { name: "description", content: "Manage testimonials and frequently asked questions." },
      { property: "og:title", content: "Site Content — Admin — Theresa Foundation" },
      { property: "og:description", content: "Manage testimonials and frequently asked questions." },
    ],
  }),
  component: AdminContent,
});


function AdminContent() {
  const { data: testimonials } = useAdminTestimonials();
  const { data: faqs } = useAdminFaqs();
  const invalidate = useInvalidateAdmin();

  const [story, setStory] = useState({ name: "", role: "Donor", story: "" });
  const [faq, setFaq] = useState({ question: "", answer: "" });

  const addTestimonial = async () => {
    if (!story.name || !story.story) {
      toast.error("Name and story are required");
      return;
    }
    const { error } = await supabase.from("testimonials").insert({
      name: story.name,
      role: story.role,
      story: story.story,
      sort_order: (testimonials ?? []).length,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Testimonial added");
    setStory({ name: "", role: "Donor", story: "" });
    void invalidate("testimonials");
  };

  const togglePublished = async (id: string, published: boolean) => {
    const { error } = await supabase.from("testimonials").update({ published }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    void invalidate("testimonials");
  };

  const removeTestimonial = async (id: string) => {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    void invalidate("testimonials");
  };

  const addFaq = async () => {
    if (!faq.question || !faq.answer) {
      toast.error("Question and answer are required");
      return;
    }
    const { error } = await supabase
      .from("faqs")
      .insert({ question: faq.question, answer: faq.answer, sort_order: (faqs ?? []).length });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("FAQ added");
    setFaq({ question: "", answer: "" });
    void invalidate("faqs");
  };

  const removeFaq = async (id: string) => {
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    void invalidate("faqs");
  };

  return (
    <>
      <AdminPageTitle title="Site content" description="Testimonials and frequently asked questions." />

      <Tabs defaultValue="testimonials">
        <TabsList>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="testimonials" className="mt-6 space-y-4">
          <Card className="p-5">
            <h2 className="font-display font-semibold">Add testimonial</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="t-name">Name</Label>
                <Input id="t-name" value={story.name} onChange={(e) => setStory({ ...story, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="t-role">Role</Label>
                <Input id="t-role" value={story.role} onChange={(e) => setStory({ ...story, role: e.target.value })} />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="t-story">Story</Label>
              <Textarea id="t-story" rows={3} value={story.story} onChange={(e) => setStory({ ...story, story: e.target.value })} />
            </div>
            <Button className="mt-4" onClick={() => void addTestimonial()}>
              <Plus className="mr-2 size-4" /> Add testimonial
            </Button>
          </Card>

          {(testimonials ?? []).map((t) => (
            <Card key={t.id} className="p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div>
                  <p className="font-medium">
                    {t.name} <span className="text-xs text-muted-foreground">· {t.role}</span>
                  </p>
                  <Badge variant={t.published ? "default" : "secondary"} className="mt-1">
                    {t.published ? "Published" : "Hidden"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => void togglePublished(t.id, !t.published)}>
                    {t.published ? "Hide" : "Publish"}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => void removeTestimonial(t.id)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <p className="mt-3 break-words text-sm text-muted-foreground">{t.story}</p>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="faqs" className="mt-6 space-y-4">
          <Card className="p-5">
            <h2 className="font-display font-semibold">Add FAQ</h2>
            <div className="mt-4">
              <Label htmlFor="f-q">Question</Label>
              <Input id="f-q" value={faq.question} onChange={(e) => setFaq({ ...faq, question: e.target.value })} />
            </div>
            <div className="mt-4">
              <Label htmlFor="f-a">Answer</Label>
              <Textarea id="f-a" rows={3} value={faq.answer} onChange={(e) => setFaq({ ...faq, answer: e.target.value })} />
            </div>
            <Button className="mt-4" onClick={() => void addFaq()}>
              <Plus className="mr-2 size-4" /> Add FAQ
            </Button>
          </Card>

          {(faqs ?? []).map((f) => (
            <Card key={f.id} className="p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div>
                  <p className="font-medium">{f.question}</p>
                  <p className="mt-2 break-words text-sm text-muted-foreground">{f.answer}</p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => void removeFaq(f.id)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </>
  );
}
