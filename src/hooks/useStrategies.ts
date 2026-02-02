import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export type StrategyStatus = 'active' | 'planning' | 'completed' | 'paused';

export interface StrategyGoal {
  id: string;
  title: string;
  completed: boolean;
  sort_order: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string | null;
  status: StrategyStatus;
  progress: number;
  start_date: string | null;
  end_date: string | null;
  platforms: string[];
  assignees: string[];
  created_at: string;
  updated_at: string;
  goalItems: StrategyGoal[];
}

export interface StrategyInsert {
  name: string;
  description?: string;
  status?: StrategyStatus;
  progress?: number;
  start_date?: string;
  end_date?: string;
  platforms?: string[];
  assignees?: string[];
  goalItems?: Omit<StrategyGoal, 'id'>[];
}

export function useStrategies() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: strategies = [], isLoading, error } = useQuery({
    queryKey: ['strategies', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Fetch strategies
      const { data: strategiesData, error: strategiesError } = await supabase
        .from('strategies')
        .select('*')
        .order('created_at', { ascending: false });

      if (strategiesError) throw strategiesError;

      // Fetch goals for all strategies
      const strategyIds = strategiesData.map(s => s.id);
      const { data: goalsData, error: goalsError } = await supabase
        .from('strategy_goals')
        .select('*')
        .in('strategy_id', strategyIds)
        .order('sort_order', { ascending: true });

      if (goalsError) throw goalsError;

      // Map goals to strategies
      return strategiesData.map(strategy => ({
        ...strategy,
        goalItems: (goalsData || [])
          .filter(g => g.strategy_id === strategy.id)
          .map(g => ({
            id: g.id,
            title: g.title,
            completed: g.completed,
            sort_order: g.sort_order,
          })),
      })) as Strategy[];
    },
    enabled: !!user?.id,
  });

  const addStrategy = useMutation({
    mutationFn: async (data: StrategyInsert) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { goalItems, ...strategyData } = data;

      // Insert strategy
      const { data: newStrategy, error: strategyError } = await supabase
        .from('strategies')
        .insert({
          ...strategyData,
          user_id: user.id,
        })
        .select()
        .single();

      if (strategyError) throw strategyError;

      // Insert goals if provided
      if (goalItems && goalItems.length > 0) {
        const { error: goalsError } = await supabase
          .from('strategy_goals')
          .insert(
            goalItems.map((goal, idx) => ({
              strategy_id: newStrategy.id,
              title: goal.title,
              completed: goal.completed || false,
              sort_order: idx,
            }))
          );

        if (goalsError) throw goalsError;
      }

      return newStrategy;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
    },
    onError: (error) => {
      toast.error(`Failed to create strategy: ${error.message}`);
    },
  });

  const updateStrategy = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<StrategyInsert> }) => {
      const { goalItems, ...strategyData } = updates;

      // Update strategy
      if (Object.keys(strategyData).length > 0) {
        const { error } = await supabase
          .from('strategies')
          .update(strategyData)
          .eq('id', id);

        if (error) throw error;
      }

      // Update goals if provided
      if (goalItems !== undefined) {
        // Delete existing goals
        await supabase.from('strategy_goals').delete().eq('strategy_id', id);

        // Insert new goals
        if (goalItems.length > 0) {
          const { error: goalsError } = await supabase
            .from('strategy_goals')
            .insert(
              goalItems.map((goal, idx) => ({
                strategy_id: id,
                title: goal.title,
                completed: goal.completed || false,
                sort_order: idx,
              }))
            );

          if (goalsError) throw goalsError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
    },
    onError: (error) => {
      toast.error(`Failed to update strategy: ${error.message}`);
    },
  });

  const deleteStrategy = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('strategies').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
    },
    onError: (error) => {
      toast.error(`Failed to delete strategy: ${error.message}`);
    },
  });

  const deleteStrategies = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from('strategies').delete().in('id', ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
    },
    onError: (error) => {
      toast.error(`Failed to delete strategies: ${error.message}`);
    },
  });

  const toggleStrategyGoal = useMutation({
    mutationFn: async ({ strategyId, goalId }: { strategyId: string; goalId: string }) => {
      // Get current goal state
      const { data: goal, error: fetchError } = await supabase
        .from('strategy_goals')
        .select('completed')
        .eq('id', goalId)
        .single();

      if (fetchError) throw fetchError;

      // Toggle completed state
      const { error } = await supabase
        .from('strategy_goals')
        .update({ completed: !goal.completed })
        .eq('id', goalId);

      if (error) throw error;

      // Recalculate strategy progress
      const { data: allGoals } = await supabase
        .from('strategy_goals')
        .select('id, completed')
        .eq('strategy_id', strategyId);

      if (allGoals && allGoals.length > 0) {
        const completedCount = allGoals.filter(g => 
          g.id === goalId ? !goal.completed : g.completed
        ).length;
        const progress = Math.round((completedCount / allGoals.length) * 100);

        await supabase
          .from('strategies')
          .update({ progress })
          .eq('id', strategyId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
    },
    onError: (error) => {
      toast.error(`Failed to toggle goal: ${error.message}`);
    },
  });

  const duplicateStrategy = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const strategy = strategies.find(s => s.id === id);
      if (!strategy) throw new Error('Strategy not found');

      // Insert duplicated strategy
      const { data: newStrategy, error: strategyError } = await supabase
        .from('strategies')
        .insert({
          user_id: user.id,
          name: `${strategy.name} (Copy)`,
          description: strategy.description,
          status: 'planning' as StrategyStatus,
          progress: 0,
          start_date: strategy.start_date,
          end_date: strategy.end_date,
          platforms: strategy.platforms,
          assignees: strategy.assignees,
        })
        .select()
        .single();

      if (strategyError) throw strategyError;

      // Duplicate goals
      if (strategy.goalItems.length > 0) {
        const { error: goalsError } = await supabase
          .from('strategy_goals')
          .insert(
            strategy.goalItems.map((goal, idx) => ({
              strategy_id: newStrategy.id,
              title: goal.title,
              completed: false,
              sort_order: idx,
            }))
          );

        if (goalsError) throw goalsError;
      }

      return newStrategy;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
    },
    onError: (error) => {
      toast.error(`Failed to duplicate strategy: ${error.message}`);
    },
  });

  const changeStrategyStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: StrategyStatus }) => {
      const { error } = await supabase
        .from('strategies')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
    },
    onError: (error) => {
      toast.error(`Failed to change status: ${error.message}`);
    },
  });

  const changeStrategiesStatus = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: StrategyStatus }) => {
      const { error } = await supabase
        .from('strategies')
        .update({ status })
        .in('id', ids);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
    },
    onError: (error) => {
      toast.error(`Failed to change status: ${error.message}`);
    },
  });

  return {
    strategies,
    isLoading,
    error,
    addStrategy: addStrategy.mutateAsync,
    updateStrategy: (id: string, updates: Partial<StrategyInsert>) => updateStrategy.mutateAsync({ id, updates }),
    deleteStrategy: deleteStrategy.mutateAsync,
    deleteStrategies: deleteStrategies.mutateAsync,
    toggleStrategyGoal: (strategyId: string, goalId: string) => toggleStrategyGoal.mutateAsync({ strategyId, goalId }),
    duplicateStrategy: duplicateStrategy.mutateAsync,
    changeStrategyStatus: (id: string, status: StrategyStatus) => changeStrategyStatus.mutateAsync({ id, status }),
    changeStrategiesStatus: (ids: string[], status: StrategyStatus) => changeStrategiesStatus.mutateAsync({ ids, status }),
  };
}
