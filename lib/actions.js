'use server';

import { InsertRestaurant, UpdateRestaurant } from "@/app/api/restaurant/route";
import { InsertMeals, UpdateMeals } from "@/app/api/meal/route";
import { writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { InsertAddress } from "@/app/api/user/route";

const isInvalidText = (text) => {
    return !text || text.trim() === '';
}

export const addRestaurant = async (prevState, formData) => {
    const restaurant = {
        name: formData.get('name'),
        email: formData.get('email'),
        location: formData.get('location'),
        lat: formData.get('lat'),
        lng: formData.get('lng'),
        description: formData.get('description'),
        rating: formData.get('rating'),
        image: formData.get('image')
    }

    if (isInvalidText(restaurant.name)) return { message: "Restaurant Name is required." };
    if (isInvalidText(restaurant.email) || !restaurant.email.includes('@')) return { message: "Valid email is required." };
    if (isInvalidText(restaurant.location)) return { message: "Location is required." };
    if (isInvalidText(restaurant.lat) || isInvalidText(restaurant.lng)) return { message: "Valid coordinates are required." };
    if (isInvalidText(restaurant.description)) return { message: "Description is required." };
    if (isInvalidText(restaurant.rating)) return { message: "Rating is required." };
    if (!restaurant.image || restaurant.image.size === 0) return { message: "Image is required." };

    try {
        const imageBuffer = Buffer.from(await restaurant.image.arrayBuffer());
        const ext = path.extname(restaurant.image.name);
        const fileName = `${randomUUID()}${ext}`
        const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

        await writeFile(filePath, imageBuffer);

        restaurant.image = `/uploads/${fileName}`;

        const result = await InsertRestaurant(restaurant);
        if (result.status === 201) {
            return { message: "Restaurant saved successfully!" }
        } else {
            return { message: "Failed to save restaurant." }
        }
    } catch (error) {
        console.error("Error saving restaurant:", error);
        return { message: "An error occurred while saving the restaurant." };
    }
}

export const updateRestaurant = async (prevState, formData) => {
    const restaurant = {
        id: formData.get('id'),
        name: formData.get('name'),
        email: formData.get('email'),
        location: formData.get('location'),
        lat: formData.get('lat'),
        lng: formData.get('lng'),
        description: formData.get('description'),
        rating: formData.get('rating'),
        image: formData.get('existingImage')
    }

    const imageFile = formData.get('image');
    const isUpdate = !!restaurant.id;

    if (isInvalidText(restaurant.name)) return { message: "Restaurant Name is required." };
    if (isInvalidText(restaurant.email) || !restaurant.email.includes('@')) return { message: "Valid email is required." };
    if (isInvalidText(restaurant.location)) return { message: "Location is required." };
    if (isInvalidText(restaurant.lat) || isInvalidText(restaurant.lng)) return { message: "Valid coordinates are required." };
    if (isInvalidText(restaurant.description)) return { message: "Description is required." };
    if (isInvalidText(restaurant.rating)) return { message: "Rating is required." };

    try {
        if (imageFile && imageFile.size > 0) {
            const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
            const ext = path.extname(restaurant.image.name);
            const fileName = `${randomUUID()}${ext}`
            const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
            await writeFile(filePath, imageBuffer);
            restaurant.image = `/uploads/${fileName}`;
        }

        if (!restaurant.image && !isUpdate) {
            return { message: "Image is required." };
        }

        const result = await UpdateRestaurant(restaurant);
        if (result.status === 201 || result.status === 200) {
            return { message: "Restaurant updated successfully!" }
        } else {
            return { message: "Failed to update restaurant." }
        }
    } catch (error) {
        console.error("Error saving restaurant:", error);
        return { message: "An error occurred while saving the restaurant." };
    }
}

export const addMeal = async (prevState, formData) => {
    const meal = {
        name: formData.get('name'),
        restaurantId: formData.get('restaurantId'),
        description: formData.get('description'),
        price: formData.get('price'),
        image: formData.get('image')
    }

    if (isInvalidText(meal.name)) return { message: "Meal Name is required." };
    if (isInvalidText(meal.restaurantId)) return { message: "Restaurant is required." };
    if (isInvalidText(meal.description)) return { message: "Description is required." };
    if (isInvalidText(meal.price)) return { message: "Price is required." };
    if (!meal.image || meal.image.size === 0) return { message: "Image is required." };

    try {
        const imageBuffer = Buffer.from(await meal.image.arrayBuffer());
        const ext = path.extname(meal.image.name);
        const fileName = `${randomUUID()}${ext}`
        const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

        await writeFile(filePath, imageBuffer);

        meal.image = `/uploads/${fileName}`;

        const result = await InsertMeals(meal);
        if (result.status === 201) {
            return { message: "Meal saved successfully!" }
        } else if (result.status === 409) {
            return { message: "Meal already exists!" }
        } else {
            return { message: "Failed to save meal." }
        }
    } catch (error) {
        console.error("Error saving meal:", error);
        return { message: "An error occurred while saving the meal." };
    }
}

export const updateMeal = async (prevState, formData) => {
    const meal = {
        id: formData.get('id'),
        name: formData.get('name'),
        restaurantId: formData.get('restaurantId'),
        description: formData.get('description'),
        price: formData.get('price'),
        image: formData.get('existingImage')
    }

    const imageFile = formData.get('image');
    const isUpdate = !!meal.id;

    if (isInvalidText(meal.name)) return { message: "Meal Name is required." };
    if (isInvalidText(meal.restaurantId)) return { message: "Restaurant is required." };
    if (isInvalidText(meal.description)) return { message: "Description is required." };
    if (isInvalidText(meal.price)) return { message: "Price is required." };

    try {
        if (imageFile && imageFile.size > 0) {
            const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
            const ext = path.extname(meal.image.name);
            const fileName = `${randomUUID()}${ext}`
            const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
            await writeFile(filePath, imageBuffer);
            meal.image = `/uploads/${fileName}`;
        }

        if (!meal.image && !isUpdate) {
            return { message: "Image is required." };
        }

        const result = await UpdateMeals(meal);
        if (result.status === 201 || result.status === 200) {
            return { message: "Meal updated successfully!" }
        } else {
            return { message: "Failed to updated meal." }
        }
    } catch (error) {
        console.error("Error updated meal:", error);
        return { message: "An error occurred while updated the meal." };
    }
}

export const addDeliveryAddress = async (prevState, formData) => {
    debugger;
    const address = {
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        postalCode: formData.get('postalCode'),
        country: formData.get('country'),
        lat: formData.get('lat'),
        lng: formData.get('lng')
    }

    if (isInvalidText(address.address)) return { message: "Address is required." };
    if (isInvalidText(address.city)) return { message: "City is required." };
    if (isInvalidText(address.state)) return { message: "State is required." };
    if (isInvalidText(address.postalCode)) return { message: "Postal Code is required." };
    if (isInvalidText(address.lat) || isInvalidText(address.lng)) return { message: "Valid coordinates are required." };

    try {
        const result = await InsertAddress(address);
        if (result.status === 201) {
            return { message: "Address saved successfully!", address }
        } else {
            return { message: "Failed to save address." }
        }
    } catch (error) {
        console.error("Error saving address:", error);
        return { message: "An error occurred while saving the address." };
    }
}