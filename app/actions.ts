"use server";

import { redirect } from "next/navigation";
import { db } from './lib/db';
import { supabase } from "./lib/supabase";
import { revalidatePath } from "next/cache";
import path from "path";

export async function createSpaceWithUser({ userId }: { userId: string }) {
  const data = await db.getSpace(userId);

  if (data === null) {
    const data = await db.createSpace({
      user_id: userId,
      title: '',
      price_per_hour: 0,
      is_available: true,
    });
    return redirect(`/create/${data.id}/structure`);
  } else {
    return redirect(`/create/${data.id}/structure`);
  }
}

export async function createCategoryPage(formData: FormData) {
  const categoryName = formData.get("categoryName") as string;
  const spaceId = formData.get("spaceId") as string;
  const theCategoryId = await supabase
    .from('categories')
    .select('id')
    .eq('name', categoryName)
    .single()
    .then(res => res.data?.id);

  if (theCategoryId) {
    await supabase
      .from('space_categories')
      .upsert({ space_id: spaceId, category_id: theCategoryId });
  }

  return redirect(`/create/${spaceId}/description`);
}

export async function CreateDescription(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price");
  const imageFile = formData.get("image") as File;
  const spaceId = formData.get("spaceId") as string;

  const { data: imageData } = await supabase.storage
    .from("images")
    .upload(`${imageFile.name}-${new Date()}`, imageFile, {
      cacheControl: "2592000",
      contentType: "image/png",
    });

  const data = await db.updateSpace(spaceId, {
    title: title,
    description: description,
    price_per_hour: Number(price),
    images: [imageData?.path ?? ''],
  });

  return redirect(`/create/${spaceId}/address`);
}

export async function createLocation(formData: FormData) {
  const spaceId = formData.get("spaceId") as string;
  const locationValue = formData.get("locationValue") as string;
  const data = await db.updateSpace(spaceId, {
    location: locationValue,
  });

  return redirect("/");
}

export async function getSpaceById(id: string) {
  try {
    const data = await db.getSpace(id);
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function createSpace(formData: FormData) {
  try {
    const data = await db.createSpace({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price_per_hour: parseInt(formData.get('price_per_hour') as string),
      location: formData.get('location') as string,
      images: [],
      is_available: true,
      user_id: formData.get('user_id') as string,
    });
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function createBooking(formData: FormData) {
  try {
    const spaceId = formData.get("spaceId") as string;
    const userId = formData.get("userId") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const data = await db.createBooking({
      space_id: spaceId,
      user_id: userId,
      start_time: startTime,
      end_time: endTime,
    });
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function addToFavorite(formData: FormData) {
  const spaceId = formData.get("spaceId") as string;
  const userId = formData.get("userId") as string;
  const pathName = formData.get("pathName") as string;

  const data = await db.createFavorite({
    userId,
    spaceId,
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
  spaceId: string,
  startDate: Date,
  endDate: Date
) {
  try {
    const data = await db.createBooking({
      space_id: spaceId,
      user_id: userId,
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
    });
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getHomeById(id: string) {
  try {
    const data = await db.getSpace(id);
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function updateHomeCategory(id: string, categoryName: string) {
  try {
    const data = await db.updateSpace(id, {
      space_type: categoryName,
    });
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function updateHomeDescription(id: string, description: string) {
  try {
    const data = await db.updateSpace(id, {
      description,
    });
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function updateHomeLocation(id: string, country: string) {
  try {
    const data = await db.updateSpace(id, {
      location: country,
    });
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function createFavorite(userId: string, spaceId: string) {
  try {
    const data = await db.createFavorite({
      userId,
      spaceId,
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
