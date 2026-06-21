export const ROLES = {
  MEMBER: "member",
  EXECUTIVE: "executive",
  OBSERVER: "observer",
  EDITOR: "editor",
  ADMIN: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_WEIGHTS: Record<Role, number> = {
  [ROLES.MEMBER]: 1, // Regular members, don't have access to dashboards, can't edit
  [ROLES.EXECUTIVE]: 2, // Past execs, Can only see the admin dashboard, can't edit
  [ROLES.OBSERVER]: 3, // Current lower execs, Can see all dashboards, can't edit
  [ROLES.EDITOR]: 4, // Current higher execs, Can edit things
  [ROLES.ADMIN]: 5, // Full control, Only for core team members
};

export function requireMinimumRole(
  userRole: Role | undefined,
  requiredRole: Role,
): boolean {
  if (!userRole) return false; // If user role is undefined, they don't have access

  return ROLE_WEIGHTS[userRole] >= ROLE_WEIGHTS[requiredRole];
}
