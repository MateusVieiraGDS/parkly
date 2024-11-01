import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export const useConfirm = (
    title: string,
    message: string
): [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{
        resolve: (value: boolean) => void;
    } | null>(null);

    const confirm = () =>
        new Promise((resolve, reject) => {
            setPromise({ resolve });
        });

    const handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    };

    const ConfirmationDialog = () => (
        <Dialog open={promise !== null} onOpenChange={() =>{handleClose()}}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <DialogDescription>{message}</DialogDescription>

                <DialogFooter className="pt-2 gap-2">
                    <Button onClick={handleCancel} variant="outline">
                        Cancelar
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleConfirm}
                    >Confirmar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    return [ConfirmationDialog, confirm];
};
