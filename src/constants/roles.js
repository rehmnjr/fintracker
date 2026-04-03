export const ROLES = {
  ADMIN: 'admin',
  VIEWER: 'viewer',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.VIEWER]: 'Viewer',
};

export const ROLE_DESCRIPTIONS = {
  [ROLES.ADMIN]: 'Full access — can add, edit, and delete transactions',
  [ROLES.VIEWER]: 'Read-only access — can view transactions and insights',
};
