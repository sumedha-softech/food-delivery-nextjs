'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import classes from './success-client.module.css';
import { useRouter } from 'next/navigation';

const SuccessClient = ({ orderId }) => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (!orderId) return;
        fetch(`/api/order/${orderId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch order details');
                }
                return res.json();
            })
            .then(data => {
                setOrderDetails(data);
                console.log('Order Details:', data);
            })
            .catch((error) => {
                console.error('API Fetch Error:', error);
                router.push('/');
            });
    }, [orderId]);

    useEffect(() => {
        const storedEndTime = parseInt(localStorage.getItem('delivery_end_time'));
        if (storedEndTime && storedEndTime > Date.now()) {
            startCountdown(storedEndTime);
        } else {
            fetchDeliveryEstimate();
        }

        return () => clearInterval(window.deliveryCountdownInterval);
    }, []);

    const startCountdown = (endTime) => {
        window.deliveryCountdownInterval = setInterval(() => {
            const now = Date.now();
            const diff = endTime - now;

            if (diff > 0) {
                setRemainingTime(diff);
            } else {
                clearInterval(window.deliveryCountdownInterval);
                localStorage.removeItem('delivery_end_time');

                fetch('/api/order', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId })
                }).then(res => {
                    if (!res.ok) {
                        throw new Error('Failed to mark order completed');
                    }
                    console.log('Order marked as completed');
                    router.push('/');
                }).catch((error) => {
                    console.error('Order completion API error:', error);
                    router.push('/');
                });
            }
        }, 1000);
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

            {orderDetails && (
                <section className={classes["order-summary"]}>
                    <h2>Order Summary</h2>
                    <p><strong>Order ID:</strong> {orderDetails.id}</p>
                    <p><strong>Total Amount:</strong> ${orderDetails.totalAmount}</p>
                    <p><strong>Delivery Address:</strong> {orderDetails.deliveryAddress}</p>
                    <h3>Items:</h3>
                    <ul>
                        {JSON.parse(orderDetails.items)?.map(item => (
                            <li key={item.id}>{item.title} x {item.quantity}</li>
                        ))}
                    </ul>
                </section>
            )}

            {remainingTime !== null ? (
                <p><strong>Estimated Delivery Time: {formatTime(remainingTime)}</strong></p>
            ) : (
                <p>Calculating your delivery time...</p>
            )}

            <p>We'll notify you when your food is out for delivery.</p>
            <Link href="/" className={classes["back-home"]}>Back to Home</Link>
        </main>
    );
}

export default SuccessClient