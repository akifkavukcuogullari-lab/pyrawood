import { JsonLd } from './JsonLd';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqJsonLdProps {
  questions: FaqItem[];
}

export function FaqJsonLd({ questions }: FaqJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}
