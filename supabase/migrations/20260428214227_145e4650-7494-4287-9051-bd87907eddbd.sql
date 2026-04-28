-- Approval status enum
DO $$ BEGIN
  CREATE TYPE public.account_approval_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Add columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS approval_status public.account_approval_status NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS approval_reviewed_by uuid,
  ADD COLUMN IF NOT EXISTS approval_reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS welcomed_at timestamptz;

-- Existing users (created before this feature) are auto-approved
UPDATE public.profiles
SET approval_status = 'approved',
    approval_reviewed_at = COALESCE(approval_reviewed_at, now())
WHERE created_at < now() - interval '1 minute'
  AND approval_status = 'pending';

-- ANOs are always approved
UPDATE public.profiles p
SET approval_status = 'approved'
WHERE EXISTS (
  SELECT 1 FROM public.user_roles r
  WHERE r.user_id = p.id AND r.role IN ('ano', 'main_senior')
);
