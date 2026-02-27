
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS support_message text;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS cognitive_distortions text[] DEFAULT '{}';
