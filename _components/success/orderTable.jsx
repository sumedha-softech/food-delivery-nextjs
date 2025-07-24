'use client';

import { useEffect, useState, useMemo } from 'react';
import OrderCard from './orderCard';

const OrderTable = ({ orders }) => {
    const [activeOrders, setActiveOrders] = useState({});

    const processedOrders = useMemo(() => {
        if (!orders) return [];
        return orders.map(order => ({
            ...order,
            items: JSON.parse(order.items),
            deliveryAddress: order.deliveryAddress.replaceAll("\"", "")
        }));
    }, [orders])

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
        processedOrders.map(order => (
            <OrderCard key={order.orderId} order={order} isActive={!!activeOrders[order.orderId]} />
        ))
    )
}

export default OrderTable;