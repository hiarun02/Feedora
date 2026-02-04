import {PointerHighlight} from "./ui/pointer-highlight";

const HowItWorks = () => {
  const steps = [
    {
      step: 1,
      title: "Signup & Integrate",
      description: "Sign up and integrate our feedback widget into your app.",
    },
    {
      step: 2,
      title: "Collect Feedback",
      description: "Collect user feedback effortlessly.",
    },
    {
      step: 3,
      title: "Analyze Feedback",
      description: "Analyze feedback and improve your product.",
    },
  ];

  return (
    <div id="how-it-works" className="mx-auto max-w-6xl py-10 scroll-mt-24">
      <h2 className="flex justify-center items-center font-extrabold lg:text-4xl text-3xl my-10 mb-20">
        <PointerHighlight>How It Works</PointerHighlight>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-5">
        {steps.map((step, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg shadow flex flex-col items-center text-center"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-black text-white dark:bg-white dark:text-black rounded-full mb-4 font-extrabold">
              {step.step}
            </div>
            <h3 className="font-bold">{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
