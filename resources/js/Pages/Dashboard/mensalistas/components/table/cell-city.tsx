import { City, DistrictProps } from "@/types";
import { Link } from "@inertiajs/react";

type ContactProps = {
    id: string;
    name: string;
    candidate_name: string;
    level: number;
    city: City;
    district: DistrictProps;
    amount_engaged: number;
    categories: any;
};

type Row = {
    row: ContactProps;
};

export const CellCity = ({ row }: Row) => {
    return (
        <strong>{row.city.name} - {row.city.state_id}</strong>
    );
};
