import { usePeople } from "@/Pages/App/People/use-people";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Props = {
    filters: any;
    setFilters: (value: any) => void;
}

export const FilterLevel = ({ filters, setFilters }: Props) => {
    const handleOnChange = (value: string | undefined) => {
        setFilters({
            ...filters,
            level: value,
        });
    };

    return (
        <div>
            <Select onValueChange={handleOnChange} defaultValue={filters.level}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Nível de Engajamento" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="0">Todas as redes de engajamento</SelectItem>
                        <SelectItem value="1">Próximo</SelectItem>
                        <SelectItem value="2">Engajado</SelectItem>
                        <SelectItem value="3">Multiplicado</SelectItem>
                        <SelectItem value="4">Lista importada</SelectItem>
                        <SelectItem value="5">Leads</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};
