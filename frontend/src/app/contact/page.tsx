import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { FaqJsonLd } from '@/components/seo/FaqJsonLd';
import { ContactForm } from './ContactForm';
import { ContactFaq } from './ContactFaq';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Pyra Wood. Reach our team by email at hello@pyrawood.com, by phone, or visit our Portland showroom. We are here to help with orders, custom requests, and general inquiries.',
  openGraph: {
    title: 'Contact Us | Pyra Wood',
    description:
      'Reach the Pyra Wood team for orders, custom furniture requests, and general inquiries.',
    siteName: 'Pyra Wood',
    type: 'website',
  },
  alternates: { canonical: '/contact' },
};

const CONTACT_INFO = [
  {
    icon: Mail,
    title: 'Email',
    detail: 'hello@pyrawood.com',
    description: 'We respond to all emails within 24 business hours.',
  },
  {
    icon: Phone,
    title: 'Phone',
    detail: '+1 (555) 797-2966',
    description: 'Monday through Friday, 9:00 AM - 6:00 PM PT.',
  },
  {
    icon: MapPin,
    title: 'Showroom & Workshop',
    detail: '142 Timber Lane, Portland, OR 97201',
    description: 'Visits by appointment. Schedule online or by phone.',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    detail: 'Mon - Fri: 9:00 AM - 6:00 PM PT',
    description: 'Saturday showroom hours: 10:00 AM - 4:00 PM PT.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'How quickly will I hear back after contacting you?',
    answer:
      'We aim to respond to all email inquiries within 24 business hours. Phone calls are answered during business hours, Monday through Friday, 9:00 AM to 6:00 PM Pacific Time. If you reach voicemail, we will return your call within one business day.',
  },
  {
    question: 'Can I visit the Pyra Wood showroom?',
    answer:
      'Yes, our Portland showroom and workshop are open for visits by appointment. You can schedule a visit online through our contact form or by calling us directly. Walk-ins are welcome on Saturdays between 10:00 AM and 4:00 PM Pacific Time.',
  },
  {
    question: 'How do I inquire about a custom furniture piece?',
    answer:
      'Use the contact form on this page and select "Custom Order" as the subject, or email us at custom@pyrawood.com with details about the piece you have in mind, including approximate dimensions, preferred wood species, and any reference images. Our design team will follow up with a consultation.',
  },
  {
    question: 'Do you offer trade or designer discounts?',
    answer:
      'Yes, we offer a trade program for interior designers, architects, and commercial buyers. Please contact us at trade@pyrawood.com with your business credentials to learn about pricing and benefits.',
  },
];

export default function ContactPage() {
  return (
    <>
      <FaqJsonLd questions={FAQ_ITEMS} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-pyra-sand/50 to-transparent py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-pyra-gold">
              Get in Touch
            </p>
            <h1 className="mt-2 font-heading text-4xl font-bold text-pyra-walnut sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Whether you have a question about an order, want to discuss a custom piece, or simply
              want to learn more about our craft, we would love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CONTACT_INFO.map((item) => (
              <Card
                key={item.title}
                className="border-pyra-sand bg-pyra-cream/30"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-pyra-forest/10">
                    <item.icon className="size-5 text-pyra-forest" />
                  </div>
                  <h2 className="font-heading text-base font-semibold text-pyra-walnut">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-pyra-charcoal">{item.detail}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-pyra-walnut">
                Send Us a Message
              </h2>
              <p className="mt-2 text-muted-foreground">
                Fill out the form below and a member of our team will get back to you within 24
                business hours.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            {/* Map Placeholder */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-pyra-walnut">
                Visit Our Showroom
              </h2>
              <p className="mt-2 text-muted-foreground">
                See and feel our furniture in person at our Portland showroom and workshop.
              </p>
              <div className="mt-8 aspect-[4/3] overflow-hidden rounded-xl border border-pyra-sand bg-pyra-sand/30">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <MapPin className="mx-auto size-12 text-pyra-walnut/30" />
                    <p className="mt-3 font-heading text-lg font-semibold text-pyra-walnut">
                      142 Timber Lane
                    </p>
                    <p className="text-sm text-muted-foreground">Portland, OR 97201</p>
                    <p className="mt-4 text-xs text-muted-foreground">
                      Showroom visits by appointment.<br />
                      Walk-ins welcome on Saturdays, 10 AM - 4 PM PT.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              Contact FAQ
            </h2>
          </div>
          <ContactFaq items={FAQ_ITEMS} />
        </div>
      </section>
    </>
  );
}
