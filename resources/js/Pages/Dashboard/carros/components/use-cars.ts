import { router } from "@inertiajs/react";
import qs from "query-string";

type useCarsParams = {
    params: {
        search?: string;
        page?: number;
    };
};

export const useCars = () => {
    const getCars = async ({ params }: useCarsParams) => {
        const query = { ...route().params };
        const newUrl = qs.stringifyUrl({
            url: route("dashboard.carros.index"),
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
        getCars,
    };
};
