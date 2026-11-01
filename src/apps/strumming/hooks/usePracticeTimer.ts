import { useState, useEffect, useRef, useCallback } from "react";
import { PracticeTimerStatus } from "../types";

export interface UsePracticeTimerProps {
  initialDurationSeconds?: number;
  isPlaying: boolean;
  onComplete?: () => void;
}

export function usePracticeTimer({
  initialDurationSeconds = 300, // 5 minutes
  isPlaying,
  onComplete,
}: UsePracticeTimerProps) {
  const [targetDurationSeconds, setTargetDuration] = useState<number>(initialDurationSeconds);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(initialDurationSeconds);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [status, setStatus] = useState<PracticeTimerStatus>("idle");
  const [isAlertDismissed, setIsAlertDismissed] = useState<boolean>(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Sync remaining seconds if target duration changes while idle
  const setDuration = useCallback((seconds: number) => {
    const clamped = Math.max(10, Math.min(7200, Math.round(seconds)));
    setTargetDuration(clamped);
    setRemainingSeconds(clamped);
    setElapsedSeconds(0);
    setStatus("idle");
    setIsAlertDismissed(false);
  }, []);

  const resetTimer = useCallback(() => {
    setRemainingSeconds(targetDurationSeconds);
    setElapsedSeconds(0);
    setStatus("idle");
    setIsAlertDismissed(false);
  }, [targetDurationSeconds]);

  // Main countdown tick interval
  useEffect(() => {
    if (!isPlaying) {
      if (status === "running") {
        setStatus("paused");
      }
      return;
    }

    if (status !== "completed") {
      setStatus("running");
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          // Timer reached 00:00
          setStatus("completed");
          onCompleteRef.current?.();
          return 0;
        }
        return prev - 1;
      });

      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, status]);

  const dismissAlert = useCallback(() => {
    setIsAlertDismissed(true);
  }, []);

  return {
    targetDurationSeconds,
    remainingSeconds,
    elapsedSeconds,
    status,
    isCompleted: status === "completed",
    isAlertDismissed,
    setDuration,
    resetTimer,
    dismissAlert,
  };
}
