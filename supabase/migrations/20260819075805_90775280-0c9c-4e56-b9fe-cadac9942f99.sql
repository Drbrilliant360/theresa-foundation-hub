-- Grants for admin write access
GRANT INSERT, UPDATE, DELETE ON public.campaigns TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.tshirt_templates TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.tshirt_inventory TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT SELECT ON public.testimonials TO authenticated;
GRANT SELECT ON public.contact_messages TO authenticated;
GRANT DELETE ON public.contact_messages TO authenticated;
GRANT UPDATE ON public.donations TO authenticated;
GRANT UPDATE ON public.tshirt_orders TO authenticated;
GRANT INSERT, DELETE ON public.user_roles TO authenticated;

-- Campaigns
CREATE POLICY campaigns_admin_all ON public.campaigns FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- T-shirt templates & inventory
CREATE POLICY tshirt_templates_admin_all ON public.tshirt_templates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY tshirt_inventory_admin_all ON public.tshirt_inventory FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Testimonials & FAQs
CREATE POLICY testimonials_admin_all ON public.testimonials FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY faqs_admin_all ON public.faqs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Donations
CREATE POLICY donations_admin_select ON public.donations FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY donations_admin_update ON public.donations FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- T-shirt orders
CREATE POLICY tshirt_orders_admin_select ON public.tshirt_orders FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY tshirt_orders_admin_update ON public.tshirt_orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Profiles
CREATE POLICY profiles_admin_select ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Contact messages
CREATE POLICY contact_messages_admin_select ON public.contact_messages FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY contact_messages_admin_delete ON public.contact_messages FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Roles management
CREATE POLICY user_roles_admin_select ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY user_roles_admin_insert ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY user_roles_admin_delete ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') AND user_id <> auth.uid());

-- Admins can notify donors
CREATE POLICY notifications_admin_insert ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Bootstrap: first signed-in user can claim admin when none exists
CREATE OR REPLACE FUNCTION public.claim_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN RETURN false; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END; $$;

REVOKE ALL ON FUNCTION public.claim_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;