import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isValidArgPhone = (phone:string) => /^(11|2[2-9]|3[1-8]|6[1-8]|7[1-8])\d{7,8}$/.test(phone);
export const isValidMail = (email:string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
