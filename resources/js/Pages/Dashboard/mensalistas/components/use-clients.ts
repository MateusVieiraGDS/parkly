import { router } from "@inertiajs/react";
import qs from "query-string";

type useClientsParams = {
    params: {
        search?: string;
        page?: number;
    };
};

export const useClients = () => {
    const getClients = async ({ params }: useClientsParams) => {
        const query = { ...route().params };
        const newUrl = qs.stringifyUrl({
            url: route("dashboard.mensalistas.index"),
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
        getClients,
    };
};
