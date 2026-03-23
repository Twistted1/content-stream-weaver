import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type TriggerType = "scheduled" | "new-content" | "engagement" | "manual";
export type AutomationStatus = "active" | "paused";

export interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: TriggerType;
  triggerConfig: {
    schedule?: string;
    threshold?: number;
  };
  platforms: string[];
  status: AutomationStatus;
  lastRun: string | null;
  runs: number;
  createdAt: string;
}

export interface AutomationRun {
  id: string;
  automationId: string;
  status: "success" | "failed" | "running";
  startedAt: string;
  completedAt: string | null;
  message: string;
}

export function useAutomations() {
  const queryClient = useQueryClient();

  const { data: automations = [], isLoading, error } = useQuery({
    queryKey: ["automations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("automations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((a: any) => ({
        id: a.id,
        name: a.name,
        description: a.description || "",
        trigger: a.trigger,
        triggerConfig: a.conditions || {},
        platforms: a.platforms || [],
        status: a.status === "draft" ? "paused" : a.status,
        lastRun: a.last_run,
        runs: a.run_count || 0,
        createdAt: a.created_at,
      })) as Automation[];
    },
  });

  const { data: automationRuns = [] } = useQuery({
    queryKey: ["automationRuns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("automation_runs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      return data.map((r: any) => ({
        id: r.id,
        automationId: r.automation_id,
        status: r.status,
        startedAt: r.started_at,
        completedAt: r.completed_at,
        message: r.error_message || "",
      })) as AutomationRun[];
    },
  });

  const addAutomation = useMutation({
    mutationFn: async (newAutomation: Omit<Automation, "id" | "createdAt" | "lastRun" | "runs">) => {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("automations")
        .insert({
          name: newAutomation.name,
          description: newAutomation.description,
          trigger: newAutomation.trigger,
          conditions: newAutomation.triggerConfig as any,
          platforms: newAutomation.platforms,
          status: newAutomation.status as any,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      toast.success("Automation created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create automation: ${error.message}`);
    },
  });

  const updateAutomation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Automation> }) => {
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.trigger) dbUpdates.trigger = updates.trigger;
      if (updates.triggerConfig) dbUpdates.conditions = updates.triggerConfig;
      if (updates.platforms) dbUpdates.platforms = updates.platforms;
      if (updates.status) dbUpdates.status = updates.status;

      const { error } = await supabase
        .from("automations")
        .update(dbUpdates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      toast.success("Automation updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update automation: ${error.message}`);
    },
  });

  const deleteAutomation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("automations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      toast.success("Automation deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete automation: ${error.message}`);
    },
  });

  const deleteAutomations = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("automations").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      toast.success("Automations deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete automations: ${error.message}`);
    },
  });

  const toggleAutomation = useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: AutomationStatus }) => {
      const newStatus = currentStatus === "active" ? "paused" : "active";
      const { error } = await supabase.from("automations").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      toast.success("Automation status updated");
    },
    onError: (error) => {
      toast.error(`Failed to toggle automation: ${error.message}`);
    },
  });

  const toggleAutomations = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: AutomationStatus }) => {
      const { error } = await supabase.from("automations").update({ status }).in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      toast.success("Automations status updated");
    },
    onError: (error) => {
      toast.error(`Failed to update automations: ${error.message}`);
    },
  });

  const duplicateAutomation = useMutation({
    mutationFn: async (id: string) => {
      const { data: original, error: fetchError } = await supabase
        .from("automations")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("automations")
        .insert({
          name: `${original.name} (Copy)`,
          description: original.description,
          trigger: original.trigger,
          conditions: original.conditions,
          platforms: original.platforms,
          status: "paused" as any,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      toast.success("Automation duplicated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to duplicate automation: ${error.message}`);
    },
  });

  const runAutomation = useMutation({
    mutationFn: async (id: string) => {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error("Not authenticated");

      const { data: run, error: runError } = await supabase
        .from("automation_runs")
        .insert({
          automation_id: id,
          status: "running",
          user_id: userId,
        })
        .select()
        .single();

      if (runError) throw runError;
      return run.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automationRuns"] });
    },
    onError: (error) => {
      toast.error(`Failed to start automation: ${error.message}`);
    },
  });

  const completeAutomationRun = useMutation({
    mutationFn: async ({ runId, success, message, automationId }: { runId: string; success: boolean; message: string; automationId: string }) => {
      const { error: runError } = await supabase
        .from("automation_runs")
        .update({
          status: success ? "success" : "failed",
          completed_at: new Date().toISOString(),
          error_message: message,
        })
        .eq("id", runId);

      if (runError) throw runError;

      if (success) {
        const { data: current } = await supabase
          .from("automations")
          .select("run_count")
          .eq("id", automationId)
          .single();

        await supabase
          .from("automations")
          .update({
            run_count: (current?.run_count || 0) + 1,
            last_run: new Date().toISOString()
          })
          .eq("id", automationId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      queryClient.invalidateQueries({ queryKey: ["automationRuns"] });
    },
  });

  return {
    automations,
    automationRuns,
    isLoading,
    error,
    addAutomation: addAutomation.mutate,
    updateAutomation: (id: string, updates: Partial<Automation>) => updateAutomation.mutate({ id, updates }),
    deleteAutomation: deleteAutomation.mutate,
    deleteAutomations: deleteAutomations.mutate,
    toggleAutomation: (id: string) => {
      const automation = automations.find(a => a.id === id);
      if (automation) toggleAutomation.mutate({ id, currentStatus: automation.status });
    },
    toggleAutomations: (ids: string[], status: AutomationStatus) => toggleAutomations.mutate({ ids, status }),
    duplicateAutomation: duplicateAutomation.mutate,
    runAutomation: runAutomation.mutateAsync,
    completeAutomationRun: (runId: string, success: boolean, message: string, automationId: string) =>
      completeAutomationRun.mutate({ runId, success, message, automationId }),
  };
}
