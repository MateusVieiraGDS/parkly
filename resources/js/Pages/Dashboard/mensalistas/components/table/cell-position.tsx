import { City, DistrictProps } from "@/types";
import { Link } from "@inertiajs/react";

type Row = {
    row: {
        position: string
    };
};

export const CellPosition = ({ row }: Row) => {
    return (
        <div className="font-medium capitalize">
            {row.position}                       
        </div>
    );
};
