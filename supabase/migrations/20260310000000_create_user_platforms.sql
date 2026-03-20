-- Create user_platforms table for tracking connected social media accounts and their settings
CREATE TABLE IF NOT EXISTS public.user_platforms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform_type public.platform_type NOT NULL,
  account_name TEXT NOT NULL,
  username TEXT,
  avatar_url TEXT,
  settings JSONB NOT NULL DEFAULT '{
    "autoPublish": true,
    "notifications": true,
    "analytics": true,
    "contentBackup": false
  }',
  status TEXT NOT NULL DEFAULT 'active',
  last_sync TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, platform_type)
);

-- Enable RLS
ALTER TABLE public.user_platforms ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own platform connections"
  ON public.user_platforms FOR SELECT
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can manage their own platform connections"
  ON public.user_platforms FOR ALL
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_user_platforms_updated_at
BEFORE UPDATE ON public.user_platforms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index
CREATE INDEX idx_user_platforms_user_id ON public.user_platforms(user_id);
