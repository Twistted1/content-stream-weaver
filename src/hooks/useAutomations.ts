import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type AutomationRow = Database["public"]["Tables"]["automations"]["Row"];
type AutomationInsert = Database["public"]["Tables"]["automations"]["Insert"];
type AutomationUpdate = Database["public"]["Tables"]["automations"]["Update"];
type AutomationRunRow = Database["public"]["Tables"]["automation_runs"]["Row"];

export type AutomationTrigger = Database["public"]["Enums"]["automation_trigger"];
export type AutomationSchedule = Database["public"]["Enums"]["automation_schedule"];
export type AutomationStatus = Database["public"]["Enums"]["automation_status"];

export interface Automation {
  id: string;
  name: string;
  description: string | null;
  trigger: AutomationTrigger;
  schedule: AutomationSchedule | null;
  platforms: string[];
  status: AutomationStatus;
  actions: unknown[];
  conditions: unknown;
  lastRun: string | null;
  nextRun: string | null;
  runCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationRun {
  id: string;
  automationId: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  result: unknown;
  errorMessage: string | null;
  createdAt: string;
}

const mapAutomation = (row: AutomationRow): Automation => ({
  id: row.id,
  name: row.name,
  description: row.description,
  trigger: row.trigger,
  schedule: row.schedule,
  platforms: row.platforms || [],
  status: row.status,
  actions: Array.isArray(row.actions) ? row.actions : [],
  conditions: row.conditions,
  lastRun: row.last_run,
  nextRun: row.next_run,
  runCount: row.run_count,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapAutomationRun = (row: AutomationRunRow): AutomationRun => ({
  id: row.id,
  automationId: row.automation_id,
  status: row.status,
  startedAt: row.started_at,
  completedAt: row.completed_at,
  result: row.result,
  errorMessage: row.error_message,
  createdAt: row.created_at,
});

export function useAutomations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const automationsQuery = useQuery({
    queryKey: ["automations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("automations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data.map(mapAutomation);
    },
    enabled: !!user,
  });

  const addAutomation = useMutation({
    mutationFn: async (automation: Omit<AutomationInsert, "user_id">) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("automations")
        .insert({ ...automation, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return mapAutomation(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      toast.success("Automation created");
    },
    onError: (error) => {
      toast.error("Failed to create automation: " + error.message);
    },
  });

  const updateAutomation = useMutation({
    mutationFn: async ({ id, ...updates }: AutomationUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("automations")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return mapAutomation(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      toast.success("Automation updated");
    },
    onError: (error) => {
      toast.error("Failed to update automation: " + error.message);
    },
  });

  const deleteAutomation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("automations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      toast.success("Automation deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete automation: " + error.message);
    },
  });

  const deleteAutomations = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("automations").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      toast.success("Automations deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete automations: " + error.message);
    },
  });

  const toggleAutomation = useMutation({
    mutationFn: async (id: string) => {
      const automation = automationsQuery.data?.find((a) => a.id === id);
      if (!automation) throw new Error("Automation not found");

      const newStatus: AutomationStatus = automation.status === "active" ? "paused" : "active";
      const { data, error } = await supabase
        .from("automations")
        .update({ status: newStatus })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return mapAutomation(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
    },
    onError: (error) => {
      toast.error("Failed to toggle automation: " + error.message);
    },
  });

  const duplicateAutomation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Not authenticated");
      const automation = automationsQuery.data?.find((a) => a.id === id);
      if (!automation) throw new Error("Automation not found");

      const insertData: Database["public"]["Tables"]["automations"]["Insert"] = {
        user_id: user.id,
        name: `${automation.name} (Copy)`,
        description: automation.description,
        trigger: automation.trigger,
        schedule: automation.schedule,
        platforms: automation.platforms,
        status: "draft",
        actions: automation.actions as Database["public"]["Tables"]["automations"]["Insert"]["actions"],
        conditions: automation.conditions as Database["public"]["Tables"]["automations"]["Insert"]["conditions"],
      };

      const { data, error } = await supabase
        .from("automations")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return mapAutomation(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      toast.success("Automation duplicated");
    },
    onError: (error) => {
      toast.error("Failed to duplicate automation: " + error.message);
    },
  });

  return {
    automations: automationsQuery.data || [],
    isLoading: automationsQuery.isLoading,
    error: automationsQuery.error,
    addAutomation,
    updateAutomation,
    deleteAutomation,
    deleteAutomations,
    toggleAutomation,
    duplicateAutomation,
  };
}

export function useAutomationRuns(automationId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["automation-runs", automationId, user?.id],
    queryFn: async () => {
      if (!user) return [];
      let query = supabase
        .from("automation_runs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(50);

      if (automationId) {
        query = query.eq("automation_id", automationId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data.map(mapAutomationRun);
    },
    enabled: !!user,
  });
}
