import { useState, PropsWithChildren, ReactNode } from 'react';
import {
    Bell,
    CircleUser,
    Home,
    LineChart,
    Menu,
    Package,
    Package2,
    Search,
    ShoppingCart,
    Users,
  } from "lucide-react"
  
  import { Badge } from "@/components/ui/badge"
  import { Button } from "@/components/ui/button"
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Input } from "@/components/ui/input"
  import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
  import { Link } from "@inertiajs/react"
import { User } from '@/types';
import { LeftMenuHeader } from './left-menu-header';
import { dashboardMenu } from '@/constants/menus-list';
import { cn } from '@/lib/utils';

export const LeftMenu = ({}) => {

    const isActivePage = (href: string) => {
        return window.location.pathname.startsWith(href);
    };

    return (
        <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <LeftMenuHeader/>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {dashboardMenu.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                            isActivePage(item.href) && "bg-muted text-primary"
                        )}
                    >
                        <item.icon/>
                        {item.title}
                    </Link>
                ))}
            </nav>
          </div>
        </div>
      </div>
    )
}