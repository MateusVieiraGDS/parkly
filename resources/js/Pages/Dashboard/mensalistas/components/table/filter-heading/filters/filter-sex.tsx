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

export const FilterSex = ({ filters, setFilters }: Props) => {
    const handleOnChange = (value: string | undefined) => {
        setFilters({
            ...filters,
            sex: value,
        });
    };

    return (
        <div>
            <Select onValueChange={handleOnChange} defaultValue={filters.sex}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sexo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="0">Todos os sexos</SelectItem>
                        <SelectItem value="2">Feminino</SelectItem>
                        <SelectItem value="1">Masculino</SelectItem>
                        <SelectItem value="3">LGBTQI+</SelectItem>
                        <SelectItem value="4">Não informado</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};
