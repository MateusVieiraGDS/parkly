import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Campaign } from "@/types";
import { router } from "@inertiajs/react";
import axios from "axios";
import { Info, Loader2, MessageCircleWarning, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

export const CampaignInsert = ({ user }: { user: any }) => {
    const [permissions, setPermissions] = useState<any>([
        { id: "owner", label: "Coordenador Proprietário" },
        { id: "coord", label: "Coordernador" },
        { id: "member", label: "Membro" },
    ]);

    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [campaings, setCampaings] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [totalCountCampaign, setTotalCountCampaign] = useState(0);
    const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
    const [selectedPermission, setSelectedPermission] = useState("");
    const [selectedTab, setSelectedTab] = useState("tab_camp");

    const getCampaign = async (value: string) => {
        setIsLoading(true);
        setSearch(value);
        const campaings = await requestCampaigns();
        setCampaings(campaings.data.campaigns);
        //setCampaings(prev => [...prev, ...campaings.data.campaigns]);
        setTotalCountCampaign(campaings.data.total);
        setIsLoading(false);
    };
    const [debounced] = useDebounceValue(search, 800);

    const requestCampaigns = async (limit = 50, offset = 0) => {
        return await axios.get(
            `/admin/campaign-atatch/getCampaigns?search=${search}&limit=${limit}&offset=${offset}&uid=${user.id}`
        );
    };

    const handleOnSelected = (campaign: any) => {
        setSelectedCampaign(campaign);
        setSelectedTab("tab_fin");
    };

    useEffect(() => {
        if (debounced !== undefined && debounced) {
            getCampaign(debounced);
        }
    }, [debounced]);

    const handleSubmit = () => {
        router.put(
            route("campaign-atatch.insertUser", user.id),
            {
                campaign_id: selectedCampaign.id,
                permission: selectedPermission,
            },
            {
                onSuccess: () => {
                    setCampaings([]);
                    setSelectedCampaign(null);
                    setSelectedPermission("");
                    setSelectedTab("tab_camp");
                    setModalShow(false);
                },
            }
        );
    };

    return (
        <>
            <Card className="ml-5 flex flex-col justify-between">
                <CardHeader>
                    <CardTitle>Campanhas Envolvidas</CardTitle>
                    <CardDescription>
                        Inserir o usuário em determinada campanha
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button onClick={() => setModalShow(true)}>
                        Inserir em campanha
                    </Button>
                </CardFooter>
            </Card>

            <Dialog
                open={modalShow}
                modal
                onOpenChange={setModalShow}
                defaultOpen={modalShow}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Inserir Campanha</DialogTitle>
                    </DialogHeader>
                    <Tabs
                        className="w-full"
                        value={selectedTab}
                        onValueChange={(tb) => {
                            setSelectedTab(tb);
                        }}
                    >
                        <TabsList className="w-full">
                            <TabsTrigger value="tab_camp" className="w-full">
                                Campanha
                            </TabsTrigger>
                            <TabsTrigger
                                value="tab_fin"
                                className="w-full"
                                disabled={selectedCampaign == null}
                            >
                                Finalização
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value="tab_camp"
                            className="h-90 max-h-90 min-h-90"
                        >
                            <div className="gap-4 py-2">
                                <div className="relative">
                                    <Input
                                        id="name"
                                        placeholder="Pesquisar campanha..."
                                        className="my-4"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                    />
                                    {isLoading && (
                                        <Loader2 className="absolute right-2 top-2 animate-spin h-6 w-6 text-muted-foreground" />
                                    )}
                                </div>

                                <div className="max-h-80 min-h-80 overflow-y-auto mt-2">
                                    <Table className="mt-2">
                                        <TableHeader className="bg-slate-100 border-t">
                                            <TableRow>
                                                <TableHead className="w-full">
                                                    Nome
                                                </TableHead>
                                                <TableHead>Numero</TableHead>
                                                <TableHead>Cargo</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="cursor-pointer border">
                                            {campaings.map(
                                                (campaing: any, index) => (
                                                    <TableRow
                                                        key={campaing.id}
                                                        onClick={() =>
                                                            handleOnSelected(
                                                                campaing
                                                            )
                                                        }
                                                    >
                                                        <TableCell className="table-cell">
                                                            {
                                                                campaing.candidate_name
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                campaing.candidate_number
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {campaing.position}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                    {campaings.length < 1 && (
                                        <>
                                            {campaings.length === 0 &&
                                            debounced.length !== 0 ? (
                                                <div className="flex justify-center p-20 flex-col items-center gap-4 bg-slate-50 ">
                                                    <Info className="h-12 w-12 text-muted-foreground" />
                                                    <DialogDescription>
                                                        Nenhuma campanha
                                                        disponível encontrada
                                                    </DialogDescription>
                                                </div>
                                            ) : (
                                                <div className="flex justify-center p-20 flex-col items-center gap-4 bg-slate-50 ">
                                                    <MessageCircleWarning className="text-slate-500 h-12 w-12" />
                                                    <DialogDescription>
                                                        Insira o nome do
                                                        candidato ou número
                                                    </DialogDescription>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent
                            value="tab_fin"
                            className="h-90 max-h-90 min-h-90 pb-5"
                        >
                            {selectedCampaign && (
                                <>
                                    <Card className="mt-5">
                                        <CardContent className="p-2 pt-1 ">
                                            <h3 className="font-semibold text-center text-xl">
                                                Detalhes da Campanha
                                            </h3>
                                            <Separator className="my-2" />
                                            <div className="flex">
                                                <img
                                                    src={selectedCampaign.photo}
                                                    alt={
                                                        selectedCampaign.candidate_name
                                                    }
                                                    className="h-40 w-40 rounded-lg"
                                                />
                                                <div className="ml-5 text-lg">
                                                    <p className="font-medium">
                                                        Canditado
                                                    </p>
                                                    <p>
                                                        {
                                                            selectedCampaign.candidate_name
                                                        }
                                                    </p>

                                                    <Separator className="my-2" />
                                                    <p className="font-medium">
                                                        Numero
                                                    </p>
                                                    <p>
                                                        {
                                                            selectedCampaign.candidate_number
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Separator className="mt-8 mb-5" />
                                    <p className="mb-2 ml-1 font-medium">
                                        Permissão do usuário nesta campanha
                                    </p>
                                    <Select
                                        defaultValue="membro"
                                        value={selectedPermission}
                                        onValueChange={(p) => {
                                            setSelectedPermission(p);
                                        }}
                                    >
                                        <SelectTrigger className="w-80">
                                            <SelectValue placeholder="Selecione a Permissão" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {permissions.map((perm: any) => (
                                                <SelectItem
                                                    key={perm.id}
                                                    value={perm.id}
                                                >
                                                    {perm.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Separator className="mt-8 mb-5 w-2/3" />
                                    <div className="flex justify-center">
                                        <Button onClick={handleSubmit}>
                                            Salvar Alterações
                                        </Button>
                                    </div>
                                </>
                            )}
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </>
    );
};
