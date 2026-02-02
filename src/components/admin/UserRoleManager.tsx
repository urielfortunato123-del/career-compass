import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserRoleBadge } from './UserRoleBadge';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import type { AdminUser, AppRole } from '@/types/admin';

interface UserRoleManagerProps {
  user: AdminUser;
  onAddRole: (userId: string, role: AppRole) => Promise<boolean>;
  onRemoveRole: (userId: string, role: AppRole) => Promise<boolean>;
}

const availableRoles: AppRole[] = ['admin', 'moderator', 'user'];

export function UserRoleManager({ user, onAddRole, onRemoveRole }: UserRoleManagerProps) {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AppRole | ''>('');
  const [loading, setLoading] = useState(false);
  const [removingRole, setRemovingRole] = useState<AppRole | null>(null);

  const missingRoles = availableRoles.filter(role => !user.roles.includes(role));

  const handleAddRole = async () => {
    if (!selectedRole) return;

    setLoading(true);
    const success = await onAddRole(user.id, selectedRole);
    setLoading(false);

    if (success) {
      setSelectedRole('');
    }
  };

  const handleRemoveRole = async (role: AppRole) => {
    setRemovingRole(role);
    await onRemoveRole(user.id, role);
    setRemovingRole(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Gerenciar Roles
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerenciar Roles</DialogTitle>
          <DialogDescription>
            {user.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Roles */}
          <div>
            <h4 className="text-sm font-medium mb-2">Roles atuais</h4>
            {user.roles.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma role atribuída</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.roles.map((role) => (
                  <div key={role} className="flex items-center gap-1">
                    <UserRoleBadge role={role} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRemoveRole(role)}
                      disabled={removingRole === role}
                    >
                      {removingRole === role ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3 text-destructive" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Role */}
          {missingRoles.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Adicionar role</h4>
              <div className="flex gap-2">
                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecione uma role" />
                  </SelectTrigger>
                  <SelectContent>
                    {missingRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role === 'admin' ? 'Admin' : role === 'moderator' ? 'Moderador' : 'Usuário'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddRole} disabled={!selectedRole || loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
