"use client";

import Link from "next/link";
import { UtensilsCrossed, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Daily Log", icon: UtensilsCrossed },
    { href: "/summary", label: "Summary", icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <UtensilsCrossed className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight">NutriJournal</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={cn(
                "text-sm font-medium",
                pathname === item.href
                  ? "text-primary hover:text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4 sm:hidden" />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.label.substring(0,1)}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
