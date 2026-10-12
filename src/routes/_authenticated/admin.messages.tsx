import { createFileRoute } from "@tanstack/react-router";
import { Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPageTitle } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAdminMessages, useInvalidateAdmin } from "@/hooks/useAdmin";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  head: () => ({
    meta: [
      { title: "Messages — Admin — Theresa Foundation" },
      { name: "description", content: "Enquiries submitted through the contact form." },
      { property: "og:title", content: "Messages — Admin — Theresa Foundation" },
      { property: "og:description", content: "Enquiries submitted through the contact form." },
    ],
  }),
  component: AdminMessages,
});


function AdminMessages() {
  const { data: messages } = useAdminMessages();
  const invalidate = useInvalidateAdmin();

  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Message deleted");
    void invalidate("messages");
  };


  return (
    <>
      <AdminPageTitle title="Messages" description="Enquiries submitted through the contact form." />

      <div className="grid gap-4">
        {(messages ?? []).map((m) => (
          <Card key={m.id} className="p-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div>
                <p className="font-medium">{m.name}</p>
                <a
                  href={`mailto:${m.email}`}
                  className="inline-flex max-w-full items-center gap-1 break-all text-xs text-primary hover:underline"
                >
                  <Mail className="size-3" /> {m.email}
                </a>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
                <span className="text-xs text-muted-foreground">{formatDate(m.created_at)}</span>
                <Button size="icon" variant="ghost" onClick={() => void remove(m.id)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm text-muted-foreground">{m.message}</p>
          </Card>
        ))}
        {!(messages ?? []).length && (
          <Card className="p-8 text-center text-muted-foreground">No messages yet.</Card>
        )}
      </div>
    </>
  );
}
