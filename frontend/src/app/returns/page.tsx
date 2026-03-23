import type { Metadata } from 'next';
import { RotateCcw, Clock, Shield, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FaqJsonLd } from '@/components/seo/FaqJsonLd';
import { ReturnsFaq } from './ReturnsFaq';

export const metadata: Metadata = {
  title: 'Returns & Exchanges',
  description:
    'Pyra Wood offers a 30-day return policy on all standard furniture orders. Learn about our hassle-free return process, refund timeline, and exchange options.',
  openGraph: {
    title: 'Returns & Exchanges | Pyra Wood',
    description:
      '30-day hassle-free return policy on handcrafted furniture. Full refund within 7-10 business days.',
    siteName: 'Pyra Wood',
    type: 'website',
  },
  alternates: { canonical: '/returns' },
};

const RETURN_STEPS = [
  {
    step: 1,
    title: 'Initiate Your Return',
    description:
      'Contact our customer service team by email at returns@pyrawood.com or by phone within 30 days of delivery. Provide your order number and reason for the return.',
  },
  {
    step: 2,
    title: 'Receive Return Authorization',
    description:
      'Our team will issue a Return Merchandise Authorization (RMA) number and provide prepaid shipping labels or schedule a pickup for larger items within 2 business days.',
  },
  {
    step: 3,
    title: 'Prepare and Ship',
    description:
      'Repackage the item in its original packaging if available, or use equivalent protective materials. Attach the prepaid shipping label and arrange pickup or drop-off.',
  },
  {
    step: 4,
    title: 'Receive Your Refund',
    description:
      'Once we receive and inspect the returned item, your refund will be processed within 7 to 10 business days to your original payment method.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'What is the return window?',
    answer:
      'You have 30 days from the date of delivery to initiate a return. The item must be in its original condition, free of damage, stains, or modifications. Please contact our team to begin the return process within this window.',
  },
  {
    question: 'Are custom orders eligible for return?',
    answer:
      'Custom and made-to-measure orders are non-returnable because they are built to your specific requirements. However, if a custom piece arrives with a manufacturing defect, we will repair or replace it at no charge under our lifetime structural warranty.',
  },
  {
    question: 'Who pays for return shipping?',
    answer:
      'For standard returns due to change of mind, a return shipping fee of $75 applies and will be deducted from your refund. If the item is defective or was damaged during shipping, Pyra Wood covers all return shipping costs.',
  },
  {
    question: 'Can I exchange an item instead of returning it?',
    answer:
      'Yes. If you would like to exchange your item for a different product, size, or finish, please indicate this when initiating your return. Exchanges follow the same 30-day window and condition requirements. Any price difference will be charged or refunded accordingly.',
  },
  {
    question: 'How long does a refund take?',
    answer:
      'Once we receive and inspect the returned furniture, refunds are processed within 7 to 10 business days. The refund is issued to your original payment method. Depending on your bank or credit card provider, it may take an additional 3 to 5 business days for the credit to appear on your statement.',
  },
  {
    question: 'What items cannot be returned?',
    answer:
      'Custom and made-to-measure orders, clearance items marked as final sale, and items that have been assembled, modified, or damaged after delivery are not eligible for return. Gift cards and fabric swatches are also non-returnable.',
  },
];

export default function ReturnsPage() {
  return (
    <>
      <FaqJsonLd questions={FAQ_ITEMS} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-pyra-sand/50 to-transparent py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-pyra-gold">
              Our Policy
            </p>
            <h1 className="mt-2 font-heading text-4xl font-bold text-pyra-walnut sm:text-5xl">
              Returns & Exchanges
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              We stand behind the quality of every piece we create. If you are not completely
              satisfied with your purchase, our straightforward return process makes it easy
              to find the right solution.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Highlights */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            <Card className="border-pyra-sand bg-pyra-cream/30 text-center">
              <CardContent className="p-6">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-pyra-forest/10">
                  <RotateCcw className="size-6 text-pyra-forest" />
                </div>
                <h2 className="font-heading text-lg font-semibold text-pyra-walnut">
                  30-Day Returns
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Full 30-day window from delivery date on all standard orders.
                </p>
              </CardContent>
            </Card>
            <Card className="border-pyra-sand bg-pyra-cream/30 text-center">
              <CardContent className="p-6">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-pyra-forest/10">
                  <Clock className="size-6 text-pyra-forest" />
                </div>
                <h2 className="font-heading text-lg font-semibold text-pyra-walnut">
                  Fast Refunds
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Refunds processed within 7 to 10 business days of receiving the return.
                </p>
              </CardContent>
            </Card>
            <Card className="border-pyra-sand bg-pyra-cream/30 text-center">
              <CardContent className="p-6">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-pyra-forest/10">
                  <Shield className="size-6 text-pyra-forest" />
                </div>
                <h2 className="font-heading text-lg font-semibold text-pyra-walnut">
                  Quality Guarantee
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Defective or damaged items are replaced or repaired at no cost to you.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-7xl" />

      {/* Detailed Policy */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <article className="space-y-10">
            <div>
              <h2 className="font-heading text-2xl font-bold text-pyra-walnut">
                Return Eligibility
              </h2>
              <p className="mt-3 leading-relaxed text-pyra-charcoal/80">
                To be eligible for a return, items must be in their original condition: free of
                scratches, stains, odors, or modifications. All original hardware, accessories, and
                documentation must be included. The return must be initiated within 30 calendar days
                of the delivery date confirmed by our carrier.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-pyra-walnut">
                Return Process
              </h2>
              <div className="mt-6 space-y-6">
                {RETURN_STEPS.map((step) => (
                  <div key={step.step} className="flex gap-4">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pyra-forest text-sm font-bold text-white">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-pyra-walnut">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-pyra-walnut">
                Non-Returnable Items
              </h2>
              <p className="mt-3 leading-relaxed text-pyra-charcoal/80">
                The following items are not eligible for return or exchange:
              </p>
              <ul className="mt-3 space-y-2 text-pyra-charcoal/80">
                {[
                  'Custom and made-to-measure orders',
                  'Clearance items marked as final sale',
                  'Items that have been assembled, altered, or damaged after delivery',
                  'Gift cards and fabric swatches',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ArrowRight className="mt-1 size-3.5 shrink-0 text-pyra-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-pyra-walnut">
                Refund Details
              </h2>
              <p className="mt-3 leading-relaxed text-pyra-charcoal/80">
                Approved returns are refunded to the original payment method within 7 to 10 business
                days of receipt and inspection. The original shipping cost is non-refundable unless the
                return is due to a manufacturing defect or shipping damage. For returns due to change
                of mind, a $75 return shipping fee applies and is deducted from the refund amount.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-pyra-sand bg-pyra-cream/50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-pyra-gold">
              Questions
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-pyra-walnut sm:text-4xl">
              Returns FAQ
            </h2>
          </div>
          <ReturnsFaq items={FAQ_ITEMS} />
        </div>
      </section>
    </>
  );
}
