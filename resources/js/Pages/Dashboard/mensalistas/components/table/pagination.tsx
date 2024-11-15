import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useMembers } from "../../use-mensalistas";

type LinkProps = {
    url: string;
    label: string;
    active: boolean;
};

type PaginateProps = {
    links: LinkProps[];
};

export const PaginationTable = ({ links }: PaginateProps) => {
    const { getMembers } = useMembers();

    const handlePaginate = (url: string) => {
        const page = parseInt(url.split("page=")[1]);
        return getMembers({ params: { page } });
    };

    const totalItens: number = links.length || 0;

    return (
        <Pagination>
            <PaginationContent>
                {links.map((item, index) => {
                    if (index === 0) {
                        return (
                            <PaginationItem key={item.label}>
                                <PaginationPrevious
                                    onClick={() => handlePaginate(item.url)}
                                    className="cursor-pointer"
                                />
                            </PaginationItem>
                        );
                    }

                    if (index === totalItens - 1) {
                        return (
                            <PaginationItem key={item.label}>
                                <PaginationNext
                                    onClick={() => handlePaginate(item.url)}
                                    className="cursor-pointer"
                                />
                            </PaginationItem>
                        );
                    }

                    return (
                        <PaginationItem key={item.label}>
                            <PaginationLink
                                className={cn(
                                    "cursor-pointer hidden md:flex",
                                    item.active
                                        ? "bg-primary text-white"
                                        : "text-primary"
                                )}
                                onClick={() => handlePaginate(item.url)}
                            >
                                {item.label}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
            </PaginationContent>
        </Pagination>
    );
};
