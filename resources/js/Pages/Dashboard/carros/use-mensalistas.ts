import { router } from "@inertiajs/react";
import qs from "query-string";

type useCampaignParams = {
    params: {
        search?: string;
        page?: number;
        cargo?: string;
        cidade?: string;
        estado?: string;
        pessoas?: number
        nome?: string;
        orderBy?: string;
        sorted?: any;
        categories?: string;
    };
};

export const useMembers = () => {
    const getMembers = async ({ params }: useCampaignParams) => {
        const query = { ...route().params };
        const newUrl = qs.stringifyUrl({
            url: route("dashboard.membros.index"),
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
        getMembers,
    };
};
