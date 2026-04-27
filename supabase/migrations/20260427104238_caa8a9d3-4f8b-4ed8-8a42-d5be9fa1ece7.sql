-- ============================================================
-- VMKV NCC: Full database schema
-- ============================================================

-- Role enum
CREATE TYPE public.app_role AS ENUM ('ano', 'main_senior', 'senior', 'cadet');

-- Admission status enum
CREATE TYPE public.admission_status AS ENUM ('pending', 'approved', 'rejected');

-- Leave status enum
CREATE TYPE public.leave_status AS ENUM ('pending', 'approved', 'rejected');

-- Attendance status enum
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'leave');

-- Announcement category enum
CREATE TYPE public.announcement_category AS ENUM ('camp', 'circular', 'notification');

-- ============================================================
-- profiles
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone TEXT,
  regimental_number TEXT,
  rank TEXT,
  photo_url TEXT,
  bio TEXT,
  profile_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- user_roles (separate table — never on profiles!)
-- ============================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('ano', 'main_senior')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_senior_or_above(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('ano', 'main_senior', 'senior')
  );
$$;

-- Auto-create profile + cadet role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, photo_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    NEW.email,
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'cadet');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- profiles policies
CREATE POLICY "Anyone signed in can view profiles"
  ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()));

-- user_roles policies
CREATE POLICY "Anyone signed in can view roles"
  ON public.user_roles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can assign roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can remove roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================================
-- admissions
-- ============================================================
CREATE TABLE public.admissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Personal
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  blood_group TEXT,
  religion TEXT,
  category TEXT,
  nationality TEXT DEFAULT 'Indian',
  aadhaar_number TEXT,
  photo_url TEXT NOT NULL,
  -- Contact
  phone TEXT,
  email TEXT,
  permanent_address TEXT,
  current_address TEXT,
  -- Family
  father_name TEXT,
  father_occupation TEXT,
  father_phone TEXT,
  mother_name TEXT,
  mother_occupation TEXT,
  mother_phone TEXT,
  guardian_name TEXT,
  emergency_contact TEXT,
  -- Academic
  course TEXT,
  branch TEXT,
  year_of_study TEXT,
  roll_number TEXT,
  college_id TEXT,
  hostel_or_dayscholar TEXT,
  -- Physical / Medical
  height_cm NUMERIC,
  weight_kg NUMERIC,
  identification_marks TEXT,
  medical_conditions TEXT,
  allergies TEXT,
  -- NCC
  ncc_unit TEXT DEFAULT '11 TAMILNADU SIGNAL COMPANY NCC SALEM',
  ncc_wing TEXT DEFAULT 'Senior Division',
  enrollment_year TEXT,
  prior_ncc_experience TEXT,
  -- Other
  hobbies TEXT,
  achievements TEXT,
  declaration_accepted BOOLEAN NOT NULL DEFAULT false,
  -- Workflow
  status public.admission_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER admissions_updated_at BEFORE UPDATE ON public.admissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Users see own admission"
  ON public.admissions FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins see all admissions"
  ON public.admissions FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users submit own admission"
  ON public.admissions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own pending admission"
  ON public.admissions FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins update any admission"
  ON public.admissions FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================================
-- announcements
-- ============================================================
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category public.announcement_category NOT NULL DEFAULT 'notification',
  pinned BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER announcements_updated_at BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Authenticated read announcements"
  ON public.announcements FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins manage announcements insert"
  ON public.announcements FOR INSERT TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins manage announcements update"
  ON public.announcements FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins manage announcements delete"
  ON public.announcements FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================================
-- gallery_items
-- ============================================================
CREATE TABLE public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  caption TEXT,
  image_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read gallery"
  ON public.gallery_items FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins insert gallery"
  ON public.gallery_items FOR INSERT TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins delete gallery"
  ON public.gallery_items FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================================
