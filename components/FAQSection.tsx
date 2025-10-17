import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      id: "item-1",
      question: "What is your product?",
      answer:
        "Our product is a state-of-the-art solution designed to streamline your workflow and enhance productivity.",
    },
    {
      id: "item-2",
      question: "How does the integration process work?",
      answer:
        "Integration is simple and straightforward. Follow our step-by-step guide to get started.",
    },
    {
      id: "item-3",
      question: "What support options are available?",
      answer:
        "We offer 24/7 customer support through various channels, including chat, email, and phone.",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl lg:py-20 py-10 px-5">
      <h2 className="text-center font-extrabold lg:text-4xl text-3xl my-10 mb-20">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-[70vw] mx-auto">
        {faqs.map((faq) => (
          <AccordionItem value={faq.id} className="" key={faq.id}>
            <div className="mb-4">
              <AccordionTrigger className="w-full text-left font-medium lg:text-lg text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance max-w-6xl lg:text-base text-sm mt-2">
                {faq.answer}
              </AccordionContent>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
