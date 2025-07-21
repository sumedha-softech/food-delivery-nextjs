'use client';

import { useEffect, useState, useRef } from "react";
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

    const [selectedCoords, setSelectedCoords] = useState(null);
    const [locationLabel, setLocationLabel] = useState('');

    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

        setSelectedCoords({
            lat: suggestion.coordinates[1],
            lng: suggestion.coordinates[0],
        });
        setLocationLabel(suggestion.label);

        setShouldFetch(false);
        setSuggestions([]);
        setShowSuggestions(false);
    }

    const handleChange = (e) => {
        setInputValue(e.target.value);
        setShouldFetch(true);
        setShowSuggestions(true);
    };

    const handleMapSave = (location) => {
        setInputValue(location.label);
        onSelect(location);

        setSelectedCoords({
            lat: location.lat,
            lng: location.lng,
        });
        setLocationLabel(location.label);

        setShouldFetch(false);
        setSuggestions([]);
        setShowSuggestions(false);
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

                    {/* Suggestions Dropdown */}
                    {showSuggestions && (
                        <SuggestionList
                            suggestions={suggestions}
                            onSelect={handleSelect}
                            loading={loading}
                        />
                    )}
                </div>
                <div className={classes["map"]}>
                    {/* Separate Map Button */}
                    <button type="button" className={classes["map-button"]} onClick={() => setShowMap(true)}>
                        Select location using map
                    </button>
                </div>
            </div>

            {/* Map Modal */}
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

export default LocationAutocomplete