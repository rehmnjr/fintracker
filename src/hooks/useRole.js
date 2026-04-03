import { useApp } from '../context/AppContext';
import { ROLES } from '../constants/roles';

export function useRole() {
  const { role, isAdmin, toggleRole } = useApp();

  const can = (action) => {
    const permissions = {
      [ROLES.ADMIN]: ['view', 'add', 'edit', 'delete', 'export'],
      [ROLES.VIEWER]: ['view', 'export'],
    };
    return (permissions[role] || []).includes(action);
  };

  return { role, isAdmin, toggleRole, can };
}
