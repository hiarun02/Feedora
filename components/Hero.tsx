"use client";

import Link from "next/dist/client/link";
import {Button} from "./ui/button";
import FeaturesSection from "./FeaturesSection";
import HowItWorks from "./HowItWorks";
import {FAQSection} from "./FAQSection";
import ActionSection from "./ActionSection";
import {Sparkles} from "lucide-react";
import {Cover} from "./ui/cover";
import {BackgroundRippleEffect} from "./ui/background-ripple-effect";

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex bg-white flex-col py-10">
      <BackgroundRippleEffect />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-10 z-10 ">
        <div className="flex flex-col items-center max-w-4xl mx-auto mt-12 sm:mt-20">
          <div className="flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-[#E7E9EC] text-slate-900 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">
              discover genuine feedback
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
          Embed. Listen. <Cover>Improve.</Cover>
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
            <Button className=" py-5 px-10">Get Started</Button>
          </Link>
          <Link href="/docs">
            <Button variant="outline" className=" py-5 px-10">
              Docs
            </Button>
          </Link>
        </div>
      </div>
      {/* Features Section */}
      <FeaturesSection />
      {/* How It Works Section */}
      <HowItWorks />
      {/* FAQ Section */}
      <FAQSection />
      {/* Final Call-to-Action */}
      <ActionSection />
    </section>
  );
};

export default Hero;
