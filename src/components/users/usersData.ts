export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "editor" | "viewer" | "member";
  status: "active" | "inactive" | "pending";
  lastActive: string;
  joinedDate: string;
  permissions: string[];
}

export const roles = [
  { value: "admin", label: "Admin", description: "Full access to all features", color: "primary" },
  { value: "editor", label: "Editor", description: "Can create and edit content", color: "blue" },
  { value: "viewer", label: "Viewer", description: "Can view content and analytics", color: "secondary" },
  { value: "member", label: "Member", description: "Basic access only", color: "muted" },
] as const;

export const permissions = [
  { id: "manage_users", label: "Manage Users", description: "Add, edit, and remove team members" },
  { id: "manage_content", label: "Manage Content", description: "Create, edit, and delete content" },
  { id: "manage_settings", label: "Manage Settings", description: "Configure system settings" },
  { id: "view_analytics", label: "View Analytics", description: "Access analytics and reports" },
  { id: "view_content", label: "View Content", description: "View published content" },
  { id: "publish_content", label: "Publish Content", description: "Publish content to platforms" },
] as const;

export const rolePermissions: Record<string, string[]> = {
  admin: ["manage_users", "manage_content", "manage_settings", "view_analytics", "view_content", "publish_content"],
  editor: ["manage_content", "view_analytics", "view_content", "publish_content"],
  viewer: ["view_analytics", "view_content"],
  member: ["view_content"],
};

export const getStatusColor = (status: User["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "inactive":
      return "";
    case "pending":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
  }
};

export const getRoleColor = (role: User["role"]) => {
  switch (role) {
    case "admin":
      return "bg-primary/10 text-primary hover:bg-primary/20";
    case "editor":
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    case "viewer":
      return "";
    case "member":
      return "";
  }
};
