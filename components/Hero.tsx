"use client";

import Link from "next/dist/client/link";
import {Button} from "./ui/button";

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex py-10 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
          Embed. Listen. Improve.
          <br />
          <span className="text-gray-600 font-2xl"></span>
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Your users have ideas. Don’t miss them. Embed our simple feedback form
          and start capturing valuable insights instantly
        </p>

        {/* Call-to-Action Button */}
        <div className="flex justify-center space-x-4">
          <Link href="/register">
            <Button variant="outline" className=" py-5 px-10">
              Get Started
            </Button>
          </Link>
          <Link href="/docs">
            <Button className=" py-5 px-10">Docs</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
