import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import { useEffect } from 'react';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

const GeocoderControl = ({ setSelectedCoords }) => {
    const map = useMap();

    useEffect(() => {
        const geocoder = L.Control.geocoder({
            defaultMarkGeocode: false,
        })
        .on('markgeocode', function(e) {
            const center = e.geocode.center;
            map.setView(center, 17);
            setSelectedCoords(center);
        })
        .addTo(map);

        return () => map.removeControl(geocoder);
    }, [map, setSelectedCoords]);

    return null;
};

export default GeocoderControl;
