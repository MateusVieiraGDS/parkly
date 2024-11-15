import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const items = [
    { value: "name", label: "Nome" },
    { value: "created_at", label: "Data de criação" },
    { value: "category", label: "Categoria" },
    { value: "status", label: "Status" },
    { value: "district", label: "Bairro" },
];

export const SortBy = () => {
    const [sortBy, setSortBy] = React.useState("name");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center ">
                    <p className="text-sm">
                        Ordenar por:
                    </p>
                    <Button variant="ghost" size="sm" className="text-primary font-semibold">
                        {items.find(item => item.value === sortBy)?.label }
                        <ChevronDown className="size-4 ml-1" />
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Ordenar</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                    value={sortBy}
                    onValueChange={setSortBy}
                >
                    {items.map((item) => (
                        <DropdownMenuRadioItem
                            key={item.value}
                            value={item.value}
                            /* onClick={() => alert(item.value)} */
                        >
                            {item.label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
