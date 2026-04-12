import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Report {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  type: string;
  format: string;
  status: string;
  lastGenerated: string | null;
  scheduleFrequency: string | null;
  scheduleNextRun: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useReports() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const reportsQuery = useQuery({
    queryKey: ["reports", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await (supabase as any)
        .from("reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map((r: any): Report => ({
        id: r.id,
        userId: r.user_id,
        name: r.name,
        description: r.description,
        type: r.type,
        format: r.format,
        status: r.status,
        lastGenerated: r.last_generated,
        scheduleFrequency: r.schedule_frequency,
        scheduleNextRun: r.schedule_next_run,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    },
    enabled: !!user,
  });

  const addReport = useMutation({
    mutationFn: async (report: {
      name: string;
      description: string;
      type: string;
      format: string;
      scheduleFrequency?: string;
      scheduleNextRun?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await (supabase as any)
        .from("reports")
        .insert({
          user_id: user.id,
          name: report.name,
          description: report.description,
          type: report.type,
          format: report.format,
          status: "Processing",
          schedule_frequency: report.scheduleFrequency || null,
          schedule_next_run: report.scheduleNextRun || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Simulate processing completion after 3 seconds
      setTimeout(async () => {
        await (supabase as any)
          .from("reports")
          .update({ status: "Ready", last_generated: new Date().toISOString() })
          .eq("id", data.id);
        queryClient.invalidateQueries({ queryKey: ["reports"] });
        toast.success(`"${report.name}" is ready`);
      }, 3000);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report created");
    },
    onError: (error: any) => {
      toast.error(`Failed to create report: ${error.message}`);
    },
  });

  const updateReport = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; status?: string; last_generated?: string }) => {
      const { error } = await (supabase as any)
        .from("reports")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });

  const deleteReport = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("reports")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report deleted");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete report: ${error.message}`);
    },
  });

  const regenerateReport = useMutation({
    mutationFn: async (id: string) => {
      await (supabase as any)
        .from("reports")
        .update({ status: "Processing" })
        .eq("id", id);

      // Simulate regeneration
      setTimeout(async () => {
        await (supabase as any)
          .from("reports")
          .update({ status: "Ready", last_generated: new Date().toISOString() })
          .eq("id", id);
        queryClient.invalidateQueries({ queryKey: ["reports"] });
        toast.success("Report regenerated");
      }, 2500);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.info("Regenerating report...");
    },
  });

  return {
    reports: reportsQuery.data || [],
    isLoading: reportsQuery.isLoading,
    addReport,
    updateReport,
    deleteReport,
    regenerateReport,
  };
}
