import { useState, PropsWithChildren, ReactNode } from 'react';
import {
    Bell,
    Car,
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
  import { Link, usePage } from "@inertiajs/react"
import { User } from '@/types';
import { dashboardMenu } from '@/constants/menus-list';

/* 


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
*/
export const Header = ({}) =>{

    const {auth} = usePage().props as any;

    const isActivePage = (href: string) => {
        return window.location.pathname == href;
    };
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Car className="h-6 w-6" />
                  <span className="ml-2 text-2xl font-bold">Parkly</span>
                </Link>
                {dashboardMenu.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
                            mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground
                            ${isActivePage(item.href) && "bg-muted text-primary"}
                        `}
                    >
                        <item.icon/>
                        {item.title}
                    </Link>
                ))}                
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">            
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <span className='capitalize'>{auth?.user?.name}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile">
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/logout" method="post" as="button">
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
    )
}