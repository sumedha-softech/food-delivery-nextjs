import sequelize from "@/config/database";
import { v4 as uuidv4 } from 'uuid';
import Order from "@/models/order";

export const CreateOrder = async (orderData) => {
    try {
        await sequelize.authenticate();

        const generatedOrderId = `ORD-${uuidv4().split('-')[0].toUpperCase()}`;

        const newOrder = await Order.create({
            orderId: generatedOrderId,
            transactionId: orderData.transactionId,
            totalAmount: orderData.totalAmount,
            items: JSON.stringify(orderData.items),
            deliveryAddress: JSON.stringify(orderData.deliveryAddress),
            status: orderData.status || 'processing'
        });

        return {
            orderId: newOrder.orderId,
            transactionId: newOrder.transactionId,
            status: newOrder.status
        }
    } catch (error) {
        console.error(error);
        throw new Error('Failed to create order');
    }
}

export const updateOrderTransactionId = async (orderId, transactionId, status = '') => {
    try {
        await sequelize.authenticate();
        await Order.update(
            {
                transactionId: transactionId || sequelize.col('transactionId'),
                status: status || sequelize.col('status')

            }, { where: { orderId } });

        console.log(`Order ${orderId} updated with transaction ID: ${transactionId}`);
    } catch (error) {
        console.error('Failed to update order transaction ID:', error);
    }
}

export const GetOrderByOrderId = async (orderId) => {
    try {
        await sequelize.authenticate();

        const order = await Order.findOne({
            where: { orderId }
        });
        if (!order) {
            throw new Error('Order not found');
        }

        return order;

    } catch (error) {
        console.error(error);
        throw new Error('Database error');
    }
}

export const GetAllOrders = async () => {
    try {
        await sequelize.authenticate();

        const orders = await Order.findAll({
            where: {
                status: 'completed'
            },
            order: [['createdDate', 'DESC']]
        });
        return Response.json(orders);
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch orders');
    }
}

export const PUT = async (req) => {
    try {
        const { orderId } = await req.json();
        if (!orderId) {
            return new Response('Missing orderId', { status: 400 });
        }

        await sequelize.authenticate();

        const order = await Order.findOne({ where: { orderId } });

        if (!order) {
            return new Response('Order not found', { status: 404 });
        }

        if (order.status === 'completed') {
            console.log(`Order ${orderId} is already completed.`);
            return new Response('Order already completed', { status: 200 });
        }

        await updateOrderTransactionId(orderId, '', 'completed');

        return new Response('Order marked as completed', { status: 200 });
    } catch (error) {
        console.error('Failed to update order:', error);
        return new Response('Internal server error', { status: 500 });
    }
}
