import sequelize from "@/config/database";
import UserAddress from "@/models/userAddress";

const GetAddress = async () => {
    await sequelize.authenticate();
    return await UserAddress.findAll();
}

export const InsertAddress = async (addressData) => {
    try {
        await sequelize.authenticate();

        const newAddress = await UserAddress.create({
            address: addressData.address,
            city: addressData.city,
            state: addressData.state,
            postalCode: addressData.postalCode,
            country: addressData.country,
            lat: addressData.lat,
            lng: addressData.lng
        });

        return new Response(JSON.stringify(newAddress), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response('Failed to insert address', { status: 500 });
    }
}

export const GET = async () => {
    try {
        const addresses = await GetAddress();
        return Response.json(addresses);
    } catch (error) {
        console.error(error);
        return new Response("Failed to fetch addresses", { status: 500 });
    }
}
