import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose, AiOutlineSave, AiOutlineEdit, AiOutlineDelete, AiOutlineUpload, AiOutlineEye } from "react-icons/ai";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImagePreviewDialog from "@/components/image-preview";

interface ImagemCropUploadProps {
    initialAspectRatio?: number;
    setImages: (image: File | null) => void;
    initialSource?: string;
}

type SelectedImage = File | { src: string; name: string; size: number } | null;

const ImagemCropUpload: React.FC<ImagemCropUploadProps> = ({ initialAspectRatio = 16 / 9, setImages, initialSource }) => {
    const [cropperShow, setCropperShow] = useState(false);
    const [previewImg, setPreviewImg] = useState<any>(null);
    const cropperRef = useRef<any>(null);
    const [selectedImage, setSelectedImage] = useState<SelectedImage>(
        initialSource ? { src: initialSource, name: "imagem_inicial.jpg", size: 0 } : null
    );
    const [croppingImageUrl, setCroppingImageUrl] = useState<string | null>(null);
    const [edited, setEdited] = useState(false);

    useEffect(() => {
        if (initialSource) {
            setSelectedImage({ src: initialSource, name: "imagem_inicial.jpg", size: 0 });
        }
    }, [initialSource]);

    const onSaveCrop = () => {
        if (cropperRef.current) {
            const cropper = cropperRef.current.cropper;
            const dataUrl = cropper.getCroppedCanvas().toDataURL();
            const blob = dataURLtoBlob(dataUrl);
            const croppedFile = new File([blob], selectedImage?.name || "imagem_cortada.png", { type: 'image/png' });
            setSelectedImage(croppedFile);
            setImages && setImages(croppedFile);
            setCropperShow(false);
            setCroppingImageUrl(null);
            setEdited(true);
        }
    };

    const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setImages && setImages(file);
            setEdited(true);
        }
    };

    const handleCropImage = () => {
        if (selectedImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCroppingImageUrl(reader.result as string);
                setCropperShow(true);
            };
            if ('src' in selectedImage) {
                setCroppingImageUrl(selectedImage.src);
                setCropperShow(true);
            } else {
                reader.readAsDataURL(selectedImage);
            }
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImages && setImages(null);
        setEdited(false);
    };

    const dataURLtoBlob = (dataURL: string) => {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)![1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new Blob([u8arr], { type: mime });
    };

    const handleRotate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const degrees = parseInt(e.target.value, 10);
        const cropper = cropperRef.current?.cropper;
        cropper?.rotateTo(degrees);
    };

    const handleZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        const cropper = cropperRef.current?.cropper;
        cropper?.zoomTo(value / 100);
    };

    const formatFileSize = (size: number) => {
        const units = ["Bytes", "KB", "MB", "GB"];
        let unitIndex = 0;
        let formattedSize = size;

        while (formattedSize >= 1024 && unitIndex < units.length - 1) {
            formattedSize /= 1024;
            unitIndex++;
        }

        return `${formattedSize.toFixed(2)} ${units[unitIndex]}`;
    };

    const getImageUrl = () => {
        if (!selectedImage) return '';
        return 'src' in selectedImage ? selectedImage.src : URL.createObjectURL(selectedImage);
    };

    return (
        <>
            <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg border border-gray-300">
                <div className="flex items-center space-x-4">
                    {selectedImage ? (
                        <>
                            <AiOutlineEye className="h-7 w-7" />
                            <div>
                                <p className="text-sm font-medium">{selectedImage.name}</p>
                                <div className="flex items-center gap-1">
                                    <p className="text-xs text-gray-500">{formatFileSize(selectedImage.size)}</p>
                                    {edited && <>&middot;<p className="text-xs text-gray-500"><strong><i>Editado</i></strong></p></>}
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500">Selecione um arquivo</p>
                    )}
                </div>

                <div className="space-x-2">
                    {selectedImage ? (
                        <>
                            <Button variant="outline" onClick={() => setPreviewImg(getImageUrl())} type="button">
                                <AiOutlineEye className="mr-1" /> Preview
                            </Button>
                            <Button variant="outline" onClick={handleCropImage} type="button">
                                <AiOutlineEdit className="mr-1" /> Editar
                            </Button>
                            <Button variant="destructive" onClick={handleRemoveImage} type="button">
                                <AiOutlineDelete className="mr-1" /> Remover
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" type="button" className="cursor-pointer">
                            <label className="flex gap-2 items-center cursor-pointer">
                                <AiOutlineUpload className="mr-1" /> Selecionar
                                <input type="file" accept="image/*" onChange={handleSelectImage} className="hidden" />
                            </label>
                        </Button>
                    )}
                </div>
            </div>

            <Dialog open={cropperShow} onOpenChange={() => setCropperShow(false)}>
                <DialogContent className="max-w-lg w-full p-6 space-y-4">
                    <DialogTitle className="text-lg font-semibold">Edição da imagem</DialogTitle>
                    <div>
                        <label className="block">Rotação da imagem</label>
                        <input
                            type="range"
                            defaultValue={0}
                            min={-180}
                            max={180}
                            onChange={handleRotate}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block">Zoom</label>
                        <input
                            type="range"
                            defaultValue={100}
                            min={0}
                            max={200}
                            onChange={handleZoom}
                            className="w-full"
                        />
                    </div>
                    <Cropper
                        src={(croppingImageUrl) as any}
                        style={{ height: 300, width: "100%" }}
                        initialAspectRatio={initialAspectRatio}
                        guides={true}
                        ref={cropperRef}
                        rotatable={true}
                        responsive={true}
                        zoomOnWheel={false}
                        movable={true}
                    />
                    <DialogFooter className="flex justify-end space-x-2 p-4">
                        <Button variant="outline" onClick={() => setCropperShow(false)} type="button">
                            <AiOutlineClose className="mr-1" /> Cancelar
                        </Button>
                        <Button onClick={onSaveCrop} type="button">
                            <AiOutlineSave className="mr-1" /> Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>                
            </Dialog>

            <ImagePreviewDialog src={previewImg} onClose={() => setPreviewImg(null)} />
        </>
    );
};

export default ImagemCropUpload;
