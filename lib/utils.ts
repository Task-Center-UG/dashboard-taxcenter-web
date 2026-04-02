import { API_BASE_URL } from "@/constant/constant";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (path: string | null) => {
  if (!path) return "https://placehold.net/400x400.png";
  if (path.startsWith("blob:")) return path;
  if (path.startsWith("http")) return path;

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};
