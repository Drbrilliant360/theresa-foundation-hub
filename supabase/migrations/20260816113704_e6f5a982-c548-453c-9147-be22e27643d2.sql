-- ENUMS
CREATE TYPE public.app_role AS ENUM ('donor','admin');
CREATE TYPE public.campaign_status AS ENUM ('draft','active','paused','completed');
CREATE TYPE public.donation_status AS ENUM ('pending','completed','failed','refunded');
CREATE TYPE public.donation_frequency AS ENUM ('one_time','monthly');
CREATE TYPE public.tshirt_size AS ENUM ('XS','S','M','L','XL','XXL');
CREATE TYPE public.order_status AS ENUM ('confirmed','reserved','processing','ready','shipped','delivered');

-- UPDATED AT HELPER
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT,
  country TEXT DEFAULT 'Tanzania',
  address TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'donor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- SIGNUP TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, country)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'country', 'Tanzania')
  ) ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'donor') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- CAMPAIGNS
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'General',
  image_key TEXT NOT NULL DEFAULT 'education',
  goal_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  raised_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  donor_count INTEGER NOT NULL DEFAULT 0,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  status public.campaign_status NOT NULL DEFAULT 'active',
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.campaigns TO anon, authenticated;
GRANT ALL ON public.campaigns TO service_role;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaigns_public_read" ON public.campaigns FOR SELECT TO anon, authenticated USING (status <> 'draft');
CREATE TRIGGER campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- TSHIRT TEMPLATES
CREATE TABLE public.tshirt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_key TEXT NOT NULL DEFAULT 'tshirt-hope',
  min_donation_amount NUMERIC(14,2) NOT NULL DEFAULT 25000,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tshirt_templates TO anon, authenticated;
GRANT ALL ON public.tshirt_templates TO service_role;
ALTER TABLE public.tshirt_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tshirt_templates_public_read" ON public.tshirt_templates FOR SELECT TO anon, authenticated USING (active);

CREATE TABLE public.tshirt_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.tshirt_templates(id) ON DELETE CASCADE,
  size public.tshirt_size NOT NULL,
  quantity_available INTEGER NOT NULL DEFAULT 0,
  UNIQUE (template_id, size)
);
GRANT SELECT ON public.tshirt_inventory TO anon, authenticated;
GRANT ALL ON public.tshirt_inventory TO service_role;
ALTER TABLE public.tshirt_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tshirt_inventory_public_read" ON public.tshirt_inventory FOR SELECT TO anon, authenticated USING (true);

-- DONATIONS
CREATE SEQUENCE public.donation_ref_seq START 8900;
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE DEFAULT ('TF-' || nextval('public.donation_ref_seq')::text),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  donor_phone TEXT,
  country TEXT NOT NULL DEFAULT 'Tanzania',
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  frequency public.donation_frequency NOT NULL DEFAULT 'one_time',
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  payment_method TEXT NOT NULL DEFAULT 'mpesa',
  status public.donation_status NOT NULL DEFAULT 'pending',
  anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.donations TO authenticated;
GRANT INSERT ON public.donations TO anon;
GRANT ALL ON public.donations TO service_role;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "donations_select_own" ON public.donations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "donations_insert_guest" ON public.donations FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY "donations_insert_self" ON public.donations FOR INSERT TO authenticated WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- TSHIRT ORDERS
CREATE TABLE public.tshirt_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID NOT NULL REFERENCES public.donations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  template_id UUID NOT NULL REFERENCES public.tshirt_templates(id),
  size public.tshirt_size NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  status public.order_status NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.tshirt_orders TO authenticated;
GRANT INSERT ON public.tshirt_orders TO anon;
GRANT ALL ON public.tshirt_orders TO service_role;
ALTER TABLE public.tshirt_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tshirt_orders_select_own" ON public.tshirt_orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "tshirt_orders_insert_guest" ON public.tshirt_orders FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY "tshirt_orders_insert_self" ON public.tshirt_orders FOR INSERT TO authenticated WITH CHECK (user_id IS NULL OR auth.uid() = user_id);
CREATE TRIGGER tshirt_orders_updated_at BEFORE UPDATE ON public.tshirt_orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'general',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert_own" ON public.notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- TESTIMONIALS
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Donor',
  amount NUMERIC(14,2),
  story TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testimonials_public_read" ON public.testimonials FOR SELECT TO anon, authenticated USING (published);

-- FAQS
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);
GRANT SELECT ON public.faqs TO anon, authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "faqs_public_read" ON public.faqs FOR SELECT TO anon, authenticated USING (true);

-- CONTACT MESSAGES
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact_messages_insert_any" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);

