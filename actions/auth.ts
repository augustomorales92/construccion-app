'use server'

import { createAdminClient, createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export default async function getUser() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    return user
  } catch (error) {
    console.error('Error getting user', error)
    return null
  }
}

export async function getLoggedInUser() {
  try {
    const supabase = await createClient()

    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !authUser) {
      console.warn('No authenticated user found:', authError?.message)
      return null
    }

    const { data: user, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (dbError) {
      console.error('Error getting user from database:', dbError.message)
      return null
    }

    return user
  } catch (error) {
    console.error('Unexpected error getting user:', error)
    return null
  }
}

export async function toggleUserFavorite(id?: string) {
  const cookieStore = await cookies()
  const favoritesCookie = cookieStore.get('favorite')
  const itemId = id ?? favoritesCookie?.value

  const supabase = await createAdminClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error('Error al obtener el usuario')
      return
    }

    const existingFavorites: string[] = user.user_metadata.favorites || []
    const isFavorite = existingFavorites.includes(itemId!)

    const updatedFavorites = isFavorite
      ? existingFavorites.filter((fav) => fav !== itemId)
      : [...existingFavorites, itemId]

    const { data, error: updateError } =
      await supabase.auth.admin.updateUserById(user?.id, {
        user_metadata: {
          favorites: updatedFavorites.filter((e) => e),
        },
      })

    if (updateError) {
      console.error('Error al actualizar la metadata del usuario:', updateError)
      return true
    }
    console.log(
      'Metadata del usuario actualizada:',
      data.user.user_metadata?.favorites,
    )
    revalidatePath('/protected/constructions/[id]')
    revalidatePath('/constructions/[id]')
    return true
  } catch (error) {
    console.error('Error:', error)
  }
}

export async function updateProfileAction(
  id: string,
  prevState: { error?: string; success?: string } | null | undefined,
  formData: FormData,
) {
  const supabase = await createAdminClient()

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  ;``
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.admin.updateUserById(id, {
      email: email,
      user_metadata: {
        name: name,
        phone: phone,
      },
    })

    if (error) {
      console.error('Error actualizando el perfil:', error)
      return { error: 'Error actualizando el perfil' }
    }
    console.log('Perfil actualizado:', user)
    revalidatePath('/protected/profile')

    return { success: 'Perfil actualizado' }
  } catch (error) {
    console.error('Error actualizando el perfil:', error)
  }
}

export async function updateRole(role: string) {
  const supabase = await createAdminClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error('Error al obtener el usuario')
      return
    }

    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        role: role,
      },
    })
  } catch (error) {
    console.error('Error actualizando el rol:', error)
  }
}

export async function updatePasswordAction(
  id: string,
  formData: FormData,
  prevState: { error?: string; success?: string } | null | undefined,
) {
  const supabase = await createAdminClient()

  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string
  try {
    if (newPassword !== confirmPassword) {
      return { error: 'Las contraseñas no coinciden' }
    }

    const { error } = await supabase.auth.admin.updateUserById(id, {
      password: newPassword,
    })

    if (error) {
      console.error('Error actualizando la contraseña:', error)
      return { error: 'Error actualizando la contraseña' }
    }
    console.log('Contraseña actualizada')
    revalidatePath('/protected/profile')
  } catch (error) {
    console.error('Error actualizando la contraseña:', error)
  }
}

export async function updateAvatarAction(
  id: string,
  formData: FormData,
  prevState: { error?: string; success?: string } | null | undefined,
) {
  const supabase = await createAdminClient()
  const avatar = formData.get('avatar') as string

  try {
    const { error, data } = await supabase.auth.admin.updateUserById(id, {
      user_metadata: {
        avatar: avatar,
      },
    })
    if (error) {
      console.error('Error actualizando el avatar:', error)
      return { error: 'Error actualizando el avatar' }
    }
    console.log('Avatar actualizado:', data)
    revalidatePath('/protected/profile')
    return { success: 'Avatar actualizado' }
  } catch (error) {
    console.error('Error actualizando el avatar:', error)
  }
}
