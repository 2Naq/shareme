import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook to detect and manage PWA Service Worker updates (Major & Minor/Cache).
 *
 * Returns:
 *  - hasUpdate: boolean — true when a new SW version is waiting or manual update triggered
 *  - updateType: "auto" | "manual" — update trigger mode
 *  - isUpdating: boolean — true during the update process
 *  - updateProgress: number (0-100) — progress percentage
 *  - applyUpdate: () => Promise<void> — clears caches, activates new SW, reloads page
 *  - dismissUpdate: () => void — hides notification dialog
 */
export function useServiceWorkerUpdate() {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [updateType, setUpdateType] = useState("auto"); // "auto" (major) | "manual" (minor/cache)
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const waitingSwRef = useRef(null);
  const registrationRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator))
      return;

    function handleRegistration(registration) {
      registrationRef.current = registration;

      // Case 1: A new SW is already waiting (e.g. from a previous page load)
      if (registration.waiting) {
        waitingSwRef.current = registration.waiting;
        setUpdateType("auto");
        setHasUpdate(true);
        return;
      }

      // Case 2: A new SW starts installing
      if (registration.installing) {
        trackInstalling(registration.installing);
      }

      // Case 3: Listen for future updates
      registration.addEventListener("updatefound", () => {
        const newSw = registration.installing;
        if (newSw) {
          trackInstalling(newSw);
        }
      });
    }

    function trackInstalling(sw) {
      sw.addEventListener("statechange", () => {
        if (sw.state === "installed" && navigator.serviceWorker.controller) {
          // New SW installed and waiting — there's an update available
          waitingSwRef.current = sw;
          setUpdateType("auto");
          setHasUpdate(true);
        }
      });
    }

    // If registration already happened (from inline script in index.html)
    if (window.__swRegistration) {
      handleRegistration(window.__swRegistration);
    }

    // Also listen for the custom event in case registration finishes later
    function onSwRegistered(e) {
      handleRegistration(e.detail);
    }
    window.addEventListener("sw-registered", onSwRegistered);

    // Listen for manual update trigger (e.g. from Sidebar button)
    function onManualCheck() {
      setDismissed(false);
      setUpdateType("manual");
      setHasUpdate(true);

      // Trigger background check on SW registration if available
      if (registrationRef.current) {
        registrationRef.current.update().catch(() => {});
      }
    }
    window.addEventListener("pwa-manual-update-check", onManualCheck);

    return () => {
      window.removeEventListener("sw-registered", onSwRegistered);
      window.removeEventListener("pwa-manual-update-check", onManualCheck);
    };
  }, []);

  const applyUpdate = useCallback(async () => {
    setIsUpdating(true);
    setUpdateProgress(0);

    // 1. Simulate smooth progress animation
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 10;
      if (progress >= 90) {
        progress = 90;
        clearInterval(interval);
      }
      setUpdateProgress(Math.min(Math.round(progress), 90));
    }, 120);

    try {
      // 2. Clear CacheStorage to purge old JS/CSS/asset bundles
      if ("caches" in window) {
        const cacheKeys = await window.caches.keys();
        await Promise.all(cacheKeys.map((key) => window.caches.delete(key)));
      }

      // 3. If there is a waiting Service Worker, tell it to skip waiting
      const waitingSw = waitingSwRef.current;
      if (waitingSw) {
        waitingSw.postMessage({ type: "SKIP_WAITING" });
      }
    } catch (err) {
      console.error("Error clearing caches during update:", err);
    }

    // 4. Complete progress to 100% and reload
    clearInterval(interval);
    setUpdateProgress(100);

    setTimeout(() => {
      window.location.reload();
    }, 450);
  }, []);

  const dismissUpdate = useCallback(() => {
    setDismissed(true);
  }, []);

  return {
    hasUpdate: hasUpdate && !dismissed,
    updateType,
    isUpdating,
    updateProgress,
    applyUpdate,
    dismissUpdate,
  };
}
