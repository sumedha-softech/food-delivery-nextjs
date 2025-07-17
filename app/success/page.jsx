'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import classes from './page.module.css';
import { useRouter } from 'next/navigation';

const SuccessPage = () => {
    const [remainingTime, setRemainingTime] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedEndTime = parseInt(localStorage.getItem('delivery_end_time'));
        if (storedEndTime && storedEndTime > Date.now()) {
            startCountdown(storedEndTime);
        } else {
            fetchDeliveryEstimate();
        }
    }, []);

    const startCountdown = (endTime) => {
        const interval = setInterval(() => {
            const now = Date.now();
            const diff = endTime - now;

            if (diff > 0) {
                setRemainingTime(diff);
            } else {
                clearInterval(interval);
                localStorage.removeItem('delivery_end_time');
                router.push('/');
            }
        }, 1000);

        return () => clearInterval(interval);
    };

    const fetchDeliveryEstimate = async () => {
        const restaurantAddress = JSON.parse(localStorage.getItem('cart'));
        let restaurantLat;
        let restaurantLng;
        let deliveryLat;
        let deliveryLng;
        if (restaurantAddress?.restaurantLat && restaurantAddress?.restaurantLng) {
            restaurantLat = restaurantAddress.restaurantLat;
            restaurantLng = restaurantAddress.restaurantLng;
        }

        const deliveryAddress = JSON.parse(sessionStorage.getItem('address'));
        if (deliveryAddress?.lat && deliveryAddress?.lng) {
            deliveryLat = deliveryAddress.lat;
            deliveryLng = deliveryAddress.lng;
        }

        if (restaurantLat && restaurantLng && deliveryLat && deliveryLng) {
            try {
                const body = {
                    coordinates: [
                        [parseFloat(restaurantLng), parseFloat(restaurantLat)],
                        [parseFloat(deliveryLng), parseFloat(deliveryLat)]
                    ]
                };

                const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY
                    },
                    body: JSON.stringify(body)
                });

                const data = await response.json();

                const durationInSeconds = data.features[0].properties.summary.duration;
                const durationInMs = Math.ceil(durationInSeconds) * 1000;

                const endTime = Date.now() + durationInMs;
                localStorage.setItem('delivery_end_time', endTime.toString());
                localStorage.removeItem('cart');

                startCountdown(endTime);
            } catch (error) {
                console.error('Error fetching delivery time:', error);
            }
        } else {
            router.push('/');
        }
    }

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <main className={classes["success-page"]}>
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for your order. Your payment was successful.</p>
            {remainingTime !== null && (
                <p><strong>Estimated Delivery Time: {formatTime(remainingTime)} minutes</strong></p>
            )}
            <p>We'll notify you when your food is out for delivery.</p>
            <Link href="/" className={classes["back-home"]}>Back to Home</Link>
        </main>
    );
};

export default SuccessPage;
