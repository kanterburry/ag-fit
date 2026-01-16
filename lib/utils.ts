import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getURL() {
    // 1. Prioritize APP_URL
    let url = process?.env?.NEXT_PUBLIC_APP_URL || '';

    // 2. Fallback to Vercel's URL
    if (!url && process?.env?.NEXT_PUBLIC_VERCEL_URL) {
        url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    }

    // 3. Fallback to window.location.origin
    if (!url && typeof window !== 'undefined') {
        url = window.location.origin;
    }

    // 4. Last fallback
    if (!url) {
        url = 'http://localhost:3000/';
    }

    // Ensure it doesn't accidentally point to localhost in production browser
    if (typeof window !== 'undefined' && url.includes('localhost') && !window.location.origin.includes('localhost')) {
        url = window.location.origin;
    }

    url = url.endsWith('/') ? url : `${url}/`;
    return url;
}
