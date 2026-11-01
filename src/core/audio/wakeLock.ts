/**
 * Screen Wake Lock utility to prevent mobile and desktop screens
 * from sleeping during guitar practice sessions.
 */

let wakeLockSentinel: WakeLockSentinel | null = null;

export async function requestWakeLock(): Promise<boolean> {
  if (typeof window === "undefined" || !("wakeLock" in navigator)) {
    return false;
  }

  try {
    if (!wakeLockSentinel || wakeLockSentinel.released) {
      wakeLockSentinel = await navigator.wakeLock.request("screen");
      wakeLockSentinel.addEventListener("release", () => {
        wakeLockSentinel = null;
      });
    }
    return true;
  } catch (err) {
    // Graceful fallback if wakeLock fails (e.g. low battery mode or background tab)
    console.debug("Wake lock could not be acquired:", err);
    return false;
  }
}

export async function releaseWakeLock(): Promise<void> {
  if (wakeLockSentinel && !wakeLockSentinel.released) {
    try {
      await wakeLockSentinel.release();
    } catch (err) {
      console.debug("Wake lock release error:", err);
    } finally {
      wakeLockSentinel = null;
    }
  }
}
