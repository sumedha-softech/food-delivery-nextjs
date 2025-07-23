'use client';

import ImagePicker from '@/_components/meals/image-picker'
import classes from './page.module.css'
import { updateMeal } from '@/lib/actions'
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import BackButton from '@/_components/backButton/backButton';

const AddMeal = () => {
    const [state, formAction] = React.useActionState(updateMeal, { message: null });

    const router = useRouter();
    const { restaurantName } = useParams();
    const { mealSlug } = useParams();

    const [meal, setMeal] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchMeal = async (name) => {
        try {
            const res = await fetch(`/api/meal/${name}`);

            if (!res.ok) {
                throw new Error('Meal not found');
            }

            const data = await res.json();
            setRestaurant(data.name);
            setMeal(data.recipes[0]);
        } catch (error) {
            console.error('Failed to fetch meal:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (mealSlug) {
            fetchMeal(mealSlug)
        }
    }, [mealSlug]);

    useEffect(() => {
        if (state.message === "Meal updated successfully!") {
            router.push(`/admin/${restaurantName}`);
        }
    }, [state.message, router]);

    return (
        <>
            <header className={classes.header}>
                <BackButton />
                <h1>
                    Edit your <span className={classes.highlight}>meal</span>
                </h1>
                <p>Update meal details.</p>
            </header>
            <main className={classes.main}>
                {loading ? (
                    <p className={classes.loader}>Loading restaurant details...</p>
                ) : (
                    <form className={classes.form} action={formAction}>
                        <input type='hidden' name="id" defaultValue={meal?.id || ''} />
                        <input type='hidden' name="restaurantId" defaultValue={meal?.restaurant_id || ''} />
                        <div className={classes.row}>
                            <p>
                                <label htmlFor="name">Meal Name</label>
                                <input type="text" id="name" name="name" defaultValue={meal?.title || ''} required />
                            </p>
                            <p>
                                <label htmlFor="restaurantName">Restaurant</label>
                                <input type="text" id="restaurantName" name="restaurantName" value={restaurant || ''} required readOnly disabled />
                            </p>
                        </div>
                        <p>
                            <label htmlFor="description">Description</label>
                            <textarea name="description" id="description" rows="5" defaultValue={meal?.summary || ''} required></textarea>
                        </p>
                        <p>
                            <label htmlFor="price">Price</label>
                            <input type="text" id="price" name="price" step="0.1" defaultValue={meal?.price || ''} required />
                        </p>
                        <ImagePicker label="Meal Image" name="image" existingImage={meal?.image} />

                        {state.message && <p>{state.message}</p>}

                        <p className={classes.actions}>
                            <button type="submit">Update Meal</button>
                        </p>
                    </form>
                )}
            </main >
        </>
    )
}

export default AddMeal