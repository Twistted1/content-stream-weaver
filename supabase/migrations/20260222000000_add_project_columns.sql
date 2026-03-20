-- Add missing columns to projects table to match UI requirements
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS priority text DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS progress integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS assignees text[] DEFAULT '{}';

-- Create index for priority
CREATE INDEX IF NOT EXISTS idx_projects_priority ON public.projects(priority);
