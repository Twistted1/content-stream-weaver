-- Create strategy status enum
CREATE TYPE public.strategy_status AS ENUM ('active', 'planning', 'completed', 'paused');

-- Create strategies table
CREATE TABLE public.strategies (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status strategy_status NOT NULL DEFAULT 'planning',
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    start_date DATE,
    end_date DATE,
    platforms TEXT[] NOT NULL DEFAULT '{}',
    assignees TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create strategy_goals table for goal tracking
CREATE TABLE public.strategy_goals (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    strategy_id UUID NOT NULL REFERENCES public.strategies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategy_goals ENABLE ROW LEVEL SECURITY;

-- Strategies RLS policies
CREATE POLICY "Users can view own strategies"
ON public.strategies FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own strategies"
ON public.strategies FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own strategies"
ON public.strategies FOR UPDATE
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete own strategies"
ON public.strategies FOR DELETE
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

-- Strategy goals RLS policies (access through parent strategy)
CREATE POLICY "Users can view goals for own strategies"
ON public.strategy_goals FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.strategies
    WHERE strategies.id = strategy_goals.strategy_id
    AND (strategies.user_id = auth.uid() OR has_role(auth.uid(), 'admin'))
));

CREATE POLICY "Users can insert goals for own strategies"
ON public.strategy_goals FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.strategies
    WHERE strategies.id = strategy_goals.strategy_id
    AND strategies.user_id = auth.uid()
));

CREATE POLICY "Users can update goals for own strategies"
ON public.strategy_goals FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.strategies
    WHERE strategies.id = strategy_goals.strategy_id
    AND (strategies.user_id = auth.uid() OR has_role(auth.uid(), 'admin'))
));

CREATE POLICY "Users can delete goals for own strategies"
ON public.strategy_goals FOR DELETE
USING (EXISTS (
    SELECT 1 FROM public.strategies
    WHERE strategies.id = strategy_goals.strategy_id
    AND (strategies.user_id = auth.uid() OR has_role(auth.uid(), 'admin'))
));

-- Performance indexes
CREATE INDEX idx_strategies_user_id ON public.strategies(user_id);
CREATE INDEX idx_strategies_status ON public.strategies(status);
CREATE INDEX idx_strategy_goals_strategy_id ON public.strategy_goals(strategy_id);

-- Triggers for updated_at
CREATE TRIGGER update_strategies_updated_at
BEFORE UPDATE ON public.strategies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_strategy_goals_updated_at
BEFORE UPDATE ON public.strategy_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();