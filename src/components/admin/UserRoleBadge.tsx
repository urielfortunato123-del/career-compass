import { Badge } from '@/components/ui/badge';
import { Shield, Crown, User } from 'lucide-react';
import type { AppRole } from '@/types/admin';

interface UserRoleBadgeProps {
  role: AppRole;
}

const roleConfig: Record<AppRole, { label: string; variant: 'default' | 'secondary' | 'outline'; icon: React.ReactNode }> = {
  admin: {
    label: 'Admin',
    variant: 'default',
    icon: <Shield className="w-3 h-3" />,
  },
  moderator: {
    label: 'Moderador',
    variant: 'secondary',
    icon: <Crown className="w-3 h-3" />,
  },
  user: {
    label: 'Usuário',
    variant: 'outline',
    icon: <User className="w-3 h-3" />,
  },
};

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const config = roleConfig[role];

  return (
    <Badge variant={config.variant} className="gap-1">
      {config.icon}
      {config.label}
    </Badge>
  );
}
