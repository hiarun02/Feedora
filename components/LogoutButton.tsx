"use client";

import {signOut} from "next-auth/react";
import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";

type LogoutButtonProps = {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  showText?: boolean;
};

export default function LogoutButton({
  className,
  size = "sm",
  variant = "outline",
  showText = true,
}: LogoutButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className ?? ""}`.trim()}
      onClick={() => signOut({callbackUrl: "/"})}
    >
      <span className={showText ? "" : "sr-only"}>Logout</span>
      <LogOut />
    </Button>
  );
}
