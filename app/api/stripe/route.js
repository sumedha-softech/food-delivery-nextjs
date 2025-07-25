import Stripe from 'stripe';
import { CreateOrder, updateOrderTransactionId } from '../order/route';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        const { items, tax, platformFee, deliveryAddress } = await request.json();
        const totalTaxAmount = parseFloat(tax || 0);
        const platformFeeAmount = parseFloat(platformFee || 0);
        const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
            + totalTaxAmount + platformFeeAmount;
        const order = await CreateOrder({
            transactionId: '',
            totalAmount,
            items,
            deliveryAddress,
            status: 'pending'
        });

        const orderId = order.orderId;
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                ...items.map(item => ({
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.title,
                        },
                        unit_amount: Math.round(item.price * 100),
                    },
                    quantity: item.quantity,
                })),
                {
                    price_data: {
                        currency: 'inr',
                        product_data: { name: 'GST (5%)' },
                        unit_amount: Math.round(totalTaxAmount * 100),
                    },
                    quantity: 1,
                },
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'Platform Fee',
                        },
                        unit_amount: Math.round(platformFeeAmount * 100),
                    },
                    quantity: 1,
                }
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success/${orderId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
        });
        await updateOrderTransactionId(orderId, session.id);

        return new Response(JSON.stringify({ sessionId: session.id, orderId }), { status: 200 });
    } catch (error) {
        console.error("Stripe API Error:", error);
        return new Response('Stripe session creation failed', { status: 500 });
    }
}
