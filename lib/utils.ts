import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getURL() {
    // 1. Prioritize explicitly defined APP_URL
    let url = process?.env?.NEXT_PUBLIC_APP_URL || '';

    // 2. Fallback to Vercel's automatic URL if in production/preview
    if (!url && process?.env?.NEXT_PUBLIC_VERCEL_URL) {
        url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    }

    // 3. Last fallback for local development
    if (!url) {
        url = 'http://localhost:3000/';
    }

    // Make sure to include a trailing `/`.
    url = url.endsWith('/') ? url : `${url}/`;
    return url;
}
