import { Button } from "@/components/ui/button";
import { Link, router } from "@inertiajs/react";
import { Eye } from "lucide-react";
import { FaExternalLinkAlt } from "react-icons/fa";

type Props = {
    row: any;
};

export const Actions = ({ row }: Props) => {

    return (
        <div className="w-full flex gap-2 justify-start">  
            {row?.electoralReceipt ? (
                <>
                {row?.electoralReceipt?.approved ?
                    <a href={row?.electoralReceipt?.filename} target="_blank">
                        <Button className="bg-green-700 hover:bg-green-900 flex gap-2 items-center">                        
                            <Eye/>
                            <span>Vizualizar Recibo</span>                        
                        </Button>
                    </a>
                    :   
                    <a href={row?.electoralReceipt?.filename} target="_blank">                 
                        <Button className="bg-yellow-400 hover:bg-yellow-500 text-primary/80 flex gap-2 items-center">                            
                            <Eye/>
                            <span>Vizualizar Recibo</span>                        
                        </Button>
                    </a>
                }
                </>
            ) : (
                <Button disabled={true} variant={"outline"}>
                    <span>Sem recibo</span>
                </Button>
            )}         
            <Link href={route('recibos.show', row.id)}>
                <Button className="flex gap-2 items-center">                    
                    <span>Ver Mais</span>
                    <FaExternalLinkAlt />
                </Button>
            </Link>
        </div>
    );
};
