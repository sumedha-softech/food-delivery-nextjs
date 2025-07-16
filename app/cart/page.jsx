'use client';

import Image from 'next/image';
import classes from './page.module.css';
import { useCart } from '@/_components/cart/cart-context';
import BackButton from '@/_components/backButton/backButton';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import AddressModal from '@/_components/delivery-address/addressModal';
import ModalContent from '@/_components/delivery-address/modalContent';
import AddNewAddressForm from '@/_components/delivery-address/addNewAddressForm';

const Cart = () => {
    const { cartItems, addItem, removeItem, subtotal, tax, total, clearCart } = useCart();
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);

    useEffect(() => {
        const storedAddress = sessionStorage.getItem('address');
        if (storedAddress) {
            setSelectedAddress(JSON.parse(storedAddress));
        }
    }, []);

    useEffect(() => {
        if (selectedAddress) {
            sessionStorage.setItem('address', JSON.stringify(selectedAddress));
        }
    }, [selectedAddress]);

    if (cartItems.length === 0) return (
        <>
            <BackButton />
            <main className="not-found">
                <p>Your cart is empty.</p>
            </main>
        </>
    )

    const checkoutHandler = async () => {
        console.log('Proceeding to checkout...');
        const stripe = await stripePromise;

        const response = await fetch('/api/stripe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: cartItems,
                tax: tax,
                platformFee: 5
            }),
        });

        const session = await response.json();

        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (result.error) {
            console.error(result.error.message);
        }
    }

    return (
        <div className={classes["cart-container"]}>
            <BackButton />
            <h2>Cart</h2>
            {cartItems.map(item => (
                <div key={item.id} className={classes["cart-item"]}>
                    <Image src={item.image} alt={item.title} className={classes["cart-img"]} width={80} height={80} />
                    <div>
                        <h3>{item.title}</h3>
                        <p>{item.price}</p>
                        <div className={classes["quantity-controls"]}>
                            <button onClick={() => removeItem(item.id)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => addItem(item, item.restaurantId)}>+</button>
                        </div>
                    </div>
                </div>
            ))}

            <div className={classes["cart-total"]}>
                <p>Subtotal: {subtotal.toFixed(2)}</p>
                <p>GST (5%): {tax.toFixed(2)}</p>
                <p>Platform fee: 5</p>
                <p><strong>Total: {total.toFixed(2)}</strong></p>

                {!selectedAddress ? (
                    <button className={classes["clear-cart"]} onClick={() => setIsModalOpen(true)}>
                        Select Delivery Address
                    </button>
                ) : (
                    <div style={{ marginBottom: '10px' }}>
                        <p><strong>Deliver to:</strong> {selectedAddress.address}</p>
                        <button className={classes["clear-cart"]} onClick={() => setIsModalOpen(true)}>Change Address</button>
                    </div>
                )}

                <div className={classes['cart-buttons']}>
                    <button className={classes["clear-cart"]} onClick={clearCart}>Clear Cart</button>
                    {selectedAddress && (
                        <button className={`${classes["clear-cart"]} ${classes.checkout}`} onClick={checkoutHandler}>
                            Proceed to Checkout
                        </button>
                    )}
                </div>
            </div>

            <AddressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalContent
                    onSelect={(address) => {
                        setSelectedAddress(address);
                        setIsModalOpen(false);
                    }}
                    onAddNew={() => {
                        setIsModalOpen(false);
                        setIsAddAddressModalOpen(true);
                    }}
                />
            </AddressModal>

            <AddressModal isOpen={isAddAddressModalOpen} onClose={() => setIsAddAddressModalOpen(false)}>
                <AddNewAddressForm
                    onSave={(newAddress) => {
                        setSelectedAddress(newAddress);
                        setIsAddAddressModalOpen(false);
                    }}
                    onClose={() => setIsModalOpen(false)}
                />
            </AddressModal>

        </div>
    )
}

export default Cart