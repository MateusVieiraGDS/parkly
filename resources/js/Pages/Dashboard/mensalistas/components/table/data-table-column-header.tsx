// import {
//     ArrowDownIcon,
//     ArrowUpIcon,
//     CaretSortIcon,
//     EyeNoneIcon,
//   } from "@radix-ui/react-icons"

import { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownAZ, ArrowDownIcon, ArrowUpAZ, ArrowUpIcon, ArrowUpZA, ArrowUpZa, EyeOffIcon } from "lucide-react";
import { FaSort } from "react-icons/fa";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { useMembers } from "../../use-mensalistas";


interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    const { getMembers } = useMembers();
    const [initial, setInitial] = useState(false);
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>;
    }

    useEffect(() => {
        if (!initial) {
            return;
        }

        getMembers({
            params: {
                orderBy: column.id,
                sorted: column.getIsSorted(),
                page: 1,
            },
        });
    }, [column.getIsSorted()]);

    useEffect(() => {
        setInitial(true);
    }, []);

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 data-[state=open]:bg-accent w-full flex justify-between focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
                    >
                        <span>{title}</span>
                        {column.getIsSorted() === "desc" ? (
                            <ArrowDownIcon className="ml-2 h-4 w-4" />
                        ) : column.getIsSorted() === "asc" ? (
                            <ArrowUpIcon className="ml-2 h-4 w-4" />
                        ) : (
                            <FaSort className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuLabel className="text-xs p-2 font-bold uppercase text-muted-foreground">
                        Ordenar por:
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => column.toggleSorting(false)}
                    >
                        <ArrowDownAZ className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Crescente
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => column.toggleSorting(true)}
                    >
                        <ArrowUpZA className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Decrescente
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {/* <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOffIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Ocultar
            </DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
