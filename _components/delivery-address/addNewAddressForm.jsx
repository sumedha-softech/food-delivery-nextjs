'use client';

import React, { useCallback, useEffect, useState } from 'react';
import LocationAutocomplete from '../add-restaurant/locationAutocomplete';
import { addDeliveryAddress } from '@/lib/actions';
import classes from './addNewAddressForm.module.css';

const COUNTRY = 'India';

const AddNewAddressForm = ({ onSave }) => {
    const [state, formAction] = React.useActionState(addDeliveryAddress, { message: null, address: null });
    const [selectedLocation, setSelectedLocation] = useState(null);

    const [statesList, setStatesList] = useState([]);
    const [citiesList, setCitiesList] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [manualStateCitySelected, setManualStateCitySelected] = useState(false);

    // Fetch States
    useEffect(() => {
        fetchStates();
    }, []);

    const fetchStates = useCallback(async () => {
        try {
            const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country: COUNTRY }),
            });
            const data = await res.json();
            if (data?.data?.states) {
                setStatesList(data.data.states.map(item => item.name));
            }
        } catch (error) {
            console.error('Failed to fetch states:', error);
        }
    }, []);

    const fetchCities = useCallback(async (stateName) => {
        try {
            const res = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country: COUNTRY, state: stateName }),
            });
            const data = await res.json();
            if (data?.data) {
                setCitiesList(data.data);
                return data.data;
            }
            return [];
        } catch (error) {
            console.error('Failed to fetch cities:', error);
            return [];
        }
    }, []);

    useEffect(() => {
        if (selectedState) {
            fetchCities(selectedState);
            setSelectedCity('');
        } else {
            setCitiesList([]);
            setSelectedCity('');
        }
    }, [selectedState, fetchCities]);

    useEffect(() => {
        if (state.message === "Address saved successfully!" && state?.address) {
            onSave(state.address);
        }
    }, [state, onSave]);

    const handlePincodeBlur = async (e) => {
        if (manualStateCitySelected) return;

        const pincode = e.target.value.trim();
        if (pincode.length < 5) return;

        try {
            const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await res.json();
            const postOffice = data[0]?.PostOffice?.[0];

            if (data[0]?.Status === "Success" && postOffice) {
                const { State: detectedState, District: detectedCity } = postOffice;

                if (statesList.includes(detectedState)) {
                    setSelectedState(detectedState);

                    const cities = await fetchCities(detectedState);
                    if (cities.includes(detectedCity)) {
                        setSelectedCity(detectedCity);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch pincode details:', error);
        }
    };

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
                <label>Country</label>
                <input type="text" id='country' name='country' value="India" disabled required />
            </div>
            <div>
                <label>Postal Code</label>
                <input type="text" id='postalCode' name='postalCode' onBlur={handlePincodeBlur} required />
            </div>
            <div>
                <label>State</label>
                <select id='state' name='state' value={selectedState}
                    onChange={(e) => {
                        setSelectedState(e.target.value);
                        setSelectedCity('');
                        setManualStateCitySelected(true);
                    }} required>
                    <option value="">Select State</option>
                    {statesList.map((stateName) => (
                        <option key={stateName} value={stateName}>{stateName}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>City</label>
                <select id='city' name='city' value={selectedCity}
                    onChange={(e) => {
                        setSelectedCity(e.target.value);
                        setManualStateCitySelected(true);
                    }} required
                    disabled={!citiesList.length}>
                    <option value="">Select City</option>
                    {citiesList.map((cityName) => (
                        <option key={cityName} value={cityName}>{cityName}</option>
                    ))}
                </select>
            </div>

            {state.message && <p>{state.message}</p>}

            <button type="submit" style={{ marginTop: '10px' }}>
                Save Address
            </button>
        </form>
    );
}

export default AddNewAddressForm