import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type AppRole = 'admin' | 'moderator' | 'user';

/**
 * Returns the highest-privilege role for the current user.
 * Resolves to 'user' as the default if no role row is found.
 */
export function useUserRole() {
  const { user } = useAuth();

  const { data: role = 'user', isLoading } = useQuery<AppRole>({
    queryKey: ['userRole', user?.id],
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 min — roles rarely change
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user!.id)
        .order('role', { ascending: true }); // admin < moderator < user alphabetically

      if (error) throw error;

      // Prefer admin > moderator > user
      if (data?.some((r) => r.role === 'admin')) return 'admin';
      if (data?.some((r) => r.role === 'moderator')) return 'moderator';
      return 'user';
    },
  });

  return { role, isAdmin: role === 'admin', isLoading };
}
