import { cn } from "@/lib/utils";
import { City, DistrictProps } from "@/types";
import { Link } from "@inertiajs/react";
import { BadgeCheck, Star, UserRound } from "lucide-react";

type ContactProps = {
    id: string;
    name: string;
    candidate_name: string;
    actived: boolean;
    verified: boolean;
};

type Row = {
    row: ContactProps;
};

export const CellName = ({ row }: Row) => {
    
    console.log(row);
    return (
        <div className="min-w-72">
            <p className="capitalize"><strong>Nome:</strong> {row.name ?? ' - - - - '}</p>
            <p className="capitalize"><strong>Urna:</strong> {row.candidate_name ?? ' - - - - '}</p>                   
        </div>
    );
};
