'use client';

import Image from 'next/image'
import classes from './meal-slug-item.module.css'
import { useEffect, useState } from 'react';
import { useCart } from '../cart/cart-context';

const MealSlugItem = ({ id, image, title, summary, price, restaurantName, restaurantId }) => {
    const { cartItems, addItem, removeItem, clearCart, restaurant } = useCart();
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingItem, setPendingItem] = useState(null);

    const currentQuantity = cartItems?.find(item => item.id === id)?.quantity || 0;

    const handleAdd = () => {
        if (restaurant?.id && restaurant.id !== restaurantId) {
            setShowConfirm(true);
        } else {
            addItem({ id, image, title, price, restaurantId, restaurantName }, restaurantId);
        }
    };

    const confirmReplace = () => {
        setPendingItem({ id, image, title, price, restaurantId, restaurantName });
        clearCart();
        setShowConfirm(false);
    };

    const cancelReplace = () => setShowConfirm(false);

    useEffect(() => {
        if (pendingItem && cartItems.length === 0 && restaurant?.id === null) {
            addItem(pendingItem, pendingItem.restaurantId);
            setPendingItem(null);
        }
    }, [cartItems, restaurant?.id, pendingItem, addItem]);

    return (
        <>
            <Image src={image} alt={title} width={120} height={120} />
            <div className={classes.mealInfo}>
                <p>{title}</p>
                <br />
                <p>{summary}</p>
                <div className={classes.mealActions}>
                    <span>{price?.toFixed(2) || '—'}</span>
                    {currentQuantity === 0 ? (
                        <button className={classes.cartBtn} onClick={handleAdd}>Add to Cart</button>
                    ) : (
                        <div className={classes.counter}>
                            <button onClick={() => removeItem(id)}>-</button>
                            <span>{currentQuantity}</span>
                            <button onClick={handleAdd}>+</button>
                        </div>
                    )}
                </div>
                {showConfirm && (
                    <div className={classes.confirmBox}>
                        <p>This item is from another restaurant. Replace cart?</p>
                        <button onClick={confirmReplace}>Yes</button>
                        <button onClick={cancelReplace}>No</button>
                    </div>
                )}
            </div>
        </>
    )
}

export default MealSlugItem