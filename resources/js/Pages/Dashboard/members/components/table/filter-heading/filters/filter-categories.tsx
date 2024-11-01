import { usePage } from "@inertiajs/react";
import { MultiSelect } from "@/components/multi-select";

type Props = {
    filters: any;
    setFilters: (value: any) => void;
};

export const FilterCategories = ({ filters, setFilters }: Props) => {
    const categories = (usePage().props.categories || []) as any[];
    return (
        <div>
            <MultiSelect
                options={
                    categories.map((category: any) => {
                        return {
                            value: category.id,
                            label: category.name,
                        };
                    }) || []
                }
                onValueChange={(items) => {
                    setFilters({
                        ...filters,
                        categories: items,
                    });
                }}
                defaultValue={filters.categories}
                placeholder="Selecione as categorias"
                animation={0}
                variant="secondary"
            />
        </div>
    );
};
