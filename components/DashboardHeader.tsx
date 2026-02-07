"use client";

import {useMemo} from "react";
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

  const title = useMemo(() => {
    if (!pathname) {
      return "Dashboard";
    }

    if (titlesByPath[pathname]) {
      return titlesByPath[pathname];
    }

    const lastSegment = pathname.split("/").filter(Boolean).pop();

    return lastSegment ? toTitleCase(lastSegment) : "Dashboard";
  }, [pathname]);

  return (
    <div className="border-b py-3.5 pr-5 pl-16 md:px-5 bg-white dark:bg-gray-800">
      <h1 className="text-lg sm:text-center font-semibold">{title}</h1>
    </div>
  );
}
