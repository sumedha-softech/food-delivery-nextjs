'use client';

import React, { useEffect, useState } from 'react';
import LocationAutocomplete from '../add-restaurant/locationAutocomplete';
import { addDeliveryAddress } from '@/lib/actions';
import classes from './addNewAddressForm.module.css';

const COUNTRY = 'India';

const AddNewAddressForm = ({ onSave }) => {
    const [state, formAction] = React.useActionState(addDeliveryAddress, {
        message: null,
        address: null
    });

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [statesList, setStatesList] = useState([]);
    const [citiesList, setCitiesList] = useState([]);

    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [manualSelection, setManualSelection] = useState(false);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ country: COUNTRY }),
                });
                const data = await res.json();
                if (data?.data?.states) {
                    setStatesList(data.data.states.map((s) => s.name));
                }
            } catch (error) {
                console.error('Failed to fetch states:', error);
            }
        };

        fetchStates();
    }, []);

    useEffect(() => {
        if (!selectedState) {
            setCitiesList([]);
            setSelectedCity('');
            return;
        }

        const fetchCities = async () => {
            try {
                const res = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ country: COUNTRY, state: selectedState }),
                });
                const data = await res.json();
                if (data?.data) {
                    setCitiesList(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch cities:', error);
            }
        };

        fetchCities();
    }, [selectedState]);

    const handlePincodeBlur = async (e) => {
        if (manualSelection) return;

        const pincode = e.target.value.trim();
        if (pincode.length < 5) return;

        try {
            const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await res.json();
            const postOffice = data[0]?.PostOffice?.[0];

            if (data[0]?.Status === "Success" && postOffice) {
                const { State, District } = postOffice;

                if (statesList.includes(State)) {
                    setSelectedState(State);

                    const cityRes = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ country: COUNTRY, state: State }),
                    });
                    const cityData = await cityRes.json();
                    const cities = cityData?.data || [];

                    setCitiesList(cities);
                    if (cities.includes(District)) {
                        setSelectedCity(District);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch pincode details:', error);
        }
    };

    useEffect(() => {
        if (state.message === 'Address saved successfully!' && state.address) {
            onSave(state.address);
        }
    }, [state, onSave]);

    return (
        <form className={classes['form-container']} action={formAction}>
            <h3>Add New Address</h3>
            <div>
                <label htmlFor="location">Address</label>
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
                <label htmlFor="country">Country</label>
                <input type="text" id='country' name='country' value={COUNTRY} disabled required />
            </div>
            <div>
                <label htmlFor="postalCode">Postal Code</label>
                <input type="text" id='postalCode' name='postalCode' onBlur={handlePincodeBlur} required />
            </div>
            <div>
                <label htmlFor="state">State</label>
                <select
                    id='state'
                    name='state'
                    value={selectedState}
                    onChange={(e) => {
                        setSelectedState(e.target.value);
                        setSelectedCity('');
                        setManualSelection(true);
                    }}
                    required
                >
                    <option value="">Select State</option>
                    {statesList.map((stateName) => (
                        <option key={stateName} value={stateName}>
                            {stateName}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="city">City</label>
                <select
                    id='city'
                    name='city'
                    value={selectedCity}
                    onChange={(e) => {
                        setSelectedCity(e.target.value);
                        setManualSelection(true);
                    }}
                    required
                    disabled={!citiesList.length}
                >
                    <option value="">Select City</option>
                    {citiesList.map((cityName) => (
                        <option key={cityName} value={cityName}>
                            {cityName}
                        </option>
                    ))}
                </select>
            </div>

            {state.message && <p>{state.message}</p>}

            <button type="submit" style={{ marginTop: '10px' }}>
                Save Address
            </button>
        </form>
    );
};

export default AddNewAddressForm;