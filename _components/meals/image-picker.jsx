'use client';

import { useEffect, useRef, useState } from 'react';
import classes from './image-picker.module.css'
import Image from 'next/image';

const ImagePicker = ({ label, name, existingImage }) => {
    const [pickedImage, setPickedImage] = useState();
    const imageInput = useRef();

    const handleButtonClick = () => {
        imageInput.current.click();
    }

    const handleImageChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];

        if (!file) {
            setPickedImage(null);
            return;
        }

        const fileReader = new FileReader();

        fileReader.onload = () => {
            setPickedImage(fileReader.result);
        };

        fileReader.readAsDataURL(file);
    }

    const imageToShow = pickedImage || existingImage;

    return (
        <div className={classes.picker}>
            <label htmlFor={name}>{label}</label>
            <div className={classes.controls}>
                <div className={classes.preview}>
                    {!imageToShow && <p>No image picked yet.</p>}
                    {imageToShow && (
                        <Image
                            src={imageToShow}
                            alt="Selected restaurant image"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    )}
                </div>
                <input type="hidden" name="existingImage" value={imageToShow || ''} />

                <input className={classes.input} type="file" name={name} accept="image/png, image/jpeg" id={name} ref={imageInput} onChange={handleImageChange} required={!existingImage} />

                <button className={classes.button} type="button" onClick={handleButtonClick}>
                    Pick an Image
                </button>
            </div>
        </div>
    )
}

export default ImagePicker