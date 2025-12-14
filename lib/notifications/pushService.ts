"use client";

import { urlBase64ToUint8Array } from "./utils";
import { saveSubscription } from "@/app/actions/notifications";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export async function subscribeUserToPush() {
    if (!("serviceWorker" in navigator)) {
        console.warn("Service Workers not supported");
        return { success: false, error: "Not supported" };
    }

    if (!("PushManager" in window)) {
        console.warn("Push API not supported");
        return { success: false, error: "Not supported" };
    }

    if (!PUBLIC_KEY) {
        console.error("VAPID Public Key key not found");
        return { success: false, error: "Config Error" };
    }

    try {
        const registration = await navigator.serviceWorker.ready;

        // Check if already subscribed
        const existingSub = await registration.pushManager.getSubscription();
        if (existingSub) {
            console.log("User already subscribed:", existingSub);
            // Optional: Sync with DB again to be sure
            await saveSubscription(existingSub.toJSON() as any);
            return { success: true, subscription: existingSub };
        }

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY),
        });

        console.log("Subscribed:", subscription);

        // Save to DB
        await saveSubscription(subscription.toJSON() as any);

        return { success: true, subscription };
    } catch (error) {
        console.error("Subscription failed:", error);
        return { success: false, error: "Failed to subscribe" };
    }
}
