'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import classes from './page.module.css';

const SuccessPage = () => {
    const [deliveryTime, setDeliveryTime] = useState(null);

    useEffect(() => {
        // Simulate dynamic delivery time estimate between 20-45 mins
        const estimate = Math.floor(Math.random() * (45 - 20 + 1)) + 20;
        setDeliveryTime(estimate);

        localStorage.removeItem('cart');
    }, []);

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
