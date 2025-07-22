'use client';

import { useEffect, useState } from 'react';
import classes from './orderTable.module.css';
import Link from 'next/link';

const OrderTable = ({ orders }) => {
    const [activeOrders, setActiveOrders] = useState({});

    useEffect(() => {
        const updateActiveOrders = () => {
            const storedData = JSON.parse(localStorage.getItem('delivery_end_time')) || {};
            const currentTime = Date.now();
            const active = {};

            Object.entries(storedData).forEach(([orderId, endTime]) => {
                if (currentTime < parseInt(endTime)) {
                    active[orderId] = true;
                }
            });

            setActiveOrders(active);
        };

        updateActiveOrders();
        const interval = setInterval(updateActiveOrders, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        orders.map(order => (
            <div key={order.orderId} className={classes.orderCard}>
                <p><strong>Order ID:</strong> {order.orderId}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
                <p><strong>Delivery Address:</strong> {order.deliveryAddress.replaceAll("\"", "")}</p>
                <h3>Items:</h3>
                <ul className={classes.itemsList}>
                    {JSON.parse(order.items).map(item => (
                        <li key={item.id} className={classes.item}>
                            <img src={item.image} alt={item.title} />
                            <div>
                                <p>{item.title}</p>
                                <p>Qty: {item.quantity}</p>
                                <p>Price: ₹{item.price}</p>
                                <p>Restaurant: {item.restaurantName}</p>
                            </div>
                        </li>
                    ))}
                </ul>

                {activeOrders[order.orderId] && (
                    <Link href={`/success/${order.orderId}`} className={classes.trackNowButton}>
                        Track Now
                    </Link>
                )}
            </div>
        ))
    )
}

export default OrderTable