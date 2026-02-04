import {PointerHighlight} from "./ui/pointer-highlight";

const FeaturesSection = () => {
  const features = [
    {
      icon: "🚀",
      title: "Easy Integration",
      description:
        "Embed our feedback widget with minimal code, ensuring a seamless integration process.",
    },
    {
      icon: "💡",
      title: "Insightful Analytics",
      description:
        "Gain valuable insights from user feedback with our advanced analytics dashboard.",
    },
    {
      icon: "🗂️",
      title: "Categorize Feedback",
      description:
        "Easily categorize and manage user feedback to streamline your review process.",
    },
    {
      icon: "⚙️",
      title: "Customizable",
      description:
        "Tailor the feedback widget to match your brand's look and feel with our extensive customization options.",
    },
    {
      icon: "📥",
      title: "Download CSV",
      description:
        "Easily export user feedback data in CSV format for offline analysis.",
    },
    {
      icon: "🔒",
      title: "Secure & Reliable",
      description:
        "Our platform is built with security in mind, ensuring that user data is protected at all times.",
    },
  ];
  return (
    <div
      id="features"
      className="mx-auto max-w-6xl lg:py-20 py-10 relative scroll-mt-24"
    >
      <h2 className="flex justify-center items-center font-extrabold lg:text-4xl text-3xl my-10 lg:mb-25 mb-20">
        <PointerHighlight>Our Features</PointerHighlight>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-5">
        {features.map((feature, index) => (
          <div key={index} className="border p-5 rounded-lg shadow ">
            <div className="flex items-center mb-4 space-x-3 ">
              <span className="text-3xl">{feature.icon}</span>
              <h3 className="font-bold">{feature.title}</h3>
            </div>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
