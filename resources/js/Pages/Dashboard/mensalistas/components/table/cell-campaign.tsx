import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { avatarName } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export const CellCampaign = ({ row }: { row: any }) => {
    return (
        <div className="w-full flex flex-row justify-between items-center">
            <div className="flex items-center">
                {row.defaultCampaign?.photo && (
                    <Avatar className="size-6 mr-1">
                        <AvatarImage
                            src={row.defaultCampaign?.photo}
                            alt={avatarName(row.defaultCampaign?.name)}
                        />
                    </Avatar>
                )}
                <p className="text-gray-700">
                    {row.defaultCampaign?.candidate_name || "Sem campanha"}
                </p>
            </div>
            <div>
                {row.campaigns.length > 0 && (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm">
                                + {row.campaigns.length}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="flex flex-col gap-2">
                                {row.campaigns.map((campaign: any) => (
                                    <div
                                        key={campaign.id}
                                        className="flex gap-2 items-center"
                                    >
                                        <Avatar>
                                            <AvatarImage
                                                src={campaign.photo}
                                                alt={avatarName(campaign.name)}
                                            />
                                        </Avatar>
                                        <div>
                                            <div>{campaign.candidate_name}</div>
                                            <div>{campaign.name}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                )}
            </div>
        </div>
    );
};
