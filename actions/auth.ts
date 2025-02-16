"use server";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function getUser() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch (error) {
    console.error("Error getting user", error);
    return null;
  }
}

export async function toggleFavorite() {
  const cookieStore = await cookies();
  const favoritesCookie = cookieStore.get("favorite");
  const itemId = favoritesCookie?.value;

  const supabase = await createAdminClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("Error al obtener el usuario");
      return;
    }

    const existingFavorites: string[] = user.user_metadata.favorites || [];
    const isFavorite = existingFavorites.includes(itemId!);

    const updatedFavorites = isFavorite
      ? existingFavorites.filter((fav) => fav !== itemId)
      : [...existingFavorites, itemId];

    const { data, error: updateError } =
      await supabase.auth.admin.updateUserById(user?.id, {
        user_metadata: {
          favorites: updatedFavorites.filter(e => e),
        },
      });

    if (updateError) {
      console.error(
        "Error al actualizar la metadata del usuario:",
        updateError,
      );
      return;
    }
    console.log("Metadata del usuario actualizada:", data);
    return true;
  } catch (error) {
    console.error("Error:", error);
  }
}
