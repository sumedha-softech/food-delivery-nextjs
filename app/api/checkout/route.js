import { CreateOrder } from '../order/route';

export async function POST(request) {
    try {
        const { items, tax, platformFee, deliveryAddress } = await request.json();
        const totalTaxAmount = parseFloat(tax || 0);
        const platformFeeAmount = parseFloat(platformFee || 0);

        const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
            + totalTaxAmount + platformFeeAmount;

        const order = await CreateOrder({
            transactionId: 'fake-checkout',
            totalAmount,
            items,
            deliveryAddress,
            status: 'pending',
        });

        return new Response(JSON.stringify({ orderId: order.orderId }), { status: 200 });
    } catch (error) {
        console.error("Fake checkout error:", error);
        return new Response('Order creation failed', { status: 500 });
    }
};
