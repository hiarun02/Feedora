"use client";

import {useEffect, useMemo, useState} from "react";
import {usePathname} from "next/navigation";

const titlesByPath: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/projects": "Projects",
  "/dashboard/feedback": "Feedback",
};

function toTitleCase(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function DashboardHeader() {
  const pathname = usePathname();
  const [dynamicTitle, setDynamicTitle] = useState<string | null>(null);

  const {baseTitle, projectId} = useMemo(() => {
    if (!pathname) {
      return {baseTitle: "Dashboard", projectId: null};
    }

    if (titlesByPath[pathname]) {
      return {baseTitle: titlesByPath[pathname], projectId: null};
    }

    const projectMatch = pathname.match(/^\/dashboard\/projects\/(\d+)$/);

    if (projectMatch) {
      return {baseTitle: "Project", projectId: projectMatch[1]};
    }

    const lastSegment = pathname.split("/").filter(Boolean).pop();
    return {
      baseTitle: lastSegment ? toTitleCase(lastSegment) : "Dashboard",
      projectId: null,
    };
  }, [pathname]);

  useEffect(() => {
    let isCancelled = false;

    if (!projectId) {
      setDynamicTitle(null);
      return () => {
        isCancelled = true;
      };
    }

    setDynamicTitle(null);

    const loadProjectTitle = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as {project?: {name?: string}};

        if (!isCancelled && data.project?.name) {
          setDynamicTitle(data.project.name);
        }
      } catch {
        if (!isCancelled) {
          setDynamicTitle(null);
        }
      }
    };

    void loadProjectTitle();

    return () => {
      isCancelled = true;
    };
  }, [projectId]);

  const title = dynamicTitle ?? baseTitle;

  return (
    <div className="border-b bg-card text-foreground py-3.5 pr-5 pl-16 md:px-5">
      <h1 className="text-lg font-semibold">{title}</h1>
    </div>
  );
}
