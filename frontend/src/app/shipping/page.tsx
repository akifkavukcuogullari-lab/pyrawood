import type { Metadata } from 'next';
import { Truck, Clock, Shield, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FaqJsonLd } from '@/components/seo/FaqJsonLd';
import { ShippingFaq } from './ShippingFaq';

export const metadata: Metadata = {
  title: 'Shipping Information',
  description:
    'Pyra Wood offers free shipping on orders over $500, white-glove delivery, and 7-14 business day delivery on handcrafted furniture. Learn about our shipping policies and delivery options.',
  openGraph: {
    title: 'Shipping Information | Pyra Wood',
    description:
      'Free shipping on orders over $500. White-glove delivery available. 7-14 business day handcrafted-to-order delivery.',
    siteName: 'Pyra Wood',
    type: 'website',
  },
  alternates: { canonical: '/shipping' },
};

const SHIPPING_HIGHLIGHTS = [
  {
    icon: Truck,
    title: 'Free Shipping Over $500',
    description: 'Complimentary ground shipping on all domestic orders exceeding $500.',
  },
  {
    icon: Clock,
    title: '7-14 Business Days',
    description:
      'Each piece is handcrafted to order. Standard delivery takes 7 to 14 business days from order confirmation.',
  },
  {
    icon: Shield,
    title: 'White-Glove Delivery',
    description:
      'Our premium delivery service includes in-home placement, assembly, and packaging removal.',
  },
  {
    icon: MapPin,
    title: 'Nationwide Coverage',
    description:
      'We deliver to all 50 U.S. states. International shipping is available to select countries.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'How much does shipping cost?',
    answer:
      'Shipping is free on all domestic orders over $500. Orders under $500 incur a flat shipping fee of $50. White-glove delivery is available as an upgrade for $150 regardless of order value.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'Because each piece is handcrafted to order, standard delivery takes 7 to 14 business days from the date of order confirmation. Custom orders may require 6 to 10 weeks. You will receive an estimated delivery date in your confirmation email.',
  },
  {
    question: 'What is white-glove delivery?',
    answer:
      'White-glove delivery is our premium service that includes scheduled delivery to your preferred room, full assembly if required, and removal of all packaging materials. Our delivery team will contact you 24 to 48 hours in advance to schedule a two-hour delivery window.',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'Yes, we ship to Canada, the United Kingdom, Australia, and select European Union countries. International shipping rates are calculated at checkout based on destination and package dimensions. Duties and import taxes are the responsibility of the recipient.',
  },
  {
    question: 'How can I track my order?',
    answer:
      'Once your order ships, you will receive an email with a tracking number and a link to our carrier partner\'s tracking page. You can also view real-time order status by logging into your Pyra Wood account and visiting the Orders section.',
  },
  {
    question: 'What if my furniture arrives damaged?',
    answer:
      'We take great care in packaging every piece, but if damage occurs during transit, please contact us within 48 hours of delivery with photographs of the damage. We will arrange a replacement or repair at no additional cost. Do not discard the original packaging until the claim is resolved.',
  },
];

export default function ShippingPage() {
  return (
    <>
      <FaqJsonLd questions={FAQ_ITEMS} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-pyra-sand/50 to-transparent py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-pyra-gold">
              Delivery Details
            </p>
            <h1 className="mt-2 font-heading text-4xl font-bold text-pyra-walnut sm:text-5xl">
              Shipping Information
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Every Pyra Wood piece is carefully packaged and shipped with the same attention to
              detail that goes into its construction. Here is everything you need to know about
              our shipping and delivery process.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SHIPPING_HIGHLIGHTS.map((item) => (
              <Card
                key={item.title}
                className="border-pyra-sand bg-pyra-cream/30 text-center"
              >
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-pyra-forest/10">
                    <item.icon className="size-6 text-pyra-forest" />
                  </div>
                  <h2 className="font-heading text-lg font-semibold text-pyra-walnut">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
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
                Domestic Shipping Rates
              </h2>
              <div className="mt-4 overflow-hidden rounded-lg border border-pyra-sand">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-pyra-sand/50">
                      <th className="px-4 py-3 text-left font-semibold text-pyra-walnut">
                        Order Value
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-pyra-walnut">
                        Standard Shipping
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-pyra-walnut">
                        White-Glove
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-pyra-sand">
                      <td className="px-4 py-3 text-pyra-charcoal">Under $500</td>
                      <td className="px-4 py-3 text-pyra-charcoal">$50 flat rate</td>
                      <td className="px-4 py-3 text-pyra-charcoal">$150</td>
                    </tr>
                    <tr className="border-t border-pyra-sand">
                      <td className="px-4 py-3 text-pyra-charcoal">$500 and above</td>
                      <td className="px-4 py-3 font-medium text-pyra-forest">Free</td>
                      <td className="px-4 py-3 text-pyra-charcoal">$150</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-pyra-walnut">
                Delivery Timeframes
              </h2>
              <p className="mt-3 leading-relaxed text-pyra-charcoal/80">
                Pyra Wood furniture is handcrafted to order rather than pulled from warehouse stock.
                This ensures that every piece meets our quality standards and arrives in pristine condition.
                Standard orders are completed and shipped within 7 to 14 business days of order confirmation.
                During peak seasons such as the holiday period, lead times may extend by an additional 3 to 5 business days.
              </p>
              <p className="mt-3 leading-relaxed text-pyra-charcoal/80">
                Custom and made-to-measure orders require 6 to 10 weeks for production. You will receive a
                detailed production timeline within 48 hours of placing a custom order.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-pyra-walnut">
                White-Glove Delivery Service
              </h2>
              <p className="mt-3 leading-relaxed text-pyra-charcoal/80">
                Our white-glove delivery option provides a premium experience. The service includes
                a pre-scheduled delivery window, careful in-home placement of each piece in your
                room of choice, full assembly where applicable, and removal of all packaging materials.
                The delivery team will also perform a final inspection with you to confirm the
                furniture is in perfect condition.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-pyra-walnut">
                International Shipping
              </h2>
              <p className="mt-3 leading-relaxed text-pyra-charcoal/80">
                Pyra Wood ships internationally to Canada, the United Kingdom, Australia, and select
                European Union countries including Germany, France, the Netherlands, and Sweden.
                International shipping rates are calculated at checkout based on the destination,
                package dimensions, and weight. Please note that duties, customs fees, and import
                taxes are assessed by the destination country and are the responsibility of the recipient.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-pyra-walnut">
                Order Tracking
              </h2>
              <p className="mt-3 leading-relaxed text-pyra-charcoal/80">
                Every order includes complimentary tracking. Once your furniture ships, you will
                receive an email notification containing a tracking number and a direct link to the
                carrier tracking page. Real-time order status is also available in the Orders section
                of your Pyra Wood account. If you have any questions about your shipment, our
                customer service team is available Monday through Friday, 9:00 AM to 6:00 PM Pacific Time.
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
              Shipping FAQ
            </h2>
          </div>
          <ShippingFaq items={FAQ_ITEMS} />
        </div>
      </section>
    </>
  );
}
