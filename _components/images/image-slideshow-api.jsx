import ImageSlideshow from "./image-slideshow";
import { GetImagesOfMeals } from "@/app/api/meal/route";

const GetRecipesImage = async () => {
    const res = await GetImagesOfMeals();
    return <ImageSlideshow images={res} />;
}

export default GetRecipesImage