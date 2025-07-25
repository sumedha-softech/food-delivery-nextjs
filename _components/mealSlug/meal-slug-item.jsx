'use client';

import Image from 'next/image';
import { memo, useCallback, useEffect, useState } from 'react';
import { useCart } from '../cart/cart-context';
import classes from './meal-slug-item.module.css';

const QuantityCounter = ({ onRemove, onAdd, quantity }) => (
    <div className={classes.counter}>
        <button onClick={onRemove} aria-label="Decrease quantity">
            -
        </button>
        <span>{quantity}</span>
        <button onClick={onAdd} aria-label="Increase quantity">
            +
        </button>
    </div>
);

const ReplaceCartDialog = ({ onConfirm, onCancel }) => (
    <div className={classes.confirmBox}>
        <p>
            This item is from a different restaurant. Would you like to clear your
            current cart and add this item?
        </p>
        <button onClick={onConfirm}>Yes, Replace</button>
        <button onClick={onCancel}>No, Cancel</button>
    </div>
);

const MealSlugItem = memo(function MealSlugItem({
    id,
    image,
    title,
    summary,
    price,
    restaurantName,
    restaurantId,
    restaurantLat,
    restaurantLng }) {

    const { cartItems, addItem, removeItem, clearCart, restaurant } = useCart();
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingItem, setPendingItem] = useState(null);

    const currentQuantity = cartItems?.find(item => item.id === id)?.quantity || 0;

    const createItem = () => ({
        id,
        image,
        title,
        price,
        restaurantId,
        restaurantName,
    });

    const handleAdd = useCallback(() => {
        if (restaurant?.id && restaurant.id !== restaurantId) {
            setShowConfirm(true);
        } else {
            addItem(createItem(), restaurantId, restaurantLat, restaurantLng);
        }
    }, [restaurant?.id, restaurantId, addItem, restaurantLat, restaurantLng]);

    const handleRemove = useCallback(() => {
        removeItem(id);
    }, [id, removeItem]);

    const confirmReplace = useCallback(() => {
        setPendingItem(createItem());
        clearCart();
        setShowConfirm(false);
    }, [clearCart]);

    const cancelReplace = useCallback(() => {
        setShowConfirm(false);
    }, []);

    useEffect(() => {
        if (pendingItem && cartItems.length === 0 && !restaurant?.id) {
            addItem(pendingItem, pendingItem.restaurantId, restaurantLat, restaurantLng);
            setPendingItem(null);
        }
    }, [pendingItem, cartItems.length, restaurant?.id, addItem, restaurantLat, restaurantLng]);

    return (
        <>
            <Image src={image} alt={title} width={120} height={120} />

            <div className={classes.mealInfo}>
                <p>{title}</p>
                <br />
                <p>{summary}</p>

                <div className={classes.mealActions}>
                    <span>{Number(price)?.toFixed(2) || '—'}</span>

                    {currentQuantity === 0 ? (
                        <button className={classes.cartBtn} onClick={handleAdd}>
                            Add to Cart
                        </button>
                    ) : (
                        <QuantityCounter
                            onRemove={handleRemove}
                            onAdd={handleAdd}
                            quantity={currentQuantity}
                        />
                    )}
                </div>

                {showConfirm && (
                    <ReplaceCartDialog
                        onConfirm={confirmReplace}
                        onCancel={cancelReplace}
                    />
                )}
            </div>
        </>
    );
});

export default MealSlugItem;