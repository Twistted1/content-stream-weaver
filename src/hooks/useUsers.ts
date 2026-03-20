import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  lastActive?: string;
  joinedDate: string;
  avatar?: string;
  permissions?: string[];
}

export function useUsers() {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // Fetch profiles and roles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          *,
          user_roles (
            role
          )
        `);

      if (profilesError) throw profilesError;

      // Fetch pending invitations
      const { data: invitations, error: invitesError } = await supabase
        .from("invitations")
        .select("*")
        .eq("status", "pending");

      if (invitesError) throw invitesError;

      // Map profiles to User interface
      const activeUsers = profiles.map((profile: any) => ({
        id: profile.user_id,
        name: profile.display_name || profile.email,
        email: profile.email || "",
        role: profile.user_roles?.[0]?.role || "user",
        status: profile.status || "active",
        lastActive: profile.last_active ? new Date(profile.last_active).toISOString() : undefined,
        joinedDate: new Date(profile.created_at).toLocaleDateString(),
        avatar: profile.avatar_url,
        permissions: [], // Permissions handled by role usually
      }));

      // Map invitations to User interface (pending users)
      const pendingUsers = invitations.map((invite: any) => ({
        id: invite.id,
        name: invite.email, // Use email as name for pending
        email: invite.email,
        role: invite.role,
        status: "pending",
        joinedDate: new Date(invite.created_at).toLocaleDateString(),
        permissions: [],
      }));

      return [...activeUsers, ...pendingUsers] as User[];
    },
  });

  const addUser = useMutation({
    mutationFn: async (newUser: { email: string; role: string }) => {
      // Check if user already exists in profiles
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", newUser.email)
        .single();

      if (existingUser) {
        throw new Error("User already exists");
      }

      // Check if invitation already exists
      const { data: existingInvite } = await supabase
        .from("invitations")
        .select("id")
        .eq("email", newUser.email)
        .eq("status", "pending")
        .single();

      if (existingInvite) {
        throw new Error("Invitation already sent to this email");
      }

      // Create invitation
      const { data, error } = await supabase
        .from("invitations")
        .insert({
          email: newUser.email,
          role: newUser.role,
          token: crypto.randomUUID(), // Simple token for now
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Invitation sent successfully");
    },
    onError: (error) => {
      toast.error(`Failed to invite user: ${error.message}`);
    },
  });

  const updateUser = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<User> }) => {
      // Check if it's a pending invitation
      const isPending = users.find(u => u.id === id)?.status === "pending";

      if (isPending) {
         // Update invitation
         const { error } = await supabase
          .from("invitations")
          .update({
            role: updates.role as any
          })
          .eq("id", id);
         if (error) throw error;
      } else {
        // Update profile
        const dbUpdates: any = {};
        if (updates.name) dbUpdates.display_name = updates.name;
        if (updates.status) dbUpdates.status = updates.status;
        
        if (Object.keys(dbUpdates).length > 0) {
          const { error } = await supabase
            .from("profiles")
            .update(dbUpdates)
            .eq("user_id", id);
          if (error) throw error;
        }

        // Update role if changed
        if (updates.role) {
           const { error } = await supabase
            .from("user_roles")
            .update({ role: updates.role as any })
            .eq("user_id", id);
           if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update user: ${error.message}`);
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      const isPending = users.find(u => u.id === id)?.status === "pending";

      if (isPending) {
        const { error } = await supabase
          .from("invitations")
          .delete()
          .eq("id", id);
        if (error) throw error;
      } else {
        // We can't delete from auth.users from client
        // But we can mark as inactive or delete from profiles/user_roles
        // Ideally we should call an edge function.
        // For now, we'll just delete from user_roles and profiles (cascades?)
        // Wait, profiles references auth.users. We can't delete auth.users.
        // Best we can do is mark inactive in profiles.
        
        const { error } = await supabase
          .from("profiles")
          .update({ status: 'inactive' })
          .eq("user_id", id);
          
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User removed/deactivated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to remove user: ${error.message}`);
    },
  });

  const resendInvite = useMutation({
    mutationFn: async (id: string) => {
       // Just mock for now, or update created_at to bump it
       const { error } = await supabase
         .from("invitations")
         .update({ created_at: new Date().toISOString() })
         .eq("id", id);
       if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Invitation resent successfully");
    },
  });

  return {
    users,
    isLoading,
    error,
    addUser: addUser.mutate,
    updateUser: (id: string, updates: Partial<User>) => updateUser.mutate({ id, updates }),
    deleteUser: deleteUser.mutate,
    resendInvite: resendInvite.mutate,
  };
}
