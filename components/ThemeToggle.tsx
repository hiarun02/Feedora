"use client";

import {MoonIcon, SunIcon} from "lucide-react";
import {useTheme} from "next-themes";
import React from "react";

export function ThemeToggle({size = "md"}: {size?: "sm" | "md"}) {
  const {setTheme, theme, resolvedTheme} = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const sizeClasses = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const iconClasses = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <button
      className={`relative ${sizeClasses} rounded-full bg-secondary hover:bg-secondary/80 transition-colors overflow-hidden`}
      onClick={() => {
        setTheme(theme === "light" ? "dark" : "light");

        console.log(theme);
      }}
      aria-label="Toggle theme"
    >
      <SunIcon
        className={`absolute inset-0 ${iconClasses} m-auto transition-all ${
          theme === "light" || resolvedTheme === "light"
            ? "scale-100 rotate-0"
            : "scale-0 -rotate-90"
        }`}
      />
      <MoonIcon
        className={`absolute inset-0 ${iconClasses} m-auto transition-all ${
          theme === "dark" || resolvedTheme === "dark"
            ? "scale-100 rotate-0"
            : "scale-0 rotate-90"
        }`}
      />
    </button>
  );
}
