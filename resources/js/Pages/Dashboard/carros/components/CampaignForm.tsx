import InputLabel from "@/components/InputLabel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { avatarName, maskCpfCnpj } from "@/lib/utils";
import { Campaign } from "@/types";
import { Eye} from "lucide-react";
import { FaUser } from "react-icons/fa";
import { withMask } from "use-mask-input";
import { JSONTree } from 'react-json-tree';
import { usePage } from "@inertiajs/react";
import { useState } from "react";

type Props = {
    campaign: Campaign;
};

export const CampaignForm = ({ campaign }: any) => {

    const { lastLogin } = usePage().props as any;

    const [openLog, setOpenLog] = useState(false);
    

    function formatDateBR(isoDate: any) {
        const date = new Date(isoDate);
        
        const day = String(date.getUTCDate()).padStart(2, '0');
        const monthNames = [
            'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
            'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
        ];
        const month = monthNames[date.getUTCMonth()];
        const year = date.getUTCFullYear();
        
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        
        return `${day} de ${month} de ${year} às ${hours}:${minutes}:${seconds}`;
    }

      function formatDateBRFromString(dateString: any) {
        const date = new Date(dateString.replace(" ", "T"));
    
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
    
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }


    return (
        <div className="grid w-[20em] items-center gap-6 mt-8 max-w-[100vw]">
            <div className="flex w-[60em] gap-4 items-center justify-center bg-slate-900/10 p-4 rounded-md shadow-md border">
                <Avatar className="rounded-2xl h-[10em] w-auto shadow-md bg-gray-900">                    
                    <AvatarImage src={campaign.photo as string} alt={campaign.candidate_name} className="z-[1]"/>
                    <AvatarFallback className="bg-gray-900 h-[10em] w-[10em] rounded-none text-white font-medium relative">                        
                        <div className="absolute w-full h-full flex items-center justify-center opacity-10"><FaUser  className="w-[80%] h-[80%]"/></div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[3em] leading-[1.1em]">{avatarName(campaign.candidate_name)}</span>
                            <span className="text-[.6em] font-light opacity-50">(Sem Foto)</span>
                        </div>
                    </AvatarFallback>
                </Avatar>
                <div className="w-full flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-52">
                            <InputLabel htmlFor="candidate_number" value="Número" />

                            <Input
                                id="candidate_number"
                                className="mt-1 block w-fit"
                                value={campaign.candidate_number}
                                autoComplete="candidate_number"
                                readOnly
                            />

                                            </div>
                        <div className="w-full">
                            <InputLabel
                                htmlFor="candidate_name"
                                value="Nome do Candidato"                        
                            />

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={campaign.candidate_name}
                                autoComplete="candidate_name"
                                readOnly
                            />

                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full">
                            <InputLabel htmlFor="position" value="Cargo" />

                            <Input value={campaign.position} readOnly className="capitalize"/>
                                            </div>
                        <div className="w-full">
                            <InputLabel htmlFor="city_id" value="Cidade" />
                            <Input value={`${campaign?.city?.name} - ${campaign?.city?.state_id}`} readOnly/>
                        </div>
                        <div className="w-full select-none">
                            <InputLabel value="Recibo" />
                            {campaign?.electoralReceipt ? (
                                <>
                                {campaign?.electoralReceipt?.approved ?
                                    <a href={campaign?.electoralReceipt?.filename} target="_blank">
                                        <Button className="bg-green-700 hover:bg-green-900 w-full flex gap-2 items-center">                                        
                                            <Eye/>
                                            <span>Recibo (Verificado)</span>                                            
                                        </Button>
                                    </a>
                                    :
                                    <a href={campaign?.electoralReceipt?.filename} target="_blank">                    
                                        <Button className="bg-yellow-400 hover:bg-yellow-500 w-full text-primary/80 flex gap-2 items-center">                                        
                                            <Eye/>
                                            <span>Enviado (Não Verificado)</span>                                        
                                        </Button>
                                    </a>
                                }
                                </>
                            ) : (
                                <Button disabled={true} variant={"outline"} className="w-full">
                                    <span>Recibo não foi enviado</span>
                                </Button>
                            )}   
                        </div>
                    </div>
                </div>
            </div>
            <h4 className="text-slate-500 font-bold uppercase my-2 border-b">
                CONTATO
            </h4>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">                                        
                    <InputLabel
                        value="CPF da Camapanha"
                    />

                    <Input
                        className="mt-1 block w-full"
                        value={maskCpfCnpj(campaign.cpf)}
                        autoComplete="official_email"
                        readOnly
                    />
                </div>
                <div className="w-full">                                        
                    <InputLabel
                        value="CNPJ da Campanha"
                    />

                    <Input
                        className="mt-1 block w-full"
                        value={maskCpfCnpj(campaign.cnpj)}
                        autoComplete="official_email"
                        readOnly
                    />
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">                                        
                    <InputLabel
                        htmlFor="official_email"
                        value="Email da Campanha"
                    />

                    <Input
                        id="official_email"
                        className="mt-1 block w-full"
                        value={campaign.official_email}
                        autoComplete="official_email"
                        readOnly
                    />
                </div>
                <div className="w-[20em]">                    
                    <InputLabel htmlFor="official_phone" value="Telefone" />
                    <Input
                        type="tel"
                        id="official_phone"
                        inputMode="numeric"
                        className="mt-1 block w-full"
                        value={campaign.official_phone}
                        placeholder="(00) 00000 0000"
                        ref={withMask(["(99) 9999-9999", "(99) 99999-9999"])}
                        readOnly
                    />
                </div>
                <div className="w-[20em]">                    
                    <InputLabel
                        htmlFor="official_whatsapp"
                        value="WhatsApp"
                    />

                    <Input
                        type="tel"
                        id="official_whatsapp"
                        inputMode="numeric"
                        className="mt-1 block w-full"
                        value={campaign.official_whatsapp}
                        placeholder="(00) 00000 0000"
                        ref={withMask(["(99) 9999-9999", "(99) 99999-9999"])}
                        readOnly
                    />
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">
                    <InputLabel value="Telefone do Assessor" />
                    <Input
                        type="tel"
                        inputMode="numeric"
                        className="mt-1 block w-full"
                        value={campaign?.accessor_phone}
                        placeholder="(00) 00000 0000"
                        ref={withMask(["(99) 9999-9999", "(99) 99999-9999"])}
                        readOnly
                    />

                                    </div>
                <div className="w-full">
                    <InputLabel
                        value="Nome do Assessor"
                    />

                    <Input
                        className="mt-1 block w-full"
                        value={campaign?.accessor_name}
                        readOnly
                    />

                </div>
            </div>
            <h4 className="text-slate-500 font-bold uppercase my-2 border-b">
                Outras Informações
            </h4>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">
                    <InputLabel
                        value="Último Login"
                    />

                    <Input
                        className="mt-1 block w-full"
                        value={lastLogin?.created_at ? formatDateBR(lastLogin?.created_at) : "Sem Informações"}
                        readOnly
                    />

                </div>
                <div className="w-full">
                    <InputLabel
                        value="Registro do Último Login"
                    />

                    <Button onClick={() => setOpenLog(true)} variant={"outline"} className="mt-1 w-full flex items-center gap-2 text-black/80 hover:text-black">
                        <Eye/>
                        <span>Ver Registro</span>
                        <span className="text-xs italic opacity-70">(IP e Log Completo)</span>
                    </Button>

                </div>
                <div className="w-full">
                    <InputLabel
                        value="Data e hora do aceite dos termos"
                    />

                    <Input
                        className="mt-1 block w-full"
                        value={formatDateBRFromString(campaign?.terms_accepted_at)}
                        readOnly
                    />

                </div>
                <Dialog open={openLog} onOpenChange={setOpenLog}>
                    <DialogContent className="max-w-full sm:max-w-5xl max-h-screen overflow-auto px-4 sm:px-12">
                        <DialogHeader>
                            <DialogTitle>
                                Registro de atividades do último login (IP, HORA, LOG COMPLETO)
                            </DialogTitle>
                            <DialogDescription>
                                <div className="rounded-xl overflow-hidden w-full h-fit bg-[#002b36] px-4 mt-6">
                                    <JSONTree data={lastLogin?.properties} invertTheme={true} />  
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};
