import { useMemo } from "react";
import { useProjects } from "@/hooks/useProjects";
import { usePosts } from "@/hooks/usePosts";
import { useAutomations } from "@/hooks/useAutomations";
import { useUsers } from "@/hooks/useUsers";
import { useStrategies } from "@/hooks/useStrategies";

export interface SearchResult {
  id: string;
  type: "project" | "post" | "automation" | "user" | "strategy";
  title: string;
  description: string;
  link: string;
  icon: string;
}

export function useGlobalSearch(query: string): SearchResult[] {
  const { projects } = useProjects();
  const { posts } = usePosts();
  const { automations } = useAutomations();
  const { users } = useUsers();
  const { strategies } = useStrategies();

  return useMemo(() => {
    if (!query || query.length < 2) return [];

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search projects
    projects.forEach((project) => {
      if (
        project.title.toLowerCase().includes(lowerQuery) ||
        project.description.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          id: project.id,
          type: "project",
          title: project.title,
          description: project.description,
          link: "/projects",
          icon: "Folder",
        });
      }
    });

    // Search posts
    posts.forEach((post) => {
      if (
        post.title.toLowerCase().includes(lowerQuery) ||
        (post.content && post.content.toLowerCase().includes(lowerQuery))
      ) {
        results.push({
          id: post.id,
          type: "post",
          title: post.title,
          description: post.content || "",
          link: "/platforms",
          icon: "FileText",
        });
      }
    });

    // Search automations
    automations.forEach((automation) => {
      if (
        automation.name.toLowerCase().includes(lowerQuery) ||
        automation.description.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          id: automation.id,
          type: "automation",
          title: automation.name,
          description: automation.description,
          link: "/automation",
          icon: "Zap",
        });
      }
    });

    // Search users
    users.forEach((user) => {
      if (
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          id: user.id,
          type: "user",
          title: user.name,
          description: `${user.role} - ${user.email}`,
          link: "/users",
          icon: "User",
        });
      }
    });

    // Search strategies
    strategies.forEach((strategy) => {
      if (
        strategy.name.toLowerCase().includes(lowerQuery) ||
        (strategy.description && strategy.description.toLowerCase().includes(lowerQuery))
      ) {
        results.push({
          id: strategy.id,
          type: "strategy",
          title: strategy.name,
          description: strategy.description || "",
          link: "/strategies",
          icon: "Target",
        });
      }
    });

    return results.slice(0, 10);
  }, [query, projects, posts, automations, users, strategies]);
}
