import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook to detect and manage PWA Service Worker updates.
 *
 * Returns:
 *  - hasUpdate: boolean — true when a new SW version is waiting
 *  - isUpdating: boolean — true during the update process
 *  - updateProgress: number (0-100) — simulated progress percentage
 *  - applyUpdate: () => void — triggers the SW update + page reload
 *  - dismissUpdate: () => void — hides the notification temporarily
 */
export function useServiceWorkerUpdate() {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const waitingSwRef = useRef(null);

  useEffect(() => {
    // Bail out if SW is not supported
    if (!("serviceWorker" in navigator)) return;

    function handleRegistration(registration) {
      // Case 1: A new SW is already waiting (e.g. from a previous page load)
      if (registration.waiting) {
        waitingSwRef.current = registration.waiting;
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

    return () => {
      window.removeEventListener("sw-registered", onSwRegistered);
    };
  }, []);

  const applyUpdate = useCallback(() => {
    const waitingSw = waitingSwRef.current;
    if (!waitingSw) return;

    setIsUpdating(true);
    setUpdateProgress(0);

    // Simulate progress animation while waiting for SW to activate
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 12 + 3; // increment 3-15% each tick
      if (progress >= 95) {
        progress = 95; // hold at 95% until reload
        clearInterval(interval);
      }
      setUpdateProgress(Math.min(Math.round(progress), 95));
    }, 150);

    // Listen for the new SW to take control
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      clearInterval(interval);
      setUpdateProgress(100);
      // Small delay to show 100% before reload
      setTimeout(() => {
        window.location.reload();
      }, 400);
    });

    // Tell the waiting SW to activate
    waitingSw.postMessage({ type: "SKIP_WAITING" });
  }, []);

  const dismissUpdate = useCallback(() => {
    setDismissed(true);
  }, []);

  return {
    hasUpdate: hasUpdate && !dismissed,
    isUpdating,
    updateProgress,
    applyUpdate,
    dismissUpdate,
  };
}
