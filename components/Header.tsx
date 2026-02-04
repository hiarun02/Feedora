"use client";

import React, {useState} from "react";
import Link from "next/link";
import {useSession, signOut} from "next-auth/react";

import {Button} from "./ui/button";

import {ThemeToggle} from "./ThemeToggle";
import {LogOutIcon} from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const {data: session} = useSession();

  const navLinks: Array<{name: string; href: string}> = [
    {name: "Features", href: "/#features"},
    {name: "How It Works", href: "/#how-it-works"},
    {name: "FAQ", href: "/#faq"},
  ];

  return (
    <header className="w-full shadow-2xs fixed top-0 z-50 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="text-md font-bold">Feedora</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-5">
            {/* desktop nav */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              {navLinks.map((link, i) => (
                <Link key={i} href={link.href}>
                  {link.name}
                </Link>
              ))}
            </nav>
            {/* Desktop CTAs */}

            <div className="flex items-center gap-2 text-sm font-medium">
              <Link href="/signin">
                <Button variant="outline">Sign in</Button>
              </Link>
            </div>

            {/* theme toggle */}

            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            {/* theme toggle */}

            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>

              {open ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`${open ? "block" : "hidden"} md:hidden  border-t `}
      >
        <div className="px-4 pt-4 pb-6 space-y-4">
          <nav className="flex flex-col gap-3">
            {session &&
              navLinks.map((link, i) => (
                <Link key={i} href={link.href}>
                  {link.name}
                </Link>
              ))}
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
            {session ? (
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                  className="w-full"
                >
                  Logout <LogOutIcon />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/signin">
                  <Button variant="outline" className="w-full">
                    Sign in
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
