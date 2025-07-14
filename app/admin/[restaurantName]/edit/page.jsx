'use client';

import ImagePicker from '@/_components/meals/image-picker'
import classes from './page.module.css'
import { addRestaurant, updateRestaurant } from '@/lib/actions'
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import LocationAutocomplete from '@/_components/add-restaurant/locationAutocomplete';
import BackButton from '@/_components/backButton/backButton';

const Share = () => {
    const [state, formAction] = React.useActionState(addRestaurant, { message: null });

    const [stateUpdate, formActionUpdate] = React.useActionState(updateRestaurant, { message: null });

    const router = useRouter();
    const { restaurantName } = useParams();

    const [formData, setFormData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const fetchRestaurant = async (slug) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/restaurant/${slug}`);
            if (!res.ok) {
                throw new Error('Restaurant not found');
            }

            const data = await res.json();
            setFormData(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (restaurantName) {
            fetchRestaurant(restaurantName);
        }
    }, [restaurantName]);

    useEffect(() => {
        if (state.message === "Restaurant saved successfully!" || stateUpdate.message === "Restaurant updated successfully!") {
            router.push(`/admin/${restaurantName}`);
        }
    }, [state.message, stateUpdate.message, router]);

    return (
        <>
            <header className={classes.header}>
                <BackButton />
                <h1>
                    {restaurantName ? 'Edit' : 'Add'} <span className={classes.highlight}>restaurant</span>
                </h1>
                <p>{restaurantName ? 'Update restaurant details.' : 'List your restaurant to reach more food lovers!'}</p>
            </header>
            <main className={classes.main}>
                {isLoading ? (
                    <p className={classes.loader}>Loading restaurant details...</p>
                ) : (
                    <form className={classes.form} action={restaurantName ? formActionUpdate : formAction}>
                        <input type='hidden' name="id" defaultValue={formData?.id || ''} />
                        <div className={classes.row}>
                            <p>
                                <label htmlFor="name">Restaurant Name</label>
                                <input type="text" id="name" name="name" defaultValue={formData?.name || ''} required />
                            </p>
                            <p>
                                <label htmlFor="email">Restaurant Email</label>
                                <input type="email" id="email" name="email" defaultValue={formData?.email || ''} required />
                            </p>
                        </div>
                        <div>
                            <label htmlFor="location">Location</label>
                            <LocationAutocomplete onSelect={(location) => setSelectedLocation(location)} defaultValue={formData?.location || ''} lat={formData?.lat || ''} lng={formData?.lng || ''} />
                            {selectedLocation || (formData?.location && formData?.lat && formData?.lng) && (
                                <>
                                    <input type="hidden" name="location" value={selectedLocation?.label ?? formData?.location} />
                                    <input type="hidden" name="lat" value={selectedLocation?.coordinates[1] ?? formData?.lat} />
                                    <input type="hidden" name="lng" value={selectedLocation?.coordinates[0] ?? formData?.lng} />
                                </>
                            )}
                        </div>
                        <p>
                            <label htmlFor="description">Description</label>
                            <textarea name="description" id="description" defaultValue={formData?.description || ''} rows="5" required></textarea>
                        </p>
                        <p>
                            <label htmlFor="rating">Rating</label>
                            <input type="number" id="rating" name="rating" step="0.1" min="0" max="5" defaultValue={formData?.rating || ''} />
                        </p>
                        <ImagePicker label="Restaurant Image" name="image" existingImage={formData?.image} />

                        {state.message && <p>{state.message}</p>}

                        <p className={classes.actions}>
                            <button type="submit">{restaurantName ? 'Update Restaurant' : 'Create Restaurant'}</button>
                        </p>
                    </form>
                )}
            </main>
        </>
    )
}

export default Share