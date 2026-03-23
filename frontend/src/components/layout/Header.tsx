'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  ChevronDown,
  LogOut,
  Package,
  Settings,
  UserCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Badge } from '@/components/ui/badge';
import { BRAND, PYRA_WOOD_CATEGORIES } from '@/lib/constants';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { MobileNav } from '@/components/layout/MobileNav';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount: cartItemCount, openDrawer: openCartDrawer } = useCart();
  const isLoggedIn = isAuthenticated;

  return (
    <>
      <motion.header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-background/95 shadow-sm backdrop-blur-md supports-backdrop-filter:bg-background/80'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile menu trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-xl font-bold tracking-tight text-pyra-walnut sm:text-2xl">
              {BRAND.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={<Link href="/products" />}
                    className="px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-pyra-walnut"
                  >
                    Shop
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium text-foreground transition-colors hover:text-pyra-walnut">
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[480px] grid-cols-2 gap-1 p-2">
                      {PYRA_WOOD_CATEGORIES.map((category) => (
                        <NavigationMenuLink
                          key={category.slug}
                          render={
                            <Link href={`/categories/${category.slug}`} />
                          }
                          className="flex flex-col gap-0.5 rounded-lg p-3 transition-colors hover:bg-pyra-sand"
                        >
                          <span className="text-sm font-medium text-pyra-walnut">
                            {category.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {category.description}
                          </span>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={<Link href="/about" />}
                    className="px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-pyra-walnut"
                  >
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={<Link href="/contact" />}
                    className="px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-pyra-walnut"
                  >
                    Contact
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-1">
            <ThemeToggle />

            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              render={<Link href="/search" />}
            >
              <Search className="size-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Cart"
              onClick={openCartDrawer}
            >
              <ShoppingBag className="size-5" />
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge className="flex size-5 items-center justify-center rounded-full bg-pyra-forest p-0 text-[10px] text-white">
                      {cartItemCount}
                    </Badge>
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon" aria-label="Account" />
                }
              >
                <User className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuItem>
                      <Link
                        href="/profile"
                        className="flex w-full items-center gap-2"
                      >
                        <UserCircle className="size-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href="/orders"
                        className="flex w-full items-center gap-2"
                      >
                        <Package className="size-4" />
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem>
                        <Link
                          href="/admin"
                          className="flex w-full items-center gap-2"
                        >
                          <Settings className="size-4" />
                          Admin
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <button
                        className="flex w-full items-center gap-2"
                        onClick={() => logout()}
                      >
                        <LogOut className="size-4" />
                        Logout
                      </button>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem>
                      <Link
                        href="/login"
                        className="flex w-full items-center gap-2"
                      >
                        <User className="size-4" />
                        Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href="/register"
                        className="flex w-full items-center gap-2"
                      >
                        <UserCircle className="size-4" />
                        Register
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>

      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
    </>
  );
}
