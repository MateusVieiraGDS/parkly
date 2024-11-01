import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useUserForm } from "./use-user-form";
import { UserAddForm } from "./user-add-form";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { User2 } from "lucide-react";

export const UserAddSheet = () => {
    const { isOpen, onClose, initialData } = useUserForm();

    const handleOnClose = () => {
        onClose();
    };

    return (
        <Sheet open={isOpen} onOpenChange={handleOnClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        <div className="flex items-center">
                            <User2 className="size-6 mr-2" />
                            Adicionar
                        </div>
                    </SheetTitle>
                    <SheetDescription>
                        Adicione um novo usuário ao sistema
                    </SheetDescription>
                </SheetHeader>
                <UserAddForm />
            </SheetContent>
        </Sheet>
    );
};
