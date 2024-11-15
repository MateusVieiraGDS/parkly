import { useConfirm } from "@/hooks/use-confirm";
import { CampaignAvailable } from "./campaign-available";
import { CampaignInsert } from "./campaign-insert";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CameraOff, Trash2 } from "lucide-react";

type Props = {
    user: any;
    campaigns: any[];
};

export const CampaignList = ({ user, campaigns }: Props) => {

    const [ConfirmaDialog, confirm] = useConfirm(
        "Excluir registros",
        "Deseja realmente excluir os registros selecionados?"
    );

    const handleDelete = async (toDelete: any) => {
        const ok = await confirm();
        if (!ok) return;

        router.delete(route("campaign-atatch.detatchUser", toDelete));
    };

    return (
        <div>
            <div className="grid grid-cols-3 pt-6">
                <CampaignAvailable
                    user={user}                    
                />
                <CampaignInsert
                    user={user}                    
                />
            </div>
            <h3 className="font-bold mt-6 text-3xl p-2">Campanhas</h3>
            <hr />
            <div className="grid grid-cols-4 pt-6 gap-6">
                {campaigns.map((campaign) => (
                    <a
                        href="#"
                        key={campaign.id}
                        className="bg-white hover:bg-slate-200 rounded-lg shadow-md p-4 mb-4 relative"
                    >
                        <Button className="rounded-full w-8 h-8 p-1 absolute right-2 bottom-2" variant="outline" onClick={() => {handleDelete({campaign_id: campaign.id, user_id: user.id})}}>
                            <Trash2 className="size-6" />                            
                        </Button>
                        <h2 className="text-lg font-bold text-foreground">
                            {campaign.candidate_name}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {campaign.position}
                        </p>
                        {campaign.photo ? (
                            <img
                                src={campaign.photo}
                                alt={campaign.candidate_name}
                                className="w-full h-64 object-cover object-center-top rounded-lg mt-2"
                            />
                        ) : (
                            <div className="flex flex-col justify-center items-center gap-4 w-full h-64 bg-gray-100 rounded-lg mt-2">
                                <CameraOff className="text-gray-500 text-7xl" />
                                <p className="text-center text-gray-500">
                                    Sem foto
                                </p>
                            </div>
                        )}
                    </a>
                ))}
            </div>
            <ConfirmaDialog />
        </div>
    );
};
