import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getURL() {
    // 0. Client-side absolute priority: the current window origin
    if (typeof window !== 'undefined') {
        const origin = window.location.origin;
        console.log('[getURL] Client-side detected origin:', origin);

        // EXTRA HARDENING: If we are in the browser but NOT on localhost, 
        // ensure we never return a localhost URL derived from env vars.
        return origin.endsWith('/') ? origin : `${origin}/`;
    }

    // 1. Prioritize APP_URL (Server-side)
    let url = process?.env?.NEXT_PUBLIC_APP_URL || '';
    if (url) {
        console.log('[getURL] Server-side APP_URL:', url);
    }

    // 2. Fallback to Vercel's URL
    if (!url && process?.env?.NEXT_PUBLIC_VERCEL_URL) {
        url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
        console.log('[getURL] Server-side Vercel URL fallback:', url);
    }

    // 3. Final fallback
    if (!url) {
        url = 'http://localhost:3000/';
    }

    url = url.endsWith('/') ? url : `${url}/`;
    return url;
}

