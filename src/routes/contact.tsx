import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Theresa Foundation" },
      {
        name: "description",
        content:
          "Get in touch with the Theresa Foundation team in Dar es Salaam about donations, partnerships or volunteering.",
      },
      { property: "og:title", content: "Contact Us — Theresa Foundation" },
      {
        property: "og:description",
        content: "Reach our team about donations, partnerships or volunteering.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setSaving(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: String(fd.get("name")),
      email: String(fd.get("email")),
      message: String(fd.get("message")),
    });
    setSaving(false);
    if (error) {
      toast.error("Could not send your message. Please try again.");
      return;
    }
    toast.success("Message sent — we'll be in touch soon.");
    form.reset();
  }

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Contact"
        title="Talk to our team"
        description="Questions about a donation, a partnership or volunteering? We reply within two working days."
        background={aboutImage}
      />

      <section className="container-page grid gap-8 py-10 sm:gap-10 sm:py-14 lg:grid-cols-3">
        <Card className="gap-4 p-6 lg:col-span-1">
          <div className="flex gap-3 text-sm">
            <MapPin className="size-4 shrink-0 text-secondary" />
            <span>Msasani Peninsula, Dar es Salaam, Tanzania</span>
          </div>
          <div className="flex gap-3 text-sm">
            <Phone className="size-4 shrink-0 text-secondary" />
            <span>+255 700 000 000</span>
          </div>
          <div className="flex gap-3 text-sm">
            <Mail className="size-4 shrink-0 text-secondary" />
            <span>hello@theresafoundation.org</span>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" rows={6} required />
            </div>
            <Button
              type="submit"
              disabled={saving}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              {saving ? "Sending…" : "Send message"}
            </Button>
          </form>
        </Card>
      </section>
    </SiteLayout>
  );
}
