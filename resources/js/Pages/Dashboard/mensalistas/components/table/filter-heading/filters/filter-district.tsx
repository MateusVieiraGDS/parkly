import { usePage } from "@inertiajs/react";
import Select from "react-select";
import qs from "query-string";

type Props = {
    filters: any;
    setFilters: (value: any) => void;
};

export const FilterDistrict = ({ filters, setFilters }: Props) => {
    const districts = usePage().props.districts as [];

    const handleOnChange = (items: any | null) => {
        // como extrair apenas o value?
        const ids: any = [];
        const districts = items?.forEach((item: any) => {
            ids.push([item.value]);
        });

        setFilters({
            ...filters,
            districts: Object.values(ids).toString(),
        });
    };

    const getDistrictNameForID = (id: string) => {
        const district = districts.find((item: any) => {
            return item.id === parseInt(id);
        }) as any;
        return district?.name || "";
    };

    const getRouteDistricts = () => {
        const query = qs.parse(window.location.search);
        if (query.districts) {
            const districtsRoutes = query.districts as string;
            const ids = districtsRoutes.split(",");
            const list = ids.map((id) => {
                return {
                    value: id,
                    label: getDistrictNameForID(id),
                } as any;
            });
            return list;
        }

        return [];
    };

    return (
        <div>
            <Select
                onChange={(items) => {
                    handleOnChange(items);
                }}
                placeholder="Selecione os bairros"
                defaultValue={getRouteDistricts}
                isLoading={false}
                isMulti
                isSearchable={true}
                options={districts.map((item: any) => {
                    return {
                        value: item.id,
                        label: item.name,
                    } as any;
                })}
            />
        </div>
    );
};
