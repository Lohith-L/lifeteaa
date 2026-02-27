
-- Add unique constraint on profiles.user_id so it can be a FK target
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);

-- Add FK from posts.user_id to profiles.user_id
ALTER TABLE public.posts ADD CONSTRAINT posts_user_id_profiles_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);

-- Add FK from comments.user_id to profiles.user_id
ALTER TABLE public.comments ADD CONSTRAINT comments_user_id_profiles_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);

-- Add FK from comments.post_id to posts.id
ALTER TABLE public.comments ADD CONSTRAINT comments_post_id_posts_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

-- Add FK from likes.user_id to profiles.user_id
ALTER TABLE public.likes ADD CONSTRAINT likes_user_id_profiles_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);

-- Add FK from likes.post_id to posts.id
ALTER TABLE public.likes ADD CONSTRAINT likes_post_id_posts_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

-- Add FK from notifications.post_id to posts.id
ALTER TABLE public.notifications ADD CONSTRAINT notifications_post_id_posts_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;
