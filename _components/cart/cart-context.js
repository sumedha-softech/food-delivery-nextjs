'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();
const TAX_RATE = 0.05;

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [], restaurantId: null, restaurantLat: null, restaurantLng: null });

    useEffect(() => {
        const stored = localStorage.getItem('cart');
        if (stored) setCart(JSON.parse(stored));
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addItem = (item, restaurantId, restaurantLat, restaurantLng) => {
        if (cart.restaurantId && cart.restaurantId !== restaurantId) {
            return { conflict: true };
        }

        const existingItem = cart.items.find(i => i.id === item.id);
        let updatedItems;
        if (existingItem) {
            updatedItems = cart.items.map(i =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
        } else {
            updatedItems = [...cart.items, { ...item, quantity: 1 }];
        }

        setCart({
            items: updatedItems,
            restaurantId,
            restaurantLat,
            restaurantLng
        });
        return { conflict: false };
    };

    const removeItem = (itemId) => {
        const updatedItems = cart.items.map(item =>
            item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        ).filter(item => item.quantity > 0);
        setCart({ ...cart, items: updatedItems });
    };

    const clearCart = () => setCart({ items: [], restaurantId: null, restaurantLat: null, restaurantLng: null });

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * TAX_RATE;
    const platformFee = 5;
    const total = subtotal + tax + platformFee;

    return (
        <CartContext.Provider value={{
            cart,
            cartItems: cart.items,
            restaurant: {
                id: cart.restaurantId,
            },
            subtotal,
            tax,
            total,
            addItem,
            removeItem,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};