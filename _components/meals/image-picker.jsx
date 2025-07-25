'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import classes from './image-picker.module.css'

const ImagePicker = ({ label, name, existingImage }) => {
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            setPreview(null);
            return;
        }

        const reader = new FileReader();
        reader.onload = () => setPreview(fileReader.result);
        reader.readAsDataURL(file);
    };

    const imageSrc = preview || existingImage;

    return (
        <div className={classes.picker}>
            <label htmlFor={name}>{label}</label>
            <div className={classes.controls}>
                <div className={classes.preview}>
                    {imageSrc ? (
                        <Image
                            src={imageSrc}
                            alt={label || 'Selected image preview'}
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    ) : (
                        <p>No image picked yet.</p>
                    )}
                </div>
                <input type="hidden" name="existingImage" value={imageSrc || ''} />

                <input
                    id={name}
                    ref={fileInputRef}
                    type="file"
                    name={name}
                    accept="image/png, image/jpeg"
                    className={classes.input}
                    onChange={handleFileChange}
                    required={!existingImage}
                />

                <button
                    className={classes.button}
                    type="button"
                    onClick={handleFileButtonClick}
                >
                    Pick an Image
                </button>
            </div>
        </div>
    );
};

export default ImagePicker;