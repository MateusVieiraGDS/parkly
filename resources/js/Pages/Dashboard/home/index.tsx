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
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"

const DashboardHome = ({}) => {
  return (
    <>        
        <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
            You have no products
            </h3>
            <p className="text-sm text-muted-foreground">
            You can start selling as soon as you add a product.
            </p>
            <Button className="mt-4">Add Product</Button>
        </div>
    </>
  )
}


DashboardHome.layout = (page: any) => <AuthenticatedLayout children={page} showTitle={true}/>;

export default DashboardHome;