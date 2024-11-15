import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Filter, } from "lucide-react";
import { useState } from "react";
import { FilterCity } from "./filter-city";
import { FilterState } from "./filter-state";
import { FilterPosition } from "./filter-position";
import { usePage } from "@inertiajs/react";
import { FilterReceipt } from "./filter-receipt";
import { useMembers } from "@/Pages/Dashboard/mensalistas/use-mensalistas";

type FilterType = {
    city: string;
    state: string;
    position: string;
    receipt: string;
}

export const FilterDrawer = () => {

    const { permission } = usePage().props.auth as any;

    const { getMembers } = useMembers();
    const [filters, setFilters] = useState<FilterType>({
        city: "",
        state: "",
        position: "",
        receipt: "",
    });

    const handleFilters = () => {
        getMembers({
            params: {
                ...filters,
                page: 1,
            },
        });
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                    <Filter className="size-5" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                    <SheetDescription>
                        Configure os filtros para encontrar campanhas
                        específicas.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <FilterCity filters={filters} setFilters={setFilters} />
                    {permission != 'admin ' && <FilterState filters={filters} setFilters={setFilters} />}                    
                    <FilterPosition filters={filters} setFilters={setFilters} />
                    <FilterReceipt filters={filters} setFilters={setFilters} />
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button
                            variant="default"
                            onClick={() => handleFilters()}
                            className="w-full"
                        >
                            Aplicar
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};