-- SEED CAMPAIGNS
INSERT INTO public.campaigns (slug,title,summary,description,category,image_key,goal_amount,raised_amount,donor_count,end_date,featured) VALUES
('education-support-fund','Education Support Fund','Scholarships and school supplies for underprivileged children in rural districts.','Thousands of bright children in rural Tanzania leave school early because their families cannot afford fees, uniforms or books. The Education Support Fund pays school fees, supplies learning materials and funds after-school tutoring so that talent, not income, decides a child''s future. Every TZS 25,000 keeps one child in class for a month.','Education','education',2000000,1200000,412,CURRENT_DATE + 60,true),
('clean-water-initiative','Clean Water Initiative','Building sustainable wells so entire villages have safe drinking water.','Waterborne illness is still the leading cause of missed school days in the communities we serve. This initiative drills and maintains boreholes, installs solar pumps and trains local water committees so each well keeps running long after we leave.','Healthcare','water',5000000,3800000,908,CURRENT_DATE + 30,true),
('womens-empowerment','Women''s Empowerment','Micro-loans and business training for women entrepreneurs.','We provide starter capital, financial literacy training and ongoing mentorship to women building small businesses. Ninety-four percent of our micro-loans are repaid and reinvested into the next cohort.','Community','women',1500000,500000,187,CURRENT_DATE + 90,true),
('child-welfare-programme','Child Welfare Programme','Nutrition, safety and psychosocial support for vulnerable children.','A holistic programme combining daily nutritious meals, health screening, and counselling for children in vulnerable households across three regions.','Community','child',1200000,640000,233,CURRENT_DATE + 75,false),
('healthcare-access','Healthcare Access','Mobile clinics bringing primary care to remote communities.','Our mobile clinics travel to villages more than 40km from the nearest health post, delivering maternal care, immunisations and chronic disease screening.','Healthcare','healthcare',3000000,1750000,521,CURRENT_DATE + 45,false),
('emergency-relief','Emergency Relief','Rapid response kits for families hit by floods and storms.','When disaster strikes we deliver shelter kits, clean water, and food packages within 72 hours, then support families through the rebuilding period.','Emergency','emergency',2500000,2100000,764,CURRENT_DATE + 20,false);

-- SEED TSHIRTS
INSERT INTO public.tshirt_templates (id,name,description,image_key,min_donation_amount) VALUES
('11111111-1111-4111-8111-111111111111','Hope Classic Tee','Our signature navy tee with the Theresa Foundation emblem embroidered on the chest.','tshirt-hope',25000),
('22222222-2222-4222-8222-222222222222','Impact Emerald Tee','Emerald green organic cotton tee celebrating our clean water milestone.','tshirt-impact',50000),
('33333333-3333-4333-8333-333333333333','Together Heritage Tee','Limited-edition cream tee with hand-drawn artwork by beneficiary students.','tshirt-together',100000);

INSERT INTO public.tshirt_inventory (template_id,size,quantity_available)
SELECT t.id, s.size, s.qty FROM public.tshirt_templates t
CROSS JOIN (VALUES ('XS'::public.tshirt_size,14),('S',32),('M',48),('L',41),('XL',22),('XXL',9)) AS s(size,qty);

-- SEED TESTIMONIALS
INSERT INTO public.testimonials (name,role,amount,story,sort_order) VALUES
('Sarah Mushi','Monthly Donor',250000,'I have given monthly for two years. Every quarter I receive a report showing exactly which school my contribution reached. That transparency is why I keep giving.',1),
('James Kimaro','Corporate Partner',1500000,'Our company matched employee donations through Theresa Foundation. The dashboard made reporting to our board effortless.',2),
('Amina Hassan','Volunteer & Donor',75000,'I visited the clean water site my donation supported. Seeing children drink safely from that well changed how I think about giving.',3),
('Peter Nyerere','First-time Donor',50000,'I donated on my phone in under two minutes and got my t-shirt three weeks later. Simple, honest, and it works.',4);

-- SEED FAQS
INSERT INTO public.faqs (question,answer,sort_order) VALUES
('How do I donate?','Choose Donate Now, complete the guided steps with your details, amount and cause, then pay with M-Pesa, Airtel Money, Tigo Pesa or card. The whole process takes under three minutes.',1),
('Can I donate anonymously?','Yes. Tick the anonymous option during checkout and your name will never appear in public donor lists or campaign pages.',2),
('How do I receive my T-shirt?','Donations above the eligibility threshold qualify for a t-shirt. Choose a design and size at checkout, and track fulfilment from your donor dashboard until delivery.',3),
('How are donations used?','Eighty-five percent goes directly to programmes: education, healthcare and community support. The remaining fifteen percent covers administration and is published in our annual report.',4),
('Can I track my donation?','Yes. Every donation gets a reference number and a receipt, and signed-in donors can follow campaign progress and t-shirt fulfilment from the dashboard.',5);