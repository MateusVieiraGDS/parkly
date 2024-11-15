import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { avatarName } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export const CellAvatar = ({ row }: { row: any }) => {
    return (
        <div className="w-[0em]">
            <div className="w-fit flex flex-col justify-center items-center shadow-md hover:scale-125 transition-all cursor-pointer bg-secondary px-2 pt-1">
                <Popover>
                    <PopoverTrigger asChild>
                        <Avatar className="">
                            <AvatarImage src={row?.photo ?? ''} alt="@shadcn" />
                            <AvatarFallback className="bg-primary text-muted" style={{userSelect: "none"}}>{avatarName(row.name)}</AvatarFallback>
                        </Avatar>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <img
                            src={row.photo}
                            alt={row.name}
                            className="w-full h-full object-cover"
                        />
                    </PopoverContent>
                </Popover>
                <span className="font-medium">{row.candidate_number}</span>
            </div>
        </div>
    );
};
