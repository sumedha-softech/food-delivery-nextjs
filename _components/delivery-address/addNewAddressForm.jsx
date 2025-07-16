'use client';

import React, { useEffect, useState } from 'react';
import LocationAutocomplete from '../add-restaurant/locationAutocomplete';
import { addDeliveryAddress } from '@/lib/actions';
import classes from './addNewAddressForm.module.css';

const AddNewAddressForm = ({ onSave }) => {
    const [state, formAction] = React.useActionState(addDeliveryAddress, { message: null, address: null });
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        if (state.message === "Address saved successfully!" && state?.address) {
            onSave(state.address);
        }
    }, [state.message, onSave]);

    return (
        <form className={classes['form-container']} action={formAction}>
            <h3>Add New Address</h3>

            <div>
                <label>Address</label>
                <LocationAutocomplete onSelect={(location) => setSelectedLocation(location)} />
                {selectedLocation && (
                    <>
                        <input type="hidden" name="address" value={selectedLocation.label} />
                        <input type="hidden" name="lat" value={selectedLocation.coordinates[1]} />
                        <input type="hidden" name="lng" value={selectedLocation.coordinates[0]} />
                    </>
                )}
            </div>

            <div>
                <label>City</label>
                <input type="text" id='city' name='city' required />
            </div>

            <div>
                <label>State</label>
                <input type="text" id='state' name='state' required />
            </div>

            <div>
                <label>Postal Code</label>
                <input type="text" id='postalCode' name='postalCode' required />
            </div>

            <div>
                <label>Country</label>
                <input type="text" id='country' name='country' required />
            </div>

            {state.message && <p>{state.message}</p>}

            <button type="submit" style={{ marginTop: '10px' }}>
                Save Address
            </button>
        </form>
    );
}

export default AddNewAddressForm