import {PointerHighlight} from "./ui/pointer-highlight";
import {Zap, Brain, Folder, Wrench, Download, Shield} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      Icon: Zap,
      title: "Easy Integration",
      description:
        "Embed our feedback widget with minimal code, ensuring a seamless integration process.",
    },
    {
      Icon: Brain,
      title: "Insightful Analytics",
      description:
        "Gain valuable insights from user feedback with our advanced analytics dashboard.",
    },
    {
      Icon: Folder,
      title: "Categorize Feedback",
      description:
        "Easily categorize and manage user feedback to streamline your review process.",
    },
    {
      Icon: Wrench,
      title: "Customizable",
      description:
        "Tailor the feedback widget to match your brand's look and feel with our extensive customization options.",
    },
    {
      Icon: Download,
      title: "Download CSV",
      description:
        "Easily export user feedback data in CSV format for offline analysis.",
    },
    {
      Icon: Shield,
      title: "Secure & Reliable",
      description:
        "Our platform is built with security in mind, ensuring that user data is protected at all times.",
    },
  ];
  return (
    <div
      id="features"
      className="mx-auto max-w-6xl lg:py-10 py-10 relative scroll-mt-24 px-4 sm:px-6 lg:px-8"
    >
      <h2 className="flex justify-center items-center font-extrabold lg:text-4xl text-3xl my-10 lg:mb-20 mb-16">
        <PointerHighlight>Our Features</PointerHighlight>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-card"
          >
            <div className="flex items-start mb-4 space-x-4">
              <feature.Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
              <h3 className="font-bold text-lg mt-1">{feature.title}</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
