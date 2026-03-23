'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

interface FaqItem {
  question: string;
  answer: string;
}

export function ReturnsFaq({ items }: { items: FaqItem[] }) {
  return (
    <Accordion>
      {items.map((item, index) => (
        <AccordionItem key={index} value={`faq-${index}`}>
          <AccordionTrigger className="text-left text-pyra-charcoal">
            {item.question}
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
