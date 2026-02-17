"use client";

import {useEffect, useMemo, useState} from "react";
import {usePathname} from "next/navigation";
import {useSession} from "next-auth/react";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import LogoutButton from "@/components/LogoutButton";
import Image from "next/image";

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
  const {data: session} = useSession();

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
    <div className="sticky top-0 z-20 border-b bg-card text-foreground py-3 pr-5 pl-16 md:px-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">{title}</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              title="User profile"
            >
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div>{session?.user?.name?.slice(0, 1).toUpperCase()}</div>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80">
            {session?.user && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Name
                    </p>
                    <p className="text-base font-semibold">
                      {session.user.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="text-base">{session.user.email}</p>
                  </div>
                </div>
                <LogoutButton variant="default" className="w-full" />
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
