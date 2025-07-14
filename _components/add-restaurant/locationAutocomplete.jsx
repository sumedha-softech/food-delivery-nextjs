'use client';

import { useEffect, useState } from "react";
import SuggestionList from "./suggestionList";
import dynamic from 'next/dynamic';
import classes from './locationAutocomplete.module.css'

const MapModal = dynamic(() => import('./mapModal'), { ssr: false });


const LocationAutocomplete = ({ onSelect, defaultValue, lat, lng }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [shouldFetch, setShouldFetch] = useState(true);
    const [showMap, setShowMap] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (defaultValue) {
            setInputValue(defaultValue);
        }
    }, [defaultValue]);

    useEffect(() => {
        const controller = new AbortController();

        const fetchSuggestions = async () => {
            if (!shouldFetch || inputValue.length < 3) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(inputValue)}&format=json&limit=5`, { signal: controller.signal });

                const data = await res.json();

                const results = [
                    ...new Map(
                        data.map(item => {
                            const name = item.display_name;
                            const lat = parseFloat(item.lat);
                            const long = parseFloat(item.lon);
                            const key = `${name}-${lat}-${long}`;
                            return [
                                key,
                                {
                                    label: name,
                                    coordinates: [long, lat]
                                }
                            ];
                        })
                    ).values()
                ];

                setSuggestions(results);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error fetching suggestions: ', error);
                }
            } finally {
                setLoading(false);
            }
        };

        const timeOut = setTimeout(fetchSuggestions, 100);
        return () => {
            clearTimeout(timeOut);
            controller.abort();
        }
    }, [inputValue, shouldFetch]);

    const handleSelect = (suggestion) => {
        setInputValue(suggestion.label);
        onSelect(suggestion);
        setShouldFetch(false);
        setSuggestions([]);
        setShowSuggestions(false);
    }

    const handleChange = (e) => {
        setInputValue(e.target.value);
        setShouldFetch(true);
        setShowSuggestions(true);
    };

    const handleMapConfirm = () => {
        setShowMap(true);
    };

    const handleMapSave = (location) => {
        setInputValue(location.label);
        onSelect(location);
        setShouldFetch(false);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <div className={classes["location-field"]}>
            <input
                type="text"
                value={inputValue}
                id="location"
                name="location"
                placeholder="Search for location..."
                onChange={handleChange}
                required
                autoComplete="off"
            />

            {showSuggestions && (
                <SuggestionList
                    suggestions={suggestions}
                    onSelect={handleSelect}
                    onMapSelect={handleMapConfirm}
                    showFallback={inputValue.length >= 3 && suggestions.length === 0}
                    loading={loading}
                />
            )}

            {showMap && (
                <MapModal
                    onClose={() => setShowMap(false)}
                    onSave={handleMapSave}
                    defaultLat={lat}
                    defaultLng={lng}
                    defaultLabel={defaultValue}
                />
            )}
        </div>
    )
}

export default LocationAutocomplete