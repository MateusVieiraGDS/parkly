import { Banknote, Car, Handshake, Home, LucideProps, Users } from "lucide-react";
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
        title: "Carros",
        href: "/dashboard/carros",
        icon: Car,
    },
    {
        title: "Mensalistas",
        href: "/dashboard/mensalistas",
        icon: Handshake,
    },
    {
        title: "Saída",
        href: "/dashboard/saidas",
        icon: Banknote,
    },
];
