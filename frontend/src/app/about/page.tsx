import type { Metadata } from 'next';
import Image from 'next/image';
import { TreePine, Hammer, Truck, Award, Leaf, Recycle, Shield, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd';
import { FaqJsonLd } from '@/components/seo/FaqJsonLd';
import { AboutFaq } from './AboutFaq';

export const metadata: Metadata = {
  title: 'About Pyra Wood',
  description:
    'Discover the story behind Pyra Wood — artisan wood furniture crafted with sustainably sourced timber and decades of woodworking expertise. Learn about our commitment to quality, sustainability, and timeless design.',
  openGraph: {
    title: 'About Pyra Wood | Artisan Wood Furniture',
    description:
      'Discover the story behind Pyra Wood — artisan wood furniture crafted with sustainably sourced timber and decades of woodworking expertise.',
    siteName: 'Pyra Wood',
    type: 'website',
  },
  alternates: { canonical: '/about' },
};

const PROCESS_STEPS = [
  {
    icon: TreePine,
    title: 'Source',
    description:
      'Every piece begins with responsibly harvested timber from certified sustainable forests. We work directly with forestry cooperatives to ensure traceability from stump to workshop.',
  },
  {
    icon: Hammer,
    title: 'Design',
    description:
      'Our in-house designers blend traditional joinery techniques with contemporary aesthetics. Each design is prototyped, tested, and refined before it enters production.',
  },
  {
    icon: Award,
    title: 'Craft',
    description:
      'Master artisans with an average of 18 years of experience shape, join, and finish every piece by hand. We use time-tested mortise-and-tenon joints, hand-rubbed oil finishes, and zero-VOC sealants.',
  },
  {
    icon: Truck,
    title: 'Deliver',
    description:
      'Each item is inspected, padded with recycled packaging, and shipped with our white-glove delivery service. We handle placement and packaging removal so your new furniture is ready to enjoy.',
  },
];

const VALUES = [
  {
    icon: Leaf,
    title: 'Sustainability',
    description:
      'We source exclusively from FSC-certified forests and use water-based finishes with zero volatile organic compounds. Offcuts are repurposed into smaller decor items, achieving near-zero workshop waste.',
  },
  {
    icon: Shield,
    title: 'Quality',
    description:
      'Every joint is stress-tested, every surface is hand-inspected, and every piece is backed by our lifetime structural warranty. We build furniture that can be passed down through generations.',
  },
  {
    icon: Hammer,
    title: 'Craftsmanship',
    description:
      'We employ traditional woodworking techniques — dovetail joints, hand-planed surfaces, and slow-cured finishes — that machines simply cannot replicate. The result is furniture with character and soul.',
  },
  {
    icon: Heart,
    title: 'Community',
    description:
      'Pyra Wood employs local artisans and invests in apprenticeship programs to preserve the craft of woodworking. Every purchase supports living-wage jobs and skills training in our Portland community.',
  },
  {
    icon: Recycle,
    title: 'Circular Design',
    description:
      'Our furniture is designed for longevity and repair, not disposal. We offer a refinishing service for any Pyra Wood piece, no matter its age, and accept trade-ins for store credit.',
  },
  {
    icon: Award,
    title: 'Transparency',
    description:
      'We publish the species, origin, and finish details for every product. You always know exactly what your furniture is made from, where the wood was grown, and how it was treated.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'What types of wood does Pyra Wood use?',
    answer:
      'We work primarily with North American hardwoods including white oak, black walnut, hard maple, and cherry. For outdoor pieces we use sustainably harvested teak and white cedar. Every species is chosen for its structural integrity, grain character, and long-term durability.',
  },
  {
    question: 'How is Pyra Wood furniture sourced and manufactured?',
    answer:
      'All timber comes from FSC-certified forests managed under strict replanting and biodiversity standards. Logs are milled at partner sawmills within 200 miles of our Portland workshop, kiln-dried to the correct moisture content, and then shaped and assembled entirely by hand in our facility.',
  },
  {
    question: 'What finishes do you use, and are they safe?',
    answer:
      'We use water-based polyurethane and hand-rubbed natural oil finishes that contain zero volatile organic compounds (VOCs). All finishes are food-safe once cured, making our dining tables and kitchen items completely safe for everyday use.',
  },
  {
    question: 'Does Pyra Wood offer a warranty?',
    answer:
      'Yes. Every piece of Pyra Wood furniture comes with a lifetime structural warranty covering joints, frames, and load-bearing components. Surface finishes are warranted for 5 years under normal household use. Custom orders carry the same warranty terms.',
  },
  {
    question: 'Can I order custom or made-to-measure furniture?',
    answer:
      'Absolutely. Our design team works with clients on custom dimensions, wood species, finish colors, and hardware choices. Custom orders typically require 6 to 10 weeks for production, and a 50% deposit is required to begin work.',
  },
  {
    question: 'How does Pyra Wood minimize its environmental impact?',
    answer:
      'Beyond sourcing from certified forests, we power our workshop with renewable energy, use recycled and recyclable packaging, and repurpose wood offcuts into smaller decor items. We offset shipping emissions through verified carbon credit programs and maintain a near-zero waste policy in production.',
  },
];

export default function AboutPage() {
  return (
    <>
      <OrganizationJsonLd />
      <FaqJsonLd questions={FAQ_ITEMS} />

      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center overflow-hidden bg-gradient-to-br from-pyra-walnut via-pyra-walnut/95 to-pyra-walnut/80">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/images/wood-texture.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-pyra-walnut/90 via-pyra-walnut/60 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-pyra-gold">
            Our Story
          </p>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight text-pyra-cream sm:text-5xl md:text-6xl">
            Crafted with Purpose, Built for Generations
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-pyra-cream/80">
            Since our founding, Pyra Wood has been dedicated to preserving the art of handcrafted furniture
            while embracing sustainable forestry and responsible manufacturing.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src="/images/workshop.jpg"
                  alt="Inside the Pyra Wood workshop where artisan furniture is handcrafted"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 rounded-xl bg-pyra-forest p-6 text-white shadow-xl sm:p-8">
                <p className="font-heading text-3xl font-bold">25+</p>
                <p className="text-sm text-white/80">Years of Craftsmanship</p>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-pyra-gold">
                The Beginning
              </p>
              <h2 className="font-heading text-3xl font-bold text-pyra-walnut sm:text-4xl">
                A Passion Born in the Workshop
              </h2>
              <p className="text-lg leading-relaxed text-pyra-charcoal/80">
                Pyra Wood was founded by a small group of woodworkers who believed that mass-produced furniture
                had lost something essential: character. Working out of a converted barn in Portland, Oregon,
                they set out to prove that thoughtfully made furniture could be both beautiful and accessible.
              </p>
              <p className="text-lg leading-relaxed text-pyra-charcoal/80">
                Over more than two decades, that workshop has grown into a full-scale atelier employing
                over 40 skilled artisans. The philosophy remains the same: select the finest sustainably
                sourced timber, honor the natural grain, and build each piece with joinery techniques that
                have stood the test of centuries.
              </p>
              <p className="text-lg leading-relaxed text-pyra-charcoal/80">
                Today, Pyra Wood serves customers across the United States who value authenticity, durability,
                and the irreplaceable warmth of real wood in their homes. Every piece that leaves our workshop
                carries the signature of the artisan who built it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-7xl" />

      {/* Mission & Values */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-pyra-gold">
              What We Stand For
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-pyra-walnut sm:text-4xl">
              Our Values
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Every decision we make is guided by a commitment to quality materials,
              responsible sourcing, and the well-being of the craftspeople who bring our designs to life.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((value) => (
              <Card
                key={value.title}
                className="border-pyra-sand bg-pyra-cream/30 transition-shadow hover:shadow-md"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-pyra-forest/10">
                    <value.icon className="size-6 text-pyra-forest" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-pyra-walnut">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process: From Forest to Home */}
      <section className="bg-pyra-sand/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-pyra-gold">
              Our Process
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-pyra-walnut sm:text-4xl">
              From Forest to Home
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Every Pyra Wood piece follows a carefully controlled journey from sustainably managed
              forests to your living space, with quality checks at every stage.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.title} className="relative text-center">
                {index < PROCESS_STEPS.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-px w-full translate-x-1/2 bg-pyra-gold/30 lg:block" />
                )}
                <div className="relative mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-pyra-forest text-white shadow-lg">
                  <step.icon className="size-7" />
                  <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-pyra-gold text-xs font-bold text-white">
                    {index + 1}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-pyra-walnut">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop Imagery */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-pyra-gold">
              Behind the Scenes
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-pyra-walnut sm:text-4xl">
              Our Workshop
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { src: '/images/workshop-detail-1.jpg', alt: 'Artisan hand-planing a walnut board in the Pyra Wood workshop' },
              { src: '/images/workshop-detail-2.jpg', alt: 'Close-up of dovetail joinery on a Pyra Wood drawer' },
              { src: '/images/workshop-detail-3.jpg', alt: 'Finished dining table receiving its final oil finish' },
            ].map((img) => (
              <div key={img.src} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-pyra-sand bg-pyra-cream/50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-pyra-gold">
              Common Questions
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-pyra-walnut sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>
          <AboutFaq items={FAQ_ITEMS} />
        </div>
      </section>
    </>
  );
}
