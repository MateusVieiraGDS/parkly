import { CategoryProps } from "@/types";
import { create } from "zustand"

type UserState = {
    isOpen: boolean;
    initialData: CategoryProps;
    onOpen: () => void;
    onClose: () => void;
};

const initial = {
    id: null,
    name: "",
    phone: "",
    sex: "",
    level: "",
    district_id: "",
}

export const useUserForm = create<UserState>((set) => ({
    isOpen: false,
    initialData: {
       ...initial
    },
    onOpen: () => set({ isOpen: true, initialData: { ...initial}}),
    onClose: () => set({
        isOpen: false,
    }),
}))
