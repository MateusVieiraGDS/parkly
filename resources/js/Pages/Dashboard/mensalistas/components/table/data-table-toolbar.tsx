import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "./data-table-view-options";
import { X } from "lucide-react";
import { Link } from "@inertiajs/react";
import { SearchInput } from "./filter-heading/search-input";
import { Filters } from "./filter-heading/filters";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function DataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = () => {
        const query = { ...route().params };

        if (query?.search) {
            return true;
        }

        return false;
    };

    return (
        <div className="flex item-center justify-between py-8 px-4  bg-slate-50/50 border">
            <div className="flex justify-between item-center w-full gap-1">
                <SearchInput />
                {isFiltered() && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.resetColumnFilters()}
                                    asChild
                                >
                                    <Link href={route("usuarios.index")}>
                                        <X className="size-5" />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Limpar filtros de pesquisa</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
            <div className="flex items-center justify-end space-x-4 w-full">
                {/* <SortBy /> */}

                <DataTableViewOptions table={table} />
                <Filters />
            </div>
        </div>
    );
}
