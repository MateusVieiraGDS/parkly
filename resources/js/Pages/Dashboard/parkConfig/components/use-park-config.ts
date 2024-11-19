import { router } from "@inertiajs/react";
import qs from "query-string";

type useParkConfigParams = {
    params: {
        search?: string;
        page?: number;
    };
};

export const useParkConfig = () => {
    const getParkConfig = async ({ params }: useParkConfigParams) => {
        const query = { ...route().params };
        const newUrl = qs.stringifyUrl({
            url: route("dashboard.configuracoes.index"),
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
        getParkConfig,
    };
};
