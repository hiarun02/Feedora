import Link from "next/link";
import {Button} from "./ui/button";

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x1">
            <Link href="/">
              <h1 className=" font-bold text-black">Feedlyze </h1>
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-black transition-colors"
              aria-label="Follow us on X"
            >
              <Button variant="outline" className="">
                Login
              </Button>
            </Link>

            {/* */}
          </div>
        </div>
      </div>
    </header>
  );
}
