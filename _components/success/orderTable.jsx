'use client';

import { useEffect, useState } from 'react';
import classes from './orderTable.module.css';
import Link from 'next/link';

const OrderTable = ({ orders }) => {
    const [activeOrders, setActiveOrders] = useState({});

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('delivery_end_time'));
        if (storedData && storedData.orderId && storedData.endTime) {
            const currentTime = Date.now();
            if (currentTime < parseInt(storedData.endTime)) {
                setActiveOrders(prev => ({
                    ...prev,
                    [storedData.orderId]: true
                }));
            }
        }
    }, []);

    return (
        orders.map(order => (
            <div key={order.orderId} className={classes.orderCard}>
                <p><strong>Order ID:</strong> {order.orderId}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
                <p><strong>Delivery Address:</strong> {JSON.parse(order.deliveryAddress)}</p>
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