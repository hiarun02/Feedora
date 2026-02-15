import Link from "next/link";
import React from "react";
import {Button} from "./ui/button";
import {ArrowRight} from "lucide-react";

const ActionSection = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:py-20 py-16 bg-gradient-to-r rounded-2xl border my-10">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Ready to transform your user feedback experience?
      </h2>
      <p className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground leading-relaxed">
        Join thousands of product teams that use Feedora to capture and act on
        user feedback. Start turning ideas into improvements today!
      </p>
      <div className="flex justify-center gap-4 mt-10">
        <Link href="/signin">
          <Button className="py-5 px-8 text-base flex items-center gap-2 group">
            Get Started for Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ActionSection;
