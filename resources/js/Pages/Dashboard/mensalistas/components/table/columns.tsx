import { ColumnDef } from "@tanstack/react-table";
import { Actions } from "./actions";
import { DataTableColumnHeader } from "./data-table-column-header";
import { CellName } from "./cell-name";
import { CellAvatar } from './cell-avatar';
import { CellCampaign } from "./cell-campaign";
import { CellCity } from "./cell-city";
import { CellPosition } from "./cell-position";
import { CellPessoas } from "./cell-pessoas";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type UserProps = {
    id: string;
    name: string;
    phone: string;
};

export const columns: ColumnDef<UserProps>[] = [
    {
        accessorKey: "photo",
        header: "Foto",
        meta: { title: "Foto" },        
        cell: ({ row }) => <CellAvatar row={row.original as any} />,
    },
    {
        accessorKey: "candidate_name",
        enableHiding: false,        
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nome" />
        ),
        cell: ({ row }) => <CellName row={row.original as any} />,
    },
    {
        accessorKey: "position",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Cargo"/>
        ),
        cell: ({ row }) => <CellPosition row={row.original as any} />,
    },
    {
        accessorKey: "city.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Cidade" />
        )
    },
    {
        accessorKey: "city.state_id", 
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Estado" />
        )
    },
    {
        accessorKey: "actions",
        header: "",
        cell: ({ row }) => <Actions row={row.original} />,
    },
];
