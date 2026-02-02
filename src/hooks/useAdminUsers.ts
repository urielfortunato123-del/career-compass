import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AdminUser, AppRole } from '@/types/admin';
import { toast } from '@/hooks/use-toast';

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('admin-users', {
        method: 'GET',
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setUsers(data.users || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar usuários';
      setError(message);
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const addRole = useCallback(async (userId: string, role: AppRole) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-users', {
        method: 'POST',
        body: { userId, role, action: 'add' },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast({
        title: 'Sucesso',
        description: `Role "${role}" adicionada com sucesso`,
      });

      await fetchUsers();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao adicionar role';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return false;
    }
  }, [fetchUsers]);

  const removeRole = useCallback(async (userId: string, role: AppRole) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-users', {
        method: 'POST',
        body: { userId, role, action: 'remove' },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      toast({
        title: 'Sucesso',
        description: `Role "${role}" removida com sucesso`,
      });

      await fetchUsers();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao remover role';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
      return false;
    }
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    addRole,
    removeRole,
  };
}
