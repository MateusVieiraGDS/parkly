import { Home, LucideProps, Users } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";


type DashboardMenuItemType = {
    title: string;
    href: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
};
export const dashboardMenu: DashboardMenuItemType[] = [
    {
        title: "Painel",
        href: "/dashboard",
        icon: Home,
    },
    {
        title: "Membros",
        href: "/dashboard/membros",
        icon: Users,
    },
];
