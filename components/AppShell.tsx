"use client";

import {usePathname} from "next/navigation";

type AppShellProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer: React.ReactNode;
};

export default function AppShell({children, header}: AppShellProps) {
  const pathname = usePathname();
  const hideHeaderFooter = pathname?.startsWith("/dashboard");

  return (
    <>
      {!hideHeaderFooter && header}
      {children}
    </>
  );
}
