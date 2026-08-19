import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useIsAdmin() {
  const { user, loading } = useAuth();
  const query = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: user!.id,
        _role: "admin",
      });
      if (error) throw error;
      return Boolean(data);
    },
  });
  return {
    isAdmin: query.data ?? false,
    loading: loading || (!!user && query.isLoading),
    refetch: query.refetch,
  };
}

export function useClaimAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("claim_admin");
      if (error) throw error;
      return Boolean(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["is-admin"] }),
  });
}

/* ---------------- Reads ---------------- */

export function useAdminCampaigns() {
  return useQuery({
    queryKey: ["admin", "campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAdminDonations() {
  return useQuery({
    queryKey: ["admin", "donations"],
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

export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tshirt_orders")
        .select("*, tshirt_templates(name, image_key), donations(reference, donor_name, donor_email)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAdminTemplates() {
  return useQuery({
    queryKey: ["admin", "templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tshirt_templates")
        .select("*, tshirt_inventory(*)")
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });
}

export function useAdminProfiles() {
  return useQuery({
    queryKey: ["admin", "profiles"],
    queryFn: async () => {
      const [{ data: profiles, error }, { data: roles, error: rolesError }] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("*"),
      ]);
      if (error) throw error;
      if (rolesError) throw rolesError;
      return (profiles ?? []).map((p) => ({
        ...p,
        roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role),
      }));
    },
  });
}

export function useAdminMessages() {
  return useQuery({
    queryKey: ["admin", "messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAdminTestimonials() {
  return useQuery({
    queryKey: ["admin", "testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

export function useAdminFaqs() {
  return useQuery({
    queryKey: ["admin", "faqs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("faqs").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

/* ---------------- Mutations ---------------- */

export function useInvalidateAdmin() {
  const qc = useQueryClient();
  return (key?: string) =>
    qc.invalidateQueries({ queryKey: key ? ["admin", key] : ["admin"] });
}
