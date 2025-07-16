import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    console.log(process.env.STRIPE_SECRET_KEY);
    const { items, tax, platformFee } = await request.json();

    const totalTaxAmount = parseFloat(tax || 0);
    const platformFeeAmount = parseFloat(platformFee || 0);

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
                    unit_amount:  Math.round(platformFeeAmount * 100),
                },
                quantity: 1,
            }
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    return Response.json({ id: session.id });
}
