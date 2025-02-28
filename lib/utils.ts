import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isSameDay } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isValidArgPhone = (phone:string) => /^(11|2[2-9]|3[1-8]|6[1-8]|7[1-8])\d{7,8}$/.test(phone);
export const isValidMail = (email:string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

export const generateAccessCode = (length: number): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let accessCode = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    accessCode += characters.charAt(randomIndex);
  }

  return accessCode;
};

export const isSameDayFn = (date1: Date | string, date2: Date | string): boolean => {
  const bodyDate = new Date(date1);
  const certificateDate = new Date(date2);

  return isSameDay(bodyDate, certificateDate);
};

export const formatDate = (date: Date | string): string => {
  const newDate = new Date(date);
  return format(newDate, 'yyyy-MM-dd');
};

function getRandomLetter(): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

export const getProjectNumber = (name: string ) => {
  const words = name.trim().split(/\s+/)

  let prefix = words.map((word) => word.charAt(0).toUpperCase()).join("")

  prefix = prefix.slice(0, 3)

  const currentYear = new Date().getFullYear()

  const randomLetters = getRandomLetter() + getRandomLetter()

  return `${prefix}-${currentYear}-${randomLetters}`
}