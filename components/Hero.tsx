"use client";

import Link from "next/dist/client/link";
import {Button} from "./ui/button";
import FeaturesSection from "./FeaturesSection";
import HowItWorks from "./HowItWorks";
import {FAQSection} from "./FAQSection";
import ActionSection from "./ActionSection";
import {Sparkles, ArrowRight} from "lucide-react";
import {Cover} from "./ui/cover";

const Hero = () => {
  return (
    <>
      <section
        id="home"
        className="min-h-screen flex flex-col mb-5 py-0 relative overflow-hidden"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 flex-1 flex flex-col justify-center">
          <div className="flex flex-col items-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full border  text-foreground text-sm font-medium cursor-pointer">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                Discover genuine feedback from your users
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight tracking-tight text-foreground">
            Embed. Listen.
            <br />
            <Cover>Improve.</Cover>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed text-muted-foreground ">
            Your users have ideas. Don&apos;t miss them. Embed our simple
            feedback form and start capturing valuable insights instantly. No
            setup required.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link href="/signin">
              <Button size="lg" className="px-8 py-4 text-base font-semibold">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/docs"></Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className=" py-10">
        <FeaturesSection />
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Action Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ActionSection />
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/30 py-10">
        <FAQSection />
      </section>
    </>
  );
};

export default Hero;
