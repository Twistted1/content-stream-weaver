-- Add email and status to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_active TIMESTAMP WITH TIME ZONE;

-- Create invitations table for tracking pending invites
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, expired
  token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  UNIQUE(email)
);

-- Enable RLS on invitations
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage invitations
CREATE POLICY "Admins can manage invitations"
  ON public.invitations FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Update handle_new_user function to include email and check invitations
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  invite_record RECORD;
BEGIN
  -- Check for pending invitation
  SELECT * INTO invite_record FROM public.invitations WHERE email = NEW.email AND status = 'pending';

  -- Create profile
  INSERT INTO public.profiles (user_id, display_name, email, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    'active'
  );
  
  -- Assign role based on invitation or default
  IF invite_record IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, invite_record.role);
    
    -- Update invitation status
    UPDATE public.invitations SET status = 'accepted' WHERE id = invite_record.id;
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  
  -- Create free subscription
  INSERT INTO public.subscriptions (user_id, tier)
  VALUES (NEW.id, 'free');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
