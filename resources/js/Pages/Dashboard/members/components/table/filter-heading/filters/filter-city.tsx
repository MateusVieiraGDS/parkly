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
import { Info, Loader2, MessageCircleWarning, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import ReactSelect from "react-select";

type Props = {
    filters: any;
    setFilters: (value: any) => void;
}

export const FilterCity = ({ filters, setFilters }: Props) => {
    const handleOnChange = (value: string | undefined) => {
        setFilters({
            ...filters,
            city: value,
        });
    };
    
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [cities, setCities] = useState([]);

    const getCity = async (value: string) => {
        setIsLoading(true);
        setSearch(value);
        const cities = await axios.get(`/select/cities?search=${value}`);
        setCities(cities.data);
        setIsLoading(false);
    };
    const [debounced] = useDebounceValue(search, 800);

    useEffect(() => {
        if (debounced !== undefined && debounced) {
            getCity(debounced);
        }
    }, [debounced]);

    return (
        <ReactSelect
                noOptionsMessage={() => {
                    return (
                        <div className="flex flex-col gap2 items-center justify-center">
                            {isLoading ? 
                                <>
                                    <Loader2 className="animate-spin h-6 w-6" />
                                    <span>Buscando Cidade</span> 
                                </> 
                            : 
                            <>
                                {search != "" ? 
                                    <>
                                        <Info className="h-6 w-6" />
                                        <span>Nenhuma cidade encontrada</span>
                                    </> 
                                : 
                                    <>
                                        <Search className="h-6 w-6" />
                                        <span>Digite o nome da cidade</span>
                                    </>
                                }
                            </>
                            }
                            
                        </div>
                    )
                }}
                placeholder="Filtrar pela cidade"
                /* isDisabled={disabled} */
                isLoading={false}
                isClearable={false}
                isSearchable={true}
                isMulti={true}
                name="district_id"
                options={
                    cities.map((city: City, index) => {
                        return {
                            value: index,
                            label: `${city.name} - ${city.state_id}`,
                        }
                    }) || []
                }
                inputValue={search}
                defaultValue={
                    filters.city != "" ? filters.city.split(',').map((city: any, index: any) => {
                        return {
                            value: index,
                            label: `${city}`,
                        }
                    }) :  []
                }
                onInputChange={(option: any) => {
                    setSearch(option)
                }}
                onChange={(option: any) => {
                    let value = "";
                    if (option) {
                        value = option.map((item: any) => item.label.split(' - ')[0].trim()).join(",");
                    }
                    handleOnChange(value);
                }}
            />
    );
};
