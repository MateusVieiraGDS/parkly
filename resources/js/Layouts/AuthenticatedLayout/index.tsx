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
import { Header } from './components/header';
import { LeftMenu } from './components/left-menu';
import { dashboardMenu } from '@/constants/menus-list';

export default function AuthenticatedLayout({ children, showTitle = true }: PropsWithChildren<{header?: ReactNode, showTitle?: boolean }>) {

    const getTitle = () => {
      if(!showTitle) return <></>;

      let nowUrl: any = window.location.pathname;
      const menu = dashboardMenu.find((menu) => nowUrl == menu.href);
      return menu ? 
        <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">{menu.title}</h1>
        </div>
      : '';
    }

    return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <LeftMenu/>
        <div className="flex flex-col">
          <Header/>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6"> 
            {getTitle()}           
            <div
              className="flex flex-1 justify-center" x-chunk="dashboard-02-chunk-1"
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    );
}
