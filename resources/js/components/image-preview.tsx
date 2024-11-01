import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AiOutlineClose } from "react-icons/ai";

const ImagePreviewDialog = ({ src, onClose }: {src: string | null | undefined, onClose: any}) => {
    return (
        <Dialog open={!!src} onOpenChange={onClose}>
            <DialogContent className="max-w-lg w-full p-6 space-y-4">
                <DialogTitle>Preview da Imagem</DialogTitle>
                {src ? (
                    <img src={src} alt="Preview" className="max-w-full max-h-80 mx-auto" />
                ) : (
                    <p className="text-center text-gray-500">Nenhuma imagem para exibir.</p>
                )}
                <DialogFooter className="flex justify-end">
                    <Button variant="outline" onClick={onClose}>
                        <AiOutlineClose className="mr-1" /> Fechar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ImagePreviewDialog;