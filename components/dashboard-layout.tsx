"use client";

import { useState } from "react";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Newspaper,
  Image,
  SlidersHorizontal,
  Package,
  ShoppingCart,
  LogOut,
  Menu,
  Tags,
  ChevronDown,
  ChevronRight,
  Tag,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarNav,
  SidebarNavItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { authService } from "@/features/auth/services/authService";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    title: "დეშბორდი",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "მომხმარებლები",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "პროდუქტები",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "შეკვეთები",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "სიახლეები",
    href: "/dashboard/news",
    icon: Newspaper,
  },
  {
    title: "რეკლამები",
    href: "/dashboard/ads",
    icon: Image,
  },
  {
    title: "ბანერ-სლაიდერი",
    href: "/dashboard/banner-slider",
    icon: SlidersHorizontal,
  },
  {
    title: "სეთინგები",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface NavContentProps {
  pathname: string;
  onMobileMenuClose: () => void;
  onLogout: () => void;
  isLoggingOut?: boolean;
}

function NavContent({
  pathname,
  onMobileMenuClose,
  onLogout,
  isLoggingOut = false,
}: NavContentProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const isCategoriesActive = pathname?.startsWith("/dashboard/categories");

  // Auto-expand categories menu if on a categories page
  React.useEffect(() => {
    if (isCategoriesActive) {
      setIsCategoriesOpen(true);
    }
  }, [isCategoriesActive]);

  return (
    <>
      <SidebarHeader>
        <h1 className="text-xl font-bold">Dewalt Admin</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <SidebarNavItem
                key={item.href}
                href={item.href}
                active={isActive}
                asChild
              >
                <Link href={item.href} onClick={onMobileMenuClose}>
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </SidebarNavItem>
            );
          })}

          {/* Categories Collapsible Menu */}
          <div className="space-y-1">
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isCategoriesActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Tags className="h-4 w-4" />
              <span className="flex-1 text-left">კატეგორიები</span>
              {isCategoriesOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {isCategoriesOpen && (
              <div className="ml-7 space-y-1 border-l pl-2">
                <SidebarNavItem
                  href="/dashboard/categories/brands"
                  active={pathname === "/dashboard/categories/brands"}
                  asChild
                >
                  <Link
                    href="/dashboard/categories/brands"
                    onClick={onMobileMenuClose}
                  >
                    <Tag className="h-3.5 w-3.5" />
                    ბრენდები
                  </Link>
                </SidebarNavItem>
                <SidebarNavItem
                  href="/dashboard/categories/categories"
                  active={pathname === "/dashboard/categories/categories"}
                  asChild
                >
                  <Link
                    href="/dashboard/categories/categories"
                    onClick={onMobileMenuClose}
                  >
                    <Tag className="h-3.5 w-3.5" />
                    კატეგორიები
                  </Link>
                </SidebarNavItem>
                <SidebarNavItem
                  href="/dashboard/categories/child-categories"
                  active={pathname === "/dashboard/categories/child-categories"}
                  asChild
                >
                  <Link
                    href="/dashboard/categories/child-categories"
                    onClick={onMobileMenuClose}
                  >
                    <Tag className="h-3.5 w-3.5" />
                    ქვე-კატეგორიები
                  </Link>
                </SidebarNavItem>
              </div>
            )}
          </div>
        </SidebarNav>
      </SidebarContent>
      <SidebarFooter>
        <div className="space-y-2">
          {user && (
            <div className="px-3 py-2 text-sm">
              <p className="font-medium">{user.name || user.email}</p>
              {user.email && user.name && (
                <p className="text-xs text-muted-foreground">{user.email}</p>
              )}
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full cursor-pointer justify-start"
            onClick={onLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? "გამოსვლა მიმდინარეობს..." : "გამოსვლა"}
          </Button>
        </div>
      </SidebarFooter>
    </>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setMobileMenuOpen(false);

      await authService.logout.post({});

      await signOut({ redirect: true, callbackUrl: "/login" });
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <Sidebar>
        <NavContent
          pathname={pathname}
          onMobileMenuClose={handleMobileMenuClose}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
      </Sidebar>

      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-4 z-40 lg:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">მენიუს გადართვა</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
            <NavContent
              pathname={pathname}
              onMobileMenuClose={handleMobileMenuClose}
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            />
          </div>
        </SheetContent>
      </Sheet>

      <main className="flex-1 overflow-y-auto bg-background lg:ml-0">
        {/* Mobile Header */}
        <div className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4 lg:hidden">
          <h1 className="text-lg font-bold">Dewalt Admin</h1>
        </div>
        <div className="container mx-auto py-4 px-4 sm:py-6">{children}</div>
      </main>
    </div>
  );
}
