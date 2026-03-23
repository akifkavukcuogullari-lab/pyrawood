'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ChevronLeft,
  Menu,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Users', icon: Users },
];

function NavLinks({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-pyra-gold/15 text-pyra-gold'
                : 'text-pyra-cream/70 hover:bg-pyra-cream/10 hover:text-pyra-cream'
            )}
          >
            <Icon className="size-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-40 lg:hidden text-foreground"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="size-5" />
      </Button>

      {/* Mobile sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 bg-pyra-walnut p-0 border-r-0">
          <SheetHeader className="px-4 pt-5 pb-4">
            <SheetTitle className="font-playfair text-lg text-pyra-cream">
              Pyra Wood Admin
            </SheetTitle>
          </SheetHeader>
          <NavLinks collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-pyra-walnut border-r border-pyra-walnut/20 transition-all duration-300',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        <div className="flex items-center justify-between px-4 py-5">
          {!collapsed && (
            <h2 className="font-playfair text-lg font-semibold text-pyra-cream">
              Pyra Wood
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-pyra-cream/70 hover:text-pyra-cream hover:bg-pyra-cream/10 ml-auto"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft
              className={cn(
                'size-4 transition-transform',
                collapsed && 'rotate-180'
              )}
            />
          </Button>
        </div>
        <NavLinks collapsed={collapsed} />
      </aside>
    </>
  );
}
