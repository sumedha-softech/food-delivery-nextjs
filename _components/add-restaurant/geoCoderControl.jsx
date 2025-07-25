import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

const GeocoderControl = ({ setSelectedCoords }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const geocoder = L.Control.geocoder({
            defaultMarkGeocode: false,
        });

        const onGeocode = (e) => {
            const { center } = e.geocode.center;
            map.setView(center, 17);
            setSelectedCoords
        };

        geocoder.on('markgeocode', onGeocode).addTo(map);

        return () => {
            geocoder.off('markgeocode', onGeocode);
            map.removeControl(geocoder);
        }
    }, [map, setSelectedCoords]);

    return null;
};

export default GeocoderControl;