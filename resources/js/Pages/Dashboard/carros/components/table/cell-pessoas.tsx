import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { City, DistrictProps } from "@/types";
import { Link } from "@inertiajs/react";

type Row = {
    row: {
        peoples_count: number,        
    };
};

export const CellPessoas = ({ row }: Row) => {

    const clipCount = (count: number) => {        
        return count > 99 ? '99+' : count;
    }

    const style_buttons = "px-2 py-1 rounded-md bg-primary text-muted font-medium flex justify-center items-center shadow-md";
    
    return (
        <div>
            <TooltipProvider delayDuration={500} disableHoverableContent={true}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className=" cursor-default w-full flex items-center justify-center">
                            <div className="hover:shadow-lg hover:scale-110 transition-all flex gap-2 w-fit h-fit justify-center items-center p-2 rounded-lg">
                                <div className={style_buttons}>
                                    {(row.peoples_count)}
                                </div>
                            </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="end" className="cursor-default">
                        <div>
                            <p className="font-medium">Pessoas na rede: {row.peoples_count}</p>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider> 
        </div>
    );
};
