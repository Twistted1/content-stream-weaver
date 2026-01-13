export interface Notification {
  id: string;
  type: "post" | "automation" | "user" | "system" | "strategy";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "post",
    title: "Post Scheduled",
    message: "Your Instagram post has been scheduled for tomorrow at 9:00 AM",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    link: "/platforms",
  },
  {
    id: "2",
    type: "automation",
    title: "Automation Completed",
    message: "Weekly content repurposing completed successfully with 5 posts created",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    link: "/automation",
  },
  {
    id: "3",
    type: "user",
    title: "New Team Member",
    message: "Sarah Chen has joined your workspace",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    link: "/users",
  },
  {
    id: "4",
    type: "strategy",
    title: "Strategy Goal Completed",
    message: "Completed goal: Increase engagement rate to 5%",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    link: "/strategies",
  },
  {
    id: "5",
    type: "system",
    title: "Weekly Report Ready",
    message: "Your weekly analytics report is ready to view",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    link: "/reports",
  },
];

export function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "post":
      return "FileText";
    case "automation":
      return "Zap";
    case "user":
      return "UserPlus";
    case "strategy":
      return "Target";
    case "system":
      return "Settings";
    default:
      return "Bell";
  }
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
