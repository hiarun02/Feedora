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
};

export default function LogoutButton({
  className,
  size = "sm",
  variant = "outline",
}: LogoutButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => signOut({callbackUrl: "/"})}
    >
      Logout <LogOut />
    </Button>
  );
}
