'use client';

import Image from 'next/image';
import classes from './page.module.css';
import { useCart } from '@/_components/cart/cart-context';
import BackButton from '@/_components/backButton/backButton';

const Cart = () => {
    const { cartItems, addItem, removeItem, subtotal, tax, total, clearCart } = useCart();

    if (cartItems.length === 0) return (
        <>
            <BackButton />
            <main className="not-found">
                <p>Your cart is empty.</p>
            </main>
        </>
    )

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
                <p>Tax (10%): {tax.toFixed(2)}</p>
                <p><strong>Total: {total.toFixed(2)}</strong></p>
                <button className={classes["clear-cart"]} onClick={clearCart}>Clear Cart</button>
            </div>
        </div>
    )
}

export default Cart