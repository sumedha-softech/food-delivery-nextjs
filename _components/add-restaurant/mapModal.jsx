'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React, { useEffect, useState } from 'react';
import classes from './mapModal.module.css';
import GeocoderControl from './geoCoderControl';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DEFAULT_COORDS = { lat: 28.6139, lng: 77.2090 }; // Delhi fallback

const LocationMarker = ({ selectedCoords, onSelect }) => {
    useMapEvents({
        click(e) {
            onSelect(e.latlng);
        },
    });

    return selectedCoords ? <Marker position={selectedCoords} /> : null;
}

const MapModal = ({ onClose, onSave, defaultLat, defaultLng, defaultLabel }) => {
    const [locationLabel, setLocationLabel] = useState('');
    const [selectedCoords, setSelectedCoords] = useState(null);
    const [initialPosition, setInitialPosition] = useState(null);

    useEffect(() => {
        const setCoords = (coords) => {
            setInitialPosition(coords);
            setSelectedCoords(coords);
        };

        if (defaultLat && defaultLng) {
            setCoords({ lat: defaultLat, lng: defaultLng });
        } else if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setCoords({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                }),
                () => setCoords(DEFAULT_COORDS)
            );
        } else {
            setCoords(DEFAULT_COORDS);
        }
    }, [defaultLat, defaultLng]);

    const handleSave = () => {
        if (!selectedCoords || !locationLabel.trim()) return;

        onSave({
            label: locationLabel,
            coordinates: [selectedCoords.lng, selectedCoords.lat],
            lat: selectedCoords.lat,
            lng: selectedCoords.lng
        });
        onClose();
    };

    if (!initialPosition) return null;

    return (
        <div className={classes['map-overlay']} onClick={onClose}>
            <div className={classes['map-section']} onClick={(e) => e.stopPropagation()}>
                <MapContainer
                    center={initialPosition}
                    zoom={17}
                    scrollWheelZoom={true}
                    style={{ height: '400px', width: '100%' }}
                    className={classes.map}
                >

                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    />

                    <LocationMarker
                        selectedCoords={selectedCoords}
                        setSelectedCoords={setSelectedCoords}
                    />

                    <GeocoderControl setSelectedCoords={setSelectedCoords} />
                </MapContainer>

                <input
                    className={classes['location-label']}
                    type="text"
                    placeholder="Enter location label"
                    value={locationLabel}
                    onChange={(e) => setLocationLabel(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                    className={classes['location-save']}
                >
                    Save Location
                </button>
            </div>
        </div>
    )
};

export default MapModal;