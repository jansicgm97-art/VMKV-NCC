-- Approve specific users by email
-- Run this in your Supabase SQL editor or database console

UPDATE public.profiles
SET
  approval_status = 'approved',
  approval_reviewed_at = NOW(),
  approval_reviewed_by = (SELECT id FROM public.profiles WHERE email = 'ano@example.com' LIMIT 1)
WHERE email IN ('jansicgm97@gmail.com', 'associatenccofficerofvmkv@gmail.com')
  AND approval_status != 'approved';

-- Verify the update
SELECT email, approval_status, approval_reviewed_at
FROM public.profiles
WHERE email IN ('jansicgm97@gmail.com', 'associatenccofficerofvmkv@gmail.com');