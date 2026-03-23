
-- Pipeline runs table to track automated content generation pipelines
CREATE TABLE public.pipeline_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  topic TEXT NOT NULL,
  platforms TEXT[] NOT NULL DEFAULT '{}',
  schedule_mode TEXT NOT NULL DEFAULT 'immediate',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  steps JSONB NOT NULL DEFAULT '[]',
  result JSONB,
  post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.pipeline_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pipeline runs" ON public.pipeline_runs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pipeline runs" ON public.pipeline_runs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pipeline runs" ON public.pipeline_runs
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Webhook configs table for publish webhooks
CREATE TABLE public.webhook_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  platforms TEXT[] NOT NULL DEFAULT '{}',
  headers JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.webhook_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own webhook configs" ON public.webhook_configs
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_pipeline_runs_user ON public.pipeline_runs(user_id);
CREATE INDEX idx_pipeline_runs_status ON public.pipeline_runs(status);
CREATE INDEX idx_webhook_configs_user ON public.webhook_configs(user_id);
