'use server'

import prisma from '@/lib/db'
import { Customer, Manager } from '@/lib/types'
import { revalidate, unstable_cache } from '@/lib/unstable_cache'
import { revalidatePath } from 'next/cache'
import getUser from './auth'

export async function createCustomer(data: Omit<Customer, 'id'>) {
  try {
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    })
    revalidatePath('/customers')
    return { success: true, data: customer }
  } catch (error) {
    console.error('Error creating customer:', error)
    return { success: false, error: 'Failed to create customer' }
  }
}

export async function updateCustomer(id: string, data: Partial<Customer>) {
  try {
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    })
    revalidatePath('/customers')
    return { success: true, data: customer }
  } catch (error) {
    console.error('Error updating customer:', error)
    return { success: false, error: 'Failed to update customer' }
  }
}

export async function deleteCustomer(id?: string) {
  try {
    await prisma.customer.delete({
      where: { id },
    })
    revalidatePath('/customers')
    return { success: true }
  } catch (error) {
    console.error('Error deleting customer:', error)
    return { success: false, error: 'Failed to delete customer' }
  }
}

export const getCustomers = unstable_cache(
  async () => {
    try {
      const user = await getUser()
      if (!user) {
        return { success: false, error: 'Unauthorized' }
      }
      const customers = await prisma.customer.findMany({
        where: {
          users: {
            some: {
              id: user.id,
            },
          },
        },
      })
      return { success: true, data: customers }
    } catch (error) {
      console.error('Error getting customers:', error)
      return { success: false, error: 'Failed to get customers' }
    }
  },
  ['customers'],
  { revalidate },
)

export async function createManager(data: Omit<Manager, 'id'>) {
  try {
    const manager = await prisma.manager.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    })
    revalidatePath('/managers')
    return { success: true, data: manager }
  } catch (error) {
    console.error('Error creating manager:', error)
    return { success: false, error: 'Failed to create manager' }
  }
}

export async function updateManager(id: string, data: Partial<Manager>) {
  try {
    const manager = await prisma.manager.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    })
    revalidatePath('/managers')
    return { success: true, data: manager }
  } catch (error) {
    console.error('Error updating manager:', error)
    return { success: false, error: 'Failed to update manager' }
  }
}

export async function deleteManager(id?: string) {
  try {
    await prisma.manager.delete({
      where: { id },
    })
    revalidatePath('/managers')
    return { success: true }
  } catch (error) {
    console.error('Error deleting manager:', error)
    return { success: false, error: 'Failed to delete manager' }
  }
}

export const getManagers = unstable_cache(
  async () => {
    try {
      const user = await getUser()
      if (!user) {
        return { success: false, error: 'Unauthorized' }
      }
      const managers = await prisma.manager.findMany({
        where: {
          users: {
            some: {
              id: user.id,
            },
          },
        },
      })
      return { success: true, data: managers }
    } catch (error) {
      console.error('Error getting managers:', error)
      return { success: false, error: 'Failed to get managers' }
    }
  },
  ['managers'],
  { revalidate },
)
