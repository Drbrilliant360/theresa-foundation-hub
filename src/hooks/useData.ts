import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCampaigns(options?: { featuredOnly?: boolean }) {
  return useQuery({
    queryKey: ["campaigns", options?.featuredOnly ?? false],
    queryFn: async () => {
      let q = supabase.from("campaigns").select("*").order("featured", { ascending: false });
      if (options?.featuredOnly) q = q.eq("featured", true);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useCampaign(slug: string) {
  return useQuery({
    queryKey: ["campaign", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useTemplates() {
  return useQuery({
    queryKey: ["tshirt_templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tshirt_templates")
        .select("*")
        .eq("active", true)
        .order("min_donation_amount");
      if (error) throw error;
      return data;
    },
  });
}

export function useInventory(templateId?: string) {
  return useQuery({
    queryKey: ["tshirt_inventory", templateId],
    enabled: !!templateId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tshirt_inventory")
        .select("*")
        .eq("template_id", templateId!);
      if (error) throw error;
      return data;
    },
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

export function useFaqs() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("faqs").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

export function useImpactStats() {
  return useQuery({
    queryKey: ["impact-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("raised_amount, donor_count, goal_amount");
      if (error) throw error;
      const raised = data.reduce((s, c) => s + Number(c.raised_amount), 0);
      const donors = data.reduce((s, c) => s + Number(c.donor_count), 0);
      return {
        raised,
        donors,
        campaigns: data.length,
        volunteers: 240,
        beneficiaries: Math.round(raised / 25000),
      };
    },
  });
}

export function useMyDonations(userId?: string, email?: string) {
  return useQuery({
    queryKey: ["my-donations", userId, email],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select("*, campaigns(title, slug)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useMyOrders(userId?: string) {
  return useQuery({
    queryKey: ["my-orders", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tshirt_orders")
        .select("*, tshirt_templates(name, image_key)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useNotifications(userId?: string) {
  return useQuery({
    queryKey: ["notifications", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}
