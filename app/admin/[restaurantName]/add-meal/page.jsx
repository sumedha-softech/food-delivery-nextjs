'use client';

import ImagePicker from '@/_components/meals/image-picker'
import classes from './page.module.css'
import { addMeal } from '@/lib/actions'
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import BackButton from '@/_components/backButton/backButton';

const AddMeal = () => {
    const [state, formAction] = React.useActionState(addMeal, { message: null });

    const router = useRouter();
    const { restaurantName } = useParams();

    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchMeals = async (slug) => {
        try {
            const res = await fetch(`/api/restaurant/${slug}`);
            if (!res.ok) throw new Error('Failed to fetch restaurant');
            const data = await res.json();
            setRestaurant(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (restaurantName) {
            fetchMeals(restaurantName);
        }
    }, [restaurantName]);

    useEffect(() => {
        if (state.message === "Meal saved successfully!") {
            router.push(`/admin/${restaurantName}`);
        }
    }, [state.message, router]);

    return (
        <>
            <header className={classes.header}>
                <BackButton />
                <h1>
                    Add your <span className={classes.highlight}>meal</span>
                </h1>
                <p>List your meal in your particular restaurant!</p>
            </header>
            <main className={classes.main}>
                {loading ? (
                    <p className={classes.loader}>Loading meal details...</p>
                ) : (
                    <form className={classes.form} action={formAction}>
                        <input type="hidden" id="restaurantId" name="restaurantId" value={restaurant?.id || ''} />
                        <div className={classes.row}>
                            <p>
                                <label htmlFor="name">Meal Name</label>
                                <input type="text" id="name" name="name" required />
                            </p>
                            <p>
                                <label htmlFor="restaurantName">Restaurant</label>
                                <input type="text" id="restaurantName" name="restaurantName" value={restaurant?.name || ''} required readOnly disabled />
                            </p>
                        </div>
                        <p>
                            <label htmlFor="description">Description</label>
                            <textarea name="description" id="description" rows="5" required></textarea>
                        </p>
                        <p>
                            <label htmlFor="price">Price</label>
                            <input type="text" id="price" name="price" step="0.1" required />
                        </p>
                        <ImagePicker label="Meal Image" name="image" />

                        {state.message && <p>{state.message}</p>}

                        <p className={classes.actions}>
                            <button type="submit">Create Meal</button>
                        </p>
                    </form>
                )}
            </main>
        </>
    )
}

export default AddMeal