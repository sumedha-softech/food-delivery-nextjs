'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import classes from './success-client.module.css';
import { useRouter } from 'next/navigation';

const DELIVERY_END_TIME_KEY = 'delivery_end_time';
const CART_KEY = 'cart';
const ADDRESS_KEY = 'address';

const SuccessClient = ({ orderId }) => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null);
    const router = useRouter();
    const intervalRef = useRef(null);
    const orderMarkedCompletedRef = useRef(false);

    const parsedItems = useMemo(() => {
        if (!orderDetails?.items) return [];
        try {
            return JSON.parse(orderDetails.items);
        } catch (error) {
            console.error('Failed to parse order items:', error);
            return [];
        }
    }, [orderDetails])

    useEffect(() => {
        if (!orderId) return;

        const fetchOrderDetails = async () => {
            try {
                const res = await fetch(`/api/order/${orderId}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch order details');
                }
                const data = await res.json();
                setOrderDetails(data);
            } catch (error) {
                console.error('API Fetch Error:', error);
                router.push('/');
            }
        };

        fetchOrderDetails();
    }, [orderId, router]);

    const startCountdown = useCallback((endTime) => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            const now = Date.now();
            const diff = endTime - now;

            if (diff > 0) {
                setRemainingTime(diff);
            } else {
                clearInterval(intervalRef.current);
                try {
                    const storedData = JSON.parse(localStorage.getItem(DELIVERY_END_TIME_KEY)) || {};
                    if (storedData[orderId]) {
                        delete storedData[orderId];
                        localStorage.setItem(DELIVERY_END_TIME_KEY, JSON.stringify(storedData));
                    }
                } catch (error) {
                    console.error('Failed to cleanup delivery time from storage:', error);
                }
                router.push('/');
            }
        }, 1000);
    }, [orderId, router]);

    const fetchDeliveryEstimate = useCallback(async () => {
        const getStoredData = (key, storage) => {
            try {
                const item = storage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error(`Failed to parse ${key} from storage`, e);
                return null;
            }
        };

        const cartData = getStoredData(CART_KEY, localStorage);
        const addressData = getStoredData(ADDRESS_KEY, sessionStorage);

        const restaurantLat = cartData?.restaurantLat;
        const restaurantLng = cartData?.restaurantLng;
        const deliveryLat = addressData?.lat;
        const deliveryLng = addressData?.lng;

        if (isNaN(restaurantLat) || isNaN(restaurantLng) || isNaN(deliveryLat) || isNaN(deliveryLng)) {
            console.error('Invalid coordinates in cart or address');
            router.push('/');
            return;
        }

        if (restaurantLat && restaurantLng && deliveryLat && deliveryLng) {
            try {
                const response = await fetch('/api/delivery-estimate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        start: { lng: restaurantLng, lat: restaurantLat },
                        end: { lng: deliveryLng, lat: deliveryLat },
                    }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Delivery estimate fetch failed:', errorText);
                    throw new Error('Failed to fetch delivery estimate from server');
                }

                const { durationInMs } = await response.json();
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
        } else {
            router.push('/');
        }
    }, [orderId, router, startCountdown]);

    useEffect(() => {
        if (!orderId) return;

        try {
            const storedData = JSON.parse(localStorage.getItem(DELIVERY_END_TIME_KEY) || '{}');
            const endTime = storedData?.[orderId];

            if (endTime && Number(endTime) > Date.now()) {
                startCountdown(Number(endTime));
            } else {
                fetchDeliveryEstimate()
            }
        } catch (error) {
            console.error('Error handling delivery time from storage:', error);
            fetchDeliveryEstimate();
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
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