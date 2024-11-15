import { usePage } from "@inertiajs/react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { PaginationTable } from "./pagination";

type LinksProps = {
    url: string;
    label: string;
    active: boolean;
};
type CampaignsProps = {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
    links: LinksProps[];
    meta: {
        links: LinksProps[];
    };
    data: [];
};

export const MembersTable = () => {
    /* const users = usePage().props.users as UserProps; */
    const campaigns = usePage().props.campaigns as CampaignsProps;

    return (
        <div className="flex flex-col w-full h-full bg-white shadow">
            <div className="w-full h-full">
                <DataTable columns={columns} data={[]} />
            </div>
            {/* <div className="p-4 w-full bg-slate-50 overflow-x-auto">
                <PaginationTable links={campaigns.meta.links} />
            </div> */}
        </div>
    );
};
