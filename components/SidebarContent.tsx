"use client";

import {useState} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  FolderDot,
  MessageCircle,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import LogoutButton from "@/components/LogoutButton";

export default function SidebarContent() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    {name: "Dashboard", icon: LayoutDashboard, href: "/dashboard"},
    {name: "Projects", icon: FolderDot, href: "/dashboard/projects"},
    {name: "Feedbacks", icon: MessageCircle, href: "/dashboard/feedback"},
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-2 left-4 z-50 inline-flex items-center justify-center h-10 w-10 rounded-md border bg-card text-foreground shadow-sm"
        aria-label="Open sidebar"
      >
        <Menu size={18} />
      </button>
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
          isMobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden={!isMobileOpen}
      />
      <aside
        className={`border-r h-full flex flex-col transition-all duration-300 bg-card text-foreground z-50 fixed md:static top-0 left-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 ${isOpen ? "md:w-60" : "md:w-20"} w-60`}
      >
        <div className="border-b py-3 px-4 flex items-center gap-2 justify-between">
          {isOpen && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image src="/favicon.svg" alt="Feedora" width={32} height={32} />
              <h3 className="font-bold text-lg">Feedora</h3>
            </Link>
          )}
          {!isOpen && (
            <Link href="/dashboard" className="flex justify-center w-full">
              <Image src="/favicon.svg" alt="Feedora" width={32} height={32} />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-muted"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="flex flex-col gap-8 p-5 h-full justify-between">
          <ul className="flex flex-col gap-4 text-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const IconComponent = link.icon;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`flex items-center font-medium gap-3 p-2 rounded-md transition-all duration-200 ${
                      isActive
                        ? "bg-foreground text-background"
                        : "hover:bg-muted"
                    } ${!isOpen ? "justify-center" : ""}`}
                    title={!isOpen ? link.name : ""}
                  >
                    <IconComponent size={18} />
                    {isOpen && <span>{link.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
          {/* bottom section */}
          <div className="flex flex-col gap-2">
            <LogoutButton
              variant="default"
              size={isOpen ? "sm" : "icon"}
              showText={isOpen}
              className={isOpen ? "" : "w-10"}
            />
            <div className="border-t pt-2 flex justify-end">
              <Button
                className="hidden md:inline-flex w-fit"
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <ChevronsLeft size={18} />
                ) : (
                  <ChevronsRight size={18} />
                )}
              </Button>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
