'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import classes from './image-slideshow.module.css'

const ImageSlideshow = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images?.length) return;

  const preloadImage = (src) => {
    const img = new window.Image();
    img.src = src;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      preloadImage(images[(currentImageIndex + 1) % images.length].image);

      setCurrentImageIndex((prev) =>
        prev < images.length - 1 ? prev + 1 : 0
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images]);

  if (!images?.length) return <p>No images to show</p>;

  return (
    <div className={classes.slideshow}>
      {images.map((image, index) => (
        <Image
          key={index}
          src={image.image}
          className={index === currentImageIndex ? classes.active : ''}
          alt={image.title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      ))}
    </div>
  );
};

export default ImageSlideshow;