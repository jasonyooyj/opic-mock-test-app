"use client";

import { useEffect, useState, useRef } from "react";

interface TimerProps {
  initialSeconds: number;
  onTimeUp?: () => void;
  isRunning: boolean;
  phase?: "preparation" | "speaking";
  onPhaseComplete?: () => void;
}

export default function Timer({ 
  initialSeconds, 
  onTimeUp, 
  isRunning, 
  phase,
  onPhaseComplete 
}: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const onTimeUpRef = useRef(onTimeUp);
  const onPhaseCompleteRef = useRef(onPhaseComplete);

  // Keep the callback refs up to date
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    onPhaseCompleteRef.current = onPhaseComplete;
  }, [onPhaseComplete]);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // If it's preparation phase, call onPhaseComplete instead of onTimeUp
          if (phase === "preparation") {
            onPhaseCompleteRef.current?.();
          } else {
            onTimeUpRef.current?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase]);

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;
  const isLowTime = seconds < 30;
  const isPreparationPhase = phase === "preparation";

  return (
    <div className="flex flex-col items-center">
      {phase && (
        <div className={`text-xs sm:text-sm font-semibold mb-1 ${
          isPreparationPhase ? "text-blue-600" : "text-green-600"
        }`}>
          {isPreparationPhase ? "Preparation" : "Speaking"}
        </div>
      )}
      <div className={`text-3xl sm:text-4xl font-bold ${
        isLowTime ? "text-red-600" : isPreparationPhase ? "text-blue-600" : "text-gray-800"
      }`}>
        {String(minutes).padStart(2, "0")}:{String(displaySeconds).padStart(2, "0")}
      </div>
    </div>
  );
}

