import { router } from "@inertiajs/react";
import qs from "query-string";

type useTicketsParams = {
    params: {
        search?: string;
        page?: number;
    };
};

export const useTickets = () => {
    const getTickets = async ({ params }: useTicketsParams) => {
        const query = { ...route().params };
        const newUrl = qs.stringifyUrl({
            url: route("dashboard.saidas.index"),
            query: {
                ...query,
                ...params,
            },
        });
        router.get(
            newUrl,
            {},
            {
                preserveState: true,
            }
        );
    };

    return {
        getTickets,
    };
};
