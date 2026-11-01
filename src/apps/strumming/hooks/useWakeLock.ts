import { useEffect } from "react";
import { requestWakeLock, releaseWakeLock } from "@/core/audio/wakeLock";

/**
 * React hook that manages Screen Wake Lock during active practice.
 * Acquires lock when isPlaying is true, releases when paused/stopped.
 */
export function useWakeLock(isPlaying: boolean): void {
  useEffect(() => {
    if (isPlaying) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => {
      releaseWakeLock();
    };
  }, [isPlaying]);
}
