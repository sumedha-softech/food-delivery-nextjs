'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import classes from './page.module.css';

const SuccessPage = () => {
    const [deliveryTime, setDeliveryTime] = useState(null);

    useEffect(() => {
        fetchDeliveryEstimate();
    }, []);

    const fetchDeliveryEstimate = async () => {
        const restaurantAddress = JSON.parse(localStorage.getItem('cart'));
        let restaurantLat;
        let restaurantLng;
        let deliveryLat;
        let deliveryLng;
        if (restaurantAddress) {
            restaurantLat = restaurantAddress.restaurantLat;
            restaurantLng = restaurantAddress.restaurantLng;
        }

        const deliveryAddress = JSON.parse(sessionStorage.getItem('address'));
        if (deliveryAddress) {
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
                const durationInMinutes = Math.ceil(durationInSeconds / 60);

                setDeliveryTime(durationInMinutes);
            } catch (error) {
                console.error('Error fetching delivery time:', error);
            }
        }
        // localStorage.removeItem('cart');
    }

    return (
        <main className={classes["success-page"]}>
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for your order. Your payment was successful.</p>
            {deliveryTime && (
                <p><strong>Estimated Delivery Time: {deliveryTime} minutes</strong></p>
            )}
            <p>We'll notify you when your food is out for delivery.</p>
            <Link href="/" className={classes["back-home"]}>Back to Home</Link>
        </main>
    );
};

export default SuccessPage;
