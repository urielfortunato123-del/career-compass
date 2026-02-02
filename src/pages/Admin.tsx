import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UsersTable } from '@/components/admin/UsersTable';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, RefreshCw, Shield, Loader2, Users } from 'lucide-react';
import logo from '@/assets/logo.png';

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const { users, loading, fetchUsers, addRole, removeRole } = useAdminUsers();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!adminLoading && !isAdmin && user) {
      navigate('/');
    }
  }, [adminLoading, isAdmin, user, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, fetchUsers]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/">
              <img src={logo} alt="VagaJusta" className="h-12 w-auto" />
            </Link>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Shield className="w-4 h-4" />
              Painel Admin
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/app">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao App
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="w-8 h-8" />
              Gerenciar Usuários
            </h1>
            <p className="text-muted-foreground mt-1">
              Visualize e gerencie usuários e suas permissões
            </p>
          </div>
          <Button onClick={fetchUsers} disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span className="ml-2">Atualizar</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground">Total de Usuários</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground">Usuários Pro</p>
            <p className="text-2xl font-bold text-warning">
              {users.filter(u => u.plan === 'pro').length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground">Administradores</p>
            <p className="text-2xl font-bold text-primary">
              {users.filter(u => u.roles.includes('admin')).length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-sm text-muted-foreground">Email Verificado</p>
            <p className="text-2xl font-bold text-green-500">
              {users.filter(u => u.email_confirmed_at).length}
            </p>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum usuário encontrado</p>
          </div>
        ) : (
          <UsersTable
            users={users}
            onAddRole={addRole}
            onRemoveRole={removeRole}
          />
        )}
      </main>
    </div>
  );
}
