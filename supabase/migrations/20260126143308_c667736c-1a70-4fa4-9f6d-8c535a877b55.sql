-- Promote test user to admin role
UPDATE public.user_roles 
SET role = 'admin'::app_role 
WHERE user_id = 'e684cb52-c434-4f44-ac87-b0dee605ce4c';

-- Upgrade test user to enterprise subscription for full access
UPDATE public.subscriptions 
SET tier = 'enterprise'::subscription_tier 
WHERE user_id = 'e684cb52-c434-4f44-ac87-b0dee605ce4c';