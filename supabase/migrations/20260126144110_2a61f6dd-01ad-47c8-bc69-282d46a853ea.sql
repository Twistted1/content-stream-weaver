-- Create enum for post status
CREATE TYPE public.post_status AS ENUM ('draft', 'scheduled', 'published', 'failed');

-- Create enum for post type
CREATE TYPE public.post_type AS ENUM ('text', 'image', 'video', 'carousel', 'reel', 'thread', 'article');

-- Create enum for platform
CREATE TYPE public.platform_type AS ENUM ('instagram', 'twitter', 'youtube', 'tiktok', 'facebook', 'linkedin', 'website', 'podcast');

-- Create posts table
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  status post_status NOT NULL DEFAULT 'draft',
  type post_type NOT NULL DEFAULT 'text',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create media table for file references
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create post_platforms junction table
CREATE TABLE public.post_platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  platform_post_id TEXT, -- ID returned from platform after publishing
  status post_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, platform)
);

-- Enable RLS on all tables
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_platforms ENABLE ROW LEVEL SECURITY;

-- RLS policies for posts
CREATE POLICY "Users can view own posts or admins can view all"
ON public.posts FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own posts"
ON public.posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts or admins can update all"
ON public.posts FOR UPDATE
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete own posts or admins can delete all"
ON public.posts FOR DELETE
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

-- RLS policies for media
CREATE POLICY "Users can view own media or admins can view all"
ON public.media FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own media"
ON public.media FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own media or admins can update all"
ON public.media FOR UPDATE
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete own media or admins can delete all"
ON public.media FOR DELETE
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

-- RLS policies for post_platforms (access through post ownership)
CREATE POLICY "Users can view platforms for own posts or admins can view all"
ON public.post_platforms FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.posts WHERE posts.id = post_platforms.post_id AND posts.user_id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);

CREATE POLICY "Users can insert platforms for own posts"
ON public.post_platforms FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.posts WHERE posts.id = post_platforms.post_id AND posts.user_id = auth.uid())
);

CREATE POLICY "Users can update platforms for own posts or admins can update all"
ON public.post_platforms FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.posts WHERE posts.id = post_platforms.post_id AND posts.user_id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);

CREATE POLICY "Users can delete platforms for own posts or admins can delete all"
ON public.post_platforms FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.posts WHERE posts.id = post_platforms.post_id AND posts.user_id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);

-- Create indexes for performance
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_scheduled_at ON public.posts(scheduled_at);
CREATE INDEX idx_media_user_id ON public.media(user_id);
CREATE INDEX idx_media_post_id ON public.media(post_id);
CREATE INDEX idx_post_platforms_post_id ON public.post_platforms(post_id);

-- Add triggers for updated_at
CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_post_platforms_updated_at
BEFORE UPDATE ON public.post_platforms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();