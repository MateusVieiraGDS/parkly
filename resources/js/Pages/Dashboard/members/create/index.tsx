import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import NewMemberForm from "../components/new-member-form";

const MembersCreatePage = () => {        
    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="flex items-center justify-between flex-col w-full h-full">
                <h1 className="text-lg font-semibold md:text-2xl">Criando Membro</h1>
                <div className="w-full h-full">
                    <NewMemberForm/>
                </div>
            </div>
        </div>
    )
}

MembersCreatePage.layout = (page: any) => <AuthenticatedLayout children={page} showTitle={false}/>;

export default MembersCreatePage;