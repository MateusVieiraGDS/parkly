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

export const FilterPosition = ({ filters, setFilters }: Props) => {
    const handleOnChange = (value: string | undefined) => {
        setFilters({
            ...filters,
            position: value,
        });
    };

    const positions = [
        {
            value: "prefeito",
            label: "Prefeito",
        },
        {
            value: "vereador",
            label: "Vereador",
        }
    ];


    const getDefaultStates = () => {
        return filters.position.split(",").filter((st: any) => st != "");        
    }

    return (
        <MultiSelect
            options={positions}
            onValueChange={(items: any) => {
                handleOnChange(items.join(","));
            }}
            defaultValue={getDefaultStates()}
            placeholder="Filtre pelo cargo"
            animation={0}
            variant="secondary"
        />
    );
};
