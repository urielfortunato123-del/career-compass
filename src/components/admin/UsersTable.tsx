import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserRoleBadge } from './UserRoleBadge';
import { UserRoleManager } from './UserRoleManager';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle, XCircle, Crown } from 'lucide-react';
import type { AdminUser, AppRole } from '@/types/admin';

interface UsersTableProps {
  users: AdminUser[];
  onAddRole: (userId: string, role: AppRole) => Promise<boolean>;
  onRemoveRole: (userId: string, role: AppRole) => Promise<boolean>;
}

export function UsersTable({ users, onAddRole, onRemoveRole }: UsersTableProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return format(new Date(dateStr), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Plano</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Email Verificado</TableHead>
            <TableHead>Último Acesso</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{user.name || '-'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </TableCell>
              <TableCell>
                {user.plan === 'pro' ? (
                  <Badge className="bg-warning/20 text-warning border-warning/30">
                    <Crown className="w-3 h-3 mr-1" />
                    PRO
                  </Badge>
                ) : (
                  <Badge variant="outline">Free</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.roles.length === 0 ? (
                    <span className="text-sm text-muted-foreground">-</span>
                  ) : (
                    user.roles.map((role) => (
                      <UserRoleBadge key={role} role={role} />
                    ))
                  )}
                </div>
              </TableCell>
              <TableCell>
                {user.email_confirmed_at ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-muted-foreground" />
                )}
              </TableCell>
              <TableCell className="text-sm">
                {formatDate(user.last_sign_in_at)}
              </TableCell>
              <TableCell className="text-sm">
                {formatDate(user.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <UserRoleManager
                  user={user}
                  onAddRole={onAddRole}
                  onRemoveRole={onRemoveRole}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
