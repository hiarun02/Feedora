"use client";

import * as React from "react";
import {cn} from "@/lib/utils";

type MarqueeProps = React.ComponentProps<"div"> & {
  pauseOnHover?: boolean;
  reverse?: boolean;
  repeat?: number;
  durationSeconds?: number;
};

export function Marquee({
  className,
  children,
  pauseOnHover = true,
  reverse = false,
  repeat = 2,
  durationSeconds = 24,
  ...props
}: MarqueeProps) {
  const copies = Array.from({length: Math.max(2, repeat)});

  return (
    <div
      className={cn(
        "relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className,
      )}
      {...props}
    >
      {copies.map((_, index) => (
        <div
          key={index}
          className={cn(
            "flex min-w-max shrink-0 items-stretch gap-4 px-2 animate-feedora-marquee",
            reverse && "[animation-direction:reverse]",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
          style={{
            animationDuration: `${durationSeconds}s`,
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
