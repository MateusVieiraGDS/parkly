import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NewMemberForm from "../components/new-member-form";
import FormEnderecoContato from "../components/endereco-contato-form";


const MembersEditPage = ({}) => {
    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Editando Membro</h1>
            </div>
            <Tabs defaultValue="dadosPessoais" className="w-[400px]">
                <TabsList>
                    <TabsTrigger value="dadosPessoais">Dados Pessoais</TabsTrigger>
                    <TabsTrigger value="enderecoContato">Endereço e Contato</TabsTrigger>
                    <TabsTrigger value="congregacaoBatismo">Congregação e Batismo</TabsTrigger>
                    <TabsTrigger value="consagracao">Consagrações</TabsTrigger>
                </TabsList>
                <TabsContent value="dadosPessoais">
                    <NewMemberForm/>
                </TabsContent>
                <TabsContent value="enderecoContato">
                    <FormEnderecoContato/>
                </TabsContent>
                <TabsContent value="congregacaoBatismo"></TabsContent>
                <TabsContent value="consagracao"></TabsContent>
            </Tabs>
        </div>
    )

}

MembersEditPage.layout = (page: any) => <AuthenticatedLayout children={page} showTitle={false}/>;

export default MembersEditPage;