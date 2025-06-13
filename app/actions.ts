"use server";

import { redirect } from "next/navigation";
import { db } from './lib/db';
import { supabase } from "./lib/supabase";
import { revalidatePath } from "next/cache";
import path from "path";

export async function createAirbnbHome({ userId }: { userId: string }) {
  const data = await db.getHome(userId);

  if (data === null) {
    const data = await db.createHome({
      userId: userId,
    });

    return redirect(`/create/${data.id}/structure`);
  } else if (
    !data.addedCategory &&
    !data.addedDescription &&
    !data.addedLoaction
  ) {
    return redirect(`/create/${data.id}/structure`);
  } else if (data.addedCategory && !data.addedDescription) {
    return redirect(`/create/${data.id}/description`);
  } else if (
    data.addedCategory &&
    data.addedDescription &&
    !data.addedLoaction
  ) {
    return redirect(`/create/${data.id}/address`);
  } else if (
    data.addedCategory &&
    data.addedDescription &&
    data.addedLoaction
  ) {
    const data = await db.createHome({
      userId: userId,
    });

    return redirect(`/create/${data.id}/structure`);
  }
}

export async function createCategoryPage(formData: FormData) {
  const categoryName = formData.get("categoryName") as string;
  const homeId = formData.get("homeId") as string;
  const data = await db.updateHome(homeId, {
    categoryName: categoryName,
    addedCategory: true,
  });

  return redirect(`/create/${homeId}/description`);
}

export async function CreateDescription(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price");
  const imageFile = formData.get("image") as File;
  const homeId = formData.get("homeId") as string;

  const guestNumber = formData.get("guest") as string;
  const roomNumber = formData.get("room") as string;
  const bathroomsNumber = formData.get("bathroom") as string;

  const { data: imageData } = await supabase.storage
    .from("images")
    .upload(`${imageFile.name}-${new Date()}`, imageFile, {
      cacheControl: "2592000",
      contentType: "image/png",
    });

  const data = await db.updateHome(homeId, {
    title: title,
    description: description,
    price: Number(price),
    bedrooms: roomNumber,
    bathrooms: bathroomsNumber,
    guests: guestNumber,
    photo: imageData?.path,
    addedDescription: true,
  });

  return redirect(`/create/${homeId}/address`);
}

export async function createLocation(formData: FormData) {
  const homeId = formData.get("homeId") as string;
  const countryValue = formData.get("countryValue") as string;
  const data = await db.updateHome(homeId, {
    country: countryValue,
    addedLoaction: true,
  });

  return redirect("/");
}

export async function addToFavorite(formData: FormData) {
  const homeId = formData.get("homeId") as string;
  const userId = formData.get("userId") as string;
  const pathName = formData.get("pathName") as string;

  const data = await db.createFavorite({
    userId,
    homeId,
  });

  revalidatePath(pathName);
}

export async function DeleteFromFavorite(formData: FormData) {
  const favoriteId = formData.get("favoriteId") as string;
  const pathName = formData.get("pathName") as string;
  const userId = formData.get("userId") as string;

  const data = await db.deleteFavorite(favoriteId);

  revalidatePath(pathName);
}

export async function createReservation(
  userId: string,
  homeId: string,
  startDate: Date,
  endDate: Date
) {
  try {
    const data = await db.createReservation({
      userId,
      homeId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getHomeById(id: string) {
  try {
    const data = await db.getHome(id);
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function createHome(formData: FormData) {
  try {
    const data = await db.createHome({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      guests: formData.get('guests') as string,
      bedrooms: formData.get('bedrooms') as string,
      bathrooms: formData.get('bathrooms') as string,
      country: formData.get('country') as string,
      photo: formData.get('photo') as string,
      price: parseInt(formData.get('price') as string),
      categoryName: formData.get('categoryName') as string,
      addedCategory: false,
      addedDescription: false,
      addedLoaction: false,
      userId: formData.get('userId') as string,
    });
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function updateHomeCategory(id: string, categoryName: string) {
  try {
    const data = await db.updateHome(id, {
      categoryName,
      addedCategory: true,
    });
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function updateHomeDescription(id: string, description: string) {
  try {
    const data = await db.updateHome(id, {
      description,
      addedDescription: true,
    });
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function updateHomeLocation(id: string, country: string) {
  try {
    const data = await db.updateHome(id, {
      country,
      addedLoaction: true,
    });
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function createFavorite(userId: string, homeId: string) {
  try {
    const data = await db.createFavorite({
      userId,
      homeId,
    });
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function deleteFavorite(id: string) {
  try {
    await db.deleteFavorite(id);
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}
