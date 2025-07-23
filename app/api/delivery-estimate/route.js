export async function POST(request) {
    try {
        const body = await request.json();
        const { start, end } = body;

        if (!start || !end || !start.lat || !start.lng || !end.lat || !end.lng) {
            return Response.json({ message: 'Invalid start or end coordinates provided.' }, { status: 400 });
        }

        const apiKey = process.env.OPENROUTESERVICE_API_KEY;
        if (!apiKey) {
            console.error('OpenRouteService API key is not configured.');
            return Response.json({ message: 'Server configuration error.' }, { status: 500 });
        }

        const orsBody = {
            coordinates: [
                [parseFloat(start.lng), parseFloat(start.lat)],
                [parseFloat(end.lng), parseFloat(end.lat)]
            ]
        };

        const orsResponse = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: apiKey,
            },
            body: JSON.stringify(orsBody)
        });

        if (!orsResponse.ok) {
            const errorData = await orsResponse.text();
            console.error('OpenRouteService API Error:', errorData);
            return Response.json({ message: 'OpenRouteService API failed.' }, { status: 502 });
        }

        const data = await orsResponse.json();
        const durationInSeconds = data.features[0].properties.summary.duration;
        const durationInMs = Math.ceil(durationInSeconds * 1000);

        return Response.json({ durationInMs }, { status: 200 });
    } catch (error) {
        console.error('Error fetching delivery time:', error.message);
        return Response.json({ message: 'Failed to fetch delivery estimate.' }, { status: 500 });
    }
}