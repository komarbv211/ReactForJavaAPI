import React, { useRef, useEffect, useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

interface ImageCropperProps {
    image: string;
    onCrop: (croppedImage: string) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ image, onCrop }) => {
    const imageRef = useRef<HTMLImageElement>(null);
    const cropperRef = useRef<Cropper | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);

    useEffect(() => {
        if (imageRef.current) {
            cropperRef.current = new Cropper(imageRef.current, {
                aspectRatio: 1,
                viewMode: 1,
                zoomable: true,
                scalable: false,
                movable: false,
            });
        }

        return () => {
            cropperRef.current?.destroy();
        };
    }, [image]);

    const cropImage = () => {
        if (cropperRef.current) {
            const canvas = cropperRef.current.getCroppedCanvas();
            if (canvas) {
                const cropped = canvas.toDataURL("image/png");
                setCroppedImage(cropped);
                onCrop(cropped);
            }
        }
    };

    return (
        <div>
            <div className="border rounded-md p-2">
                <img ref={imageRef} src={image} alt="Crop" className="max-w-full" />
            </div>
            <button onClick={cropImage} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
                Обрізати фото
            </button>
            {croppedImage && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Обрізане фото:</h3>
                    <img src={croppedImage} alt="Cropped" className="border rounded-md" />
                </div>
            )}
        </div>
    );
};

export default ImageCropper;