-- library_items
-- ============================================================
CREATE TABLE public.library_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  file_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read library"
  ON public.library_items FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins insert library"
  ON public.library_items FOR INSERT TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins delete library"
  ON public.library_items FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================================
-- nominal_roll
-- ============================================================
CREATE TABLE public.nominal_roll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cadet_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  regimental_number TEXT,
  rank TEXT,
  course TEXT,
  year_of_study TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.nominal_roll ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read nominal roll"
  ON public.nominal_roll FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins manage nominal roll insert"
  ON public.nominal_roll FOR INSERT TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins manage nominal roll update"
  ON public.nominal_roll FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins manage nominal roll delete"
  ON public.nominal_roll FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================================
-- attendance
-- ============================================================
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cadet_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL,
  status public.attendance_status NOT NULL DEFAULT 'present',
  remarks TEXT,
  marked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cadet_user_id, attendance_date)
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read attendance"
  ON public.attendance FOR SELECT TO authenticated USING (true);

CREATE POLICY "Seniors mark attendance"
  ON public.attendance FOR INSERT TO authenticated
  WITH CHECK (public.is_senior_or_above(auth.uid()));

CREATE POLICY "Seniors update attendance"
  ON public.attendance FOR UPDATE TO authenticated
  USING (public.is_senior_or_above(auth.uid()));

CREATE POLICY "Admins delete attendance"
  ON public.attendance FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================================
-- leave_requests
-- ============================================================
CREATE TABLE public.leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cadet_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  leave_type TEXT NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status public.leave_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER leave_requests_updated_at BEFORE UPDATE ON public.leave_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Cadets see own leave"
  ON public.leave_requests FOR SELECT TO authenticated
  USING (cadet_user_id = auth.uid() OR public.is_senior_or_above(auth.uid()));

CREATE POLICY "Cadets submit leave"
  ON public.leave_requests FOR INSERT TO authenticated
  WITH CHECK (cadet_user_id = auth.uid());

CREATE POLICY "Cadets update own pending leave"
  ON public.leave_requests FOR UPDATE TO authenticated
  USING (cadet_user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Seniors review leave"
  ON public.leave_requests FOR UPDATE TO authenticated
  USING (public.is_senior_or_above(auth.uid()));

-- ============================================================
-- chat_messages
-- ============================================================
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read chat"
  ON public.chat_messages FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users post own chat"
  ON public.chat_messages FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users delete own chat"
  ON public.chat_messages FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- Realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- ============================================================
-- activity_log
-- ============================================================
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read activity log"
  ON public.activity_log FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Authenticated write activity log"
  ON public.activity_log FOR INSERT TO authenticated
  WITH CHECK (actor_user_id = auth.uid());

-- ============================================================
-- Storage buckets
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('profile-photos', 'profile-photos', true),
  ('gallery', 'gallery', true),
  ('library', 'library', true),
  ('nominal-roll', 'nominal-roll', true),
  ('admission-docs', 'admission-docs', false);

-- profile-photos: anyone can read, users upload to own folder
CREATE POLICY "Public read profile photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-photos');

CREATE POLICY "Users upload own profile photo"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users update own profile photo"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users delete own profile photo"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- gallery: public read, admin write
CREATE POLICY "Public read gallery"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "Admins upload gallery"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins delete gallery"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'gallery' AND public.is_admin(auth.uid()));

-- library: public read, admin write
CREATE POLICY "Public read library"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'library');

CREATE POLICY "Admins upload library"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'library' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins delete library"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'library' AND public.is_admin(auth.uid()));

-- nominal-roll: public read, admin write
CREATE POLICY "Public read nominal roll"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'nominal-roll');

CREATE POLICY "Admins upload nominal roll"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'nominal-roll' AND public.is_admin(auth.uid()));

-- admission-docs: private, owner + admin
CREATE POLICY "Owner reads admission docs"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'admission-docs' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin(auth.uid())));

CREATE POLICY "Owner uploads admission docs"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'admission-docs' AND (storage.foldername(name))[1] = auth.uid()::text);
