-- Create automation enums
CREATE TYPE public.automation_trigger_type AS ENUM ('scheduled', 'new-content', 'engagement', 'manual');
CREATE TYPE public.automation_status AS ENUM ('active', 'paused');

-- Create automations table
CREATE TABLE public.automations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    trigger_type automation_trigger_type NOT NULL,
    trigger_config JSONB DEFAULT '{}'::jsonb,
    platforms TEXT[] DEFAULT '{}',
    status automation_status NOT NULL DEFAULT 'paused',
    last_run_at TIMESTAMP WITH TIME ZONE,
    run_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create automation_runs table
CREATE TABLE public.automation_runs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    automation_id UUID NOT NULL REFERENCES public.automations(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'running')),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_runs ENABLE ROW LEVEL SECURITY;

-- Automations RLS
CREATE POLICY "Users can view own automations"
ON public.automations FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own automations"
ON public.automations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own automations"
ON public.automations FOR UPDATE
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete own automations"
ON public.automations FOR DELETE
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

-- Automation Runs RLS
CREATE POLICY "Users can view own automation runs"
ON public.automation_runs FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.automations
    WHERE automations.id = automation_runs.automation_id
    AND (automations.user_id = auth.uid() OR has_role(auth.uid(), 'admin'))
));

CREATE POLICY "Users can insert runs for own automations"
ON public.automation_runs FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.automations
    WHERE automations.id = automation_runs.automation_id
    AND automations.user_id = auth.uid()
));

-- Triggers for updated_at
CREATE TRIGGER update_automations_updated_at
BEFORE UPDATE ON public.automations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
