import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const createIncrementIdGenerator = () => {
  let id = 0;
  return () => id++;
};

// call generateId()
export const generateId = createIncrementIdGenerator();
