'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import dynamic from 'next/dynamic';
import SuggestionList from "./suggestionList";
import classes from './locationAutocomplete.module.css'

const MapModal = dynamic(() => import('./mapModal'), { ssr: false });

const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/search';

const LocationAutocomplete = ({ onSelect, defaultValue }) => {
    const [inputValue, setInputValue] = useState(defaultValue || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedCoords, setSelectedCoords] = useState(null);
    const [locationLabel, setLocationLabel] = useState('');

    const wrapperRef = useRef(null);
    const fetchController = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (defaultValue) {
            setInputValue(defaultValue);
        }
    }, [defaultValue]);

    useEffect(() => {
        if (inputValue.length < 3) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            setLoading(true);
            fetchController.current?.abort();
            fetchController.current = new AbortController();

            try {
                const res = await fetch(
                    `${NOMINATIM_API_URL}?q=${encodeURIComponent(inputValue)}&format=json&limit=5`,
                    { signal: fetchController.current.signal }
                );

                const data = await res.json();

                const results = Array.from(
                    new Map(data.map(item => {
                        const key = `${item.display_name}-${item.lat}-${item.lon}`;
                        return [key, {
                            label: item.display_name,
                            coordinates: [parseFloat(item.lon), parseFloat(item.lat)]
                        }];
                    }))
                ).map(([_, value]) => value);

                setSuggestions(results);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error fetching suggestions: ', error);
                }
            } finally {
                setLoading(false);
            }
        };

        const delay = setTimeout(fetchSuggestions, 100);
        return () => {
            clearTimeout(delay);
            fetchController.current?.abort();
        }
    }, [inputValue]);

    const applyLocation = useCallback((label, coordinates) => {
        setInputValue(label);
        setLocationLabel(label);
        setSelectedCoords({ lat: coordinates[1], lng: coordinates[0] });
        setShowSuggestions(false);
        onSelect({
            label,
            coordinates
        });
    }, [onSelect]);

    const handleChange = (e) => {
        setInputValue(e.target.value);
        setShowSuggestions(true);
    };

    const handleSelect = (suggestion) => {
        applyLocation(suggestion.label, suggestion.coordinates);
    };

    const handleMapSave = ({ label, lat, lng }) => {
        applyLocation(label, [lng, lat]);
    };

    return (
        <div ref={wrapperRef} className={classes["location-field"]}>
            <div className={classes.location}>
                <div className={classes["search-field"]}>
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
                            loading={loading}
                        />
                    )}
                </div>
                <div className={classes["map"]}>
                    <button type="button" className={classes["map-button"]} onClick={() => setShowMap(true)}>
                        Select location using map
                    </button>
                </div>
            </div>

            {showMap && (
                <MapModal
                    onClose={() => setShowMap(false)}
                    onSave={handleMapSave}
                    defaultLat={selectedCoords?.lat}
                    defaultLng={selectedCoords?.lng}
                    defaultLabel={locationLabel}
                />
            )}
        </div>
    )
}

export default LocationAutocomplete;