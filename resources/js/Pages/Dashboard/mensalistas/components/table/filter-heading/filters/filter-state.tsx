import { usePeople } from "@/Pages/App/People/use-people";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { City } from "@/types";
import axios from "axios";
import { Info, Loader2, MessageCircleWarning } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import ReactSelect from "react-select";
import { MultiSelect } from "@/components/multi-select";
import { router, usePage } from "@inertiajs/react";

type Props = {
    filters: any;
    setFilters: (value: any) => void;
}

export const FilterState = ({ filters, setFilters }: Props) => {
    const handleOnChange = (value: string | undefined) => {
        setFilters({
            ...filters,
            state: value,
        });
    };

    const { states } = usePage().props as any;

    useEffect(() => {
        if(!states || states.length == 0){
            router.visit(window.location.href, {
                only: ["states"],
                preserveScroll: true,
                preserveState: true,
            });
        }
    }, []);

    const getDefaultStates = () => {
        if(!states || states.length < 1) return [];        
        return filters.state.split(",").filter((st: any) => st != "");        
    }

    return (
        <MultiSelect
            options={
                states && states.length > 0
                    ? states.map((state: any) => {
                          return {
                              value: state.code,
                              label: state.name,
                          };
                      })
                    : []
            }
            onValueChange={(items: any) => {
                handleOnChange(items.join(","));
            }}
            defaultValue={getDefaultStates()}
            placeholder="Filtre pelo estado"
            animation={0}
            variant="secondary"
        />
    );
};
