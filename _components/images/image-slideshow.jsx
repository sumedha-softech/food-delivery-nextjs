'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import classes from './image-slideshow.module.css'

const ImageSlideshow = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const totalImages = images.length;
  if (!totalImages) return <p>No images to show.</p>;

  const preloadImage = (src) => {
    const img = new window.Image();
    img.src = src;
  };

  useEffect(() => {
    if (totalImages <= 1) return;

    intervalRef.current = setInterval(() => {
      const nextIndex = (prev => (prev + 1) % totalImages)(currentIndex);
      preloadImage(images[nextIndex].image);

      setCurrentIndex(nextIndex);
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [currentIndex, images, totalImages]);

  return (
    <div className={classes.slideshow}>
      {images.map((img, index) => (
        <Image
          key={img.image}
          src={img.image}
          alt={img.title || `Slide ${index + 1}`}
          className={index === currentIndex ? classes.active : classes.inactive}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          priority={index === currentIndex}
        />
      ))}
    </div>
  );
};

export default ImageSlideshow;