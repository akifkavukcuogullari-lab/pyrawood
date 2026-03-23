'use client';

import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { User, LogIn } from 'lucide-react';
import { BRAND, PYRA_WOOD_CATEGORIES } from '@/lib/constants';

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  // Placeholder - will be connected to auth store by F2
  const isLoggedIn = false;

  const handleLinkClick = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 overflow-y-auto p-0">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="font-heading text-xl font-bold text-pyra-walnut">
            {BRAND.name}
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col px-4 py-4">
          <Link
            href="/products"
            onClick={handleLinkClick}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-pyra-sand hover:text-pyra-walnut"
          >
            Shop All
          </Link>

          <Accordion>
            <AccordionItem value="categories" className="border-b-0">
              <AccordionTrigger className="px-3 py-2.5 text-sm font-medium hover:no-underline hover:bg-pyra-sand rounded-lg">
                Categories
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="flex flex-col gap-0.5 pl-4">
                  {PYRA_WOOD_CATEGORIES.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/categories/${category.slug}`}
                      onClick={handleLinkClick}
                      className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-pyra-sand hover:text-pyra-walnut"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Link
            href="/about"
            onClick={handleLinkClick}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-pyra-sand hover:text-pyra-walnut"
          >
            About
          </Link>

          <Link
            href="/contact"
            onClick={handleLinkClick}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-pyra-sand hover:text-pyra-walnut"
          >
            Contact
          </Link>
        </nav>

        <Separator />

        <div className="flex flex-col gap-2 px-6 py-4">
          {isLoggedIn ? (
            <>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                render={<Link href="/profile" onClick={handleLinkClick} />}
              >
                <User className="size-4" />
                My Profile
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                render={<Link href="/orders" onClick={handleLinkClick} />}
              >
                Orders
              </Button>
            </>
          ) : (
            <>
              <Button
                className="w-full gap-2 bg-pyra-forest text-white hover:bg-pyra-forest/90"
                render={<Link href="/login" onClick={handleLinkClick} />}
              >
                <LogIn className="size-4" />
                Login
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2"
                render={<Link href="/register" onClick={handleLinkClick} />}
              >
                <User className="size-4" />
                Register
              </Button>
            </>
          )}
        </div>

        <div className="mt-auto px-6 py-4">
          <p className="text-xs text-muted-foreground">{BRAND.tagline}</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
