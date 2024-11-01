import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { usePage } from "@inertiajs/react";
import { useMembers } from "../../../use-members";

export const SearchInput = () => {
    const { query }: any = usePage().props as unknown;
    const [search, setSearch] = useState<string>(query?.search || "");
    const [debounced] = useDebounceValue(search, 800);
    const [initialSearch, setInitialSearch] = useState(false);
    const { getMembers } = useMembers();

    useEffect(() => {
        if (debounced !== undefined && initialSearch) {
            getMembers({
                params: {
                    search: debounced,
                    page: 1,
                },
            });
        }
    }, [debounced]);

    useEffect(() => {
        setInitialSearch(true);
    }, []);

    return (
        <div className="w-full relative">
            <Input
                placeholder="Pesquise nomes, nomes de urna ou números ..."
                className="bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="text-primary= absolute top-1/2 right-4 transform -translate-y-1/2" />
        </div>
    );
};
