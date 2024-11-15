import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { MembersTable } from "./components/table";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

const MembersPage = ({}) => {
    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Membros</h1>
                <Link href={route("dashboard.membros.create")}>
                    <Button>Novo Membro</Button>
                </Link>
            </div>
            <MembersTable />
        </div>
    )

}

MembersPage.layout = (page: any) => <AuthenticatedLayout children={page} showTitle={false}/>;

export default MembersPage;