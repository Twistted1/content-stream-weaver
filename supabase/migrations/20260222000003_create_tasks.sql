-- Create tasks table for Gantt chart and project management
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo', -- todo, in-progress, review, done, blocked
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  start_date INTEGER DEFAULT 0, -- Day offset from project start
  duration INTEGER DEFAULT 1, -- Duration in days
  progress INTEGER DEFAULT 0,
  dependencies TEXT[] DEFAULT '{}', -- Array of task IDs that this task depends on
  assignee_id UUID REFERENCES public.profiles(user_id),
  due_date TIMESTAMP WITH TIME ZONE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Policies
-- Allow read access to all authenticated users for now (collaborative)
CREATE POLICY "Users can view tasks" 
  ON public.tasks FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Allow insert if authenticated
CREATE POLICY "Users can insert tasks" 
  ON public.tasks FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Allow update if authenticated (collaborative)
CREATE POLICY "Users can update tasks" 
  ON public.tasks FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Allow delete if authenticated
CREATE POLICY "Users can delete tasks" 
  ON public.tasks FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON public.tasks(assignee_id);
