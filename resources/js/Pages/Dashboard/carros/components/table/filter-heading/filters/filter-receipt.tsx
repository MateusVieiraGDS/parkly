
import { MultiSelect } from "@/components/multi-select";

type Props = {
    filters: any;
    setFilters: (value: any) => void;
}

export const FilterReceipt = ({ filters, setFilters }: Props) => {
    const handleOnChange = (value: string | undefined) => {
        setFilters({
            ...filters,
            receipt: value,
        });
    };

    const receipts = [
        {
            value: "with",
            label: "Com Recibo",
        },
        {
            value: "without",
            label: "Sem Recibo",
        }
    ];


    const getDefaultStates = () => {
        return filters.receipt.split(",").filter((st: any) => st != "");        
    }

    return (
        <MultiSelect
            options={receipts}
            onValueChange={(items: any) => {
                handleOnChange(items.join(","));
            }}
            defaultValue={getDefaultStates()}
            placeholder="Filtre pela existência do recibo"
            animation={0}
            variant="secondary"
        />
    );
};
