"use client";

import React, {useState} from "react";
import Link from "next/link";

import {Button} from "./ui/button";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full  text-black bg-white shadow-2xs fixed top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="font-bold">Feedlyze</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-5">
            {/* desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/">Home</Link>
              <Link href="/docs">Docs</Link>
              <Link href="/project">Projects</Link>
            </nav>
            {/* Desktop CTAs */}
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign up</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
        className={`${
          open ? "block" : "hidden"
        } md:hidden  border-t border-white/10`}
      >
        <div className="px-4 pt-4 pb-6 space-y-4">
          <nav className="flex flex-col gap-3">
            <Link href="/" className="px-3 py-2 rounded hover:bg-gray-600">
              Home
            </Link>
            <Link href="/docs" className="px-3 py-2 rounded hover:bg-gray-600">
              Docs
            </Link>
            <Link
              href="/project"
              className="px-3 py-2 rounded hover:bg-gray-600"
            >
              Project
            </Link>
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
            <Link
              href="/login"
              className="px-3 py-2 border border-white rounded text-center"
            >
              <Button className="w-full">Login</Button>
            </Link>
            <Link
              href="/register"
              className="px-3 py-2 bg-white text-black rounded text-center"
            >
              <Button className="w-full">Sign up</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
