'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import classes from './success-client.module.css';
import { useRouter } from 'next/navigation';

const DELIVERY_END_TIME_KEY = 'delivery_end_time';
const CART_KEY = 'cart';
const ADDRESS_KEY = 'address';

const parseJSON = (data, fallback = null) => {
    try {
        return JSON.parse(data);
    } catch (error) {
        return fallback;
    }
};

const getStoredData = (key, storage) => {
    return parseJSON(storage.getItem(key), null);
};

const SuccessClient = ({ orderId }) => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null);
    const router = useRouter();
    const intervalRef = useRef(null);
    const orderMarkedCompletedRef = useRef(false);

    const parsedItems = useMemo(() => {
        return parseJSON(orderDetails?.items, []);
    }, [orderDetails]);

    useEffect(() => {
        if (!orderId) return;

        const fetchOrderDetails = async () => {
            try {
                const res = await fetch(`/api/order/${orderId}`);
                if (!res.ok) throw new Error('Failed to fetch order details');

                const data = await res.json();
                setOrderDetails(data);
            } catch (error) {
                console.error('API Fetch Error:', error);
                router.push('/');
            }
        };

        fetchOrderDetails();
    }, [orderId, router]);

    const clearDeliveryEndTime = () => {
        const storedData = getStoredData(DELIVERY_END_TIME_KEY, localStorage) || {};
        if (storedData[orderId]) {
            delete storedData[orderId];
            localStorage.setItem(DELIVERY_END_TIME_KEY, JSON.stringify(storedData));
        }
    };

    const startCountdown = useCallback((endTime) => {
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            const now = Date.now();
            const diff = endTime - now;

            if (diff > 0) {
                setRemainingTime(diff);
            } else {
                clearInterval(intervalRef.current);
                clearDeliveryEndTime();
                router.push('/');
            }
        }, 1000);
    }, [orderId, router]);

    const fetchDeliveryEstimate = useCallback(async () => {
        const cartData = getStoredData(CART_KEY, localStorage);
        const addressData = getStoredData(ADDRESS_KEY, sessionStorage);

        const { restaurantLat, restaurantLng } = cartData || {};
        const { lat: deliveryLat, lng: deliveryLng } = addressData || {};

        if ([restaurantLat, restaurantLng, deliveryLat, deliveryLng].some(coord => isNaN(coord))) {
            console.error('Invalid coordinates in cart or address');
            router.push('/');
            return;
        }

        try {
            const res = await fetch('/api/delivery-estimate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    start: { lng: restaurantLng, lat: restaurantLat },
                    end: { lng: deliveryLng, lat: deliveryLat },
                }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Delivery estimate fetch failed:', errorText);
                throw new Error('Failed to fetch delivery estimate from server');
            }

            const { durationInMs } = await res.json();
            const endTime = Date.now() + durationInMs;

            const storedData = getStoredData(DELIVERY_END_TIME_KEY, localStorage) || {};
            storedData[orderId] = endTime.toString();
            localStorage.setItem(DELIVERY_END_TIME_KEY, JSON.stringify(storedData));
            localStorage.removeItem(CART_KEY);

            startCountdown(endTime);
        } catch (error) {
            console.error('Error fetching delivery time:', error);
            router.push('/');
        }
    }, [orderId, router, startCountdown]);

    useEffect(() => {
        if (!orderId) return;

        const storedData = getStoredData(DELIVERY_END_TIME_KEY, localStorage);
        const endTime = storedData?.[orderId];

        if (endTime && Number(endTime) > Date.now()) {
            startCountdown(Number(endTime));
        } else {
            fetchDeliveryEstimate()
        }

        return () => clearInterval(intervalRef.current);
    }, [orderId, fetchDeliveryEstimate, startCountdown]);

    useEffect(() => {
        if (!orderDetails || orderMarkedCompletedRef.current) return;

        const markOrderCompleted = async () => {
            try {
                const res = await fetch('/api/order', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId })
                });
                if (!res.ok) throw new Error('Failed to mark order completed');
                console.log('Order marked as completed');
                orderMarkedCompletedRef.current = true
            } catch (error) {
                console.error('Order completion API error:', error);
            }
        }

        markOrderCompleted();
    }, [orderDetails, orderId]);

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
                    <p><strong>Total Amount:</strong> {orderDetails.totalAmount}</p>
                    <p><strong>Delivery Address:</strong> {orderDetails.deliveryAddress}</p>
                    <h3>Items:</h3>
                    <ul>
                        {parsedItems.map(item => (
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