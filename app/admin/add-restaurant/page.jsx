'use client';

import ImagePicker from '@/_components/meals/image-picker'
import classes from './page.module.css'
import { addRestaurant } from '@/lib/actions'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LocationAutocomplete from '@/_components/add-restaurant/locationAutocomplete';
import BackButton from '@/_components/backButton/backButton';

const AddRestaurant = () => {
    const [state, formAction] = React.useActionState(addRestaurant, { message: null });
    const [selectedLocation, setSelectedLocation] = useState(null);

    const router = useRouter();

    useEffect(() => {
        if (state.message === "Restaurant saved successfully!") {
            router.push('/admin/restaurant');
        }
    }, [state.message, router]);

    return (
        <>
            <header className={classes.header}>
                <BackButton />
                <h1>
                    Add <span className={classes.highlight}>restaurant</span>
                </h1>
                <p>List your restaurant to reach more food lovers!</p>
            </header>
            <main className={classes.main}>
                <form className={classes.form} action={formAction}>
                    <div className={classes.row}>
                        <p>
                            <label htmlFor="name">Restaurant Name</label>
                            <input type="text" id="name" name="name" required />
                        </p>
                        <p>
                            <label htmlFor="email">Restaurant Email</label>
                            <input type="email" id="email" name="email" required />
                        </p>
                    </div>
                    <div>
                        <label htmlFor="location">Location</label>
                        <LocationAutocomplete onSelect={(location) => setSelectedLocation(location)} />
                        {selectedLocation && (
                            <>
                                <input type="hidden" name="location" value={selectedLocation.label} />
                                <input type="hidden" name="lat" value={selectedLocation.coordinates[1]} />
                                <input type="hidden" name="lng" value={selectedLocation.coordinates[0]} />
                            </>
                        )}
                    </div>
                    <p>
                        <label htmlFor="description">Description</label>
                        <textarea name="description" id="description" rows="5" required></textarea>
                    </p>
                    <p>
                        <label htmlFor="rating">Rating</label>
                        <input type="number" id="rating" name="rating" step="0.1" min="0" max="5" />
                    </p>
                    <ImagePicker label="Restaurant Image" name="image" />

                    {state.message && <p>{state.message}</p>}

                    <p className={classes.actions}>
                        <button type="submit">Create Restaurant</button>
                    </p>
                </form>
            </main >
        </>
    )
}

export default AddRestaurant