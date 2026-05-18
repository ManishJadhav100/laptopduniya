"use client";

import { useEffect, useState } from "react";

interface CountdownActionProps {
  seconds: number;
  href: string;
  pendingLabel: string;
  readyLabel: string;
  className?: string;
  processingLabel?: string;
  onReadyClick?: () => Promise<void> | void;
}

export default function CountdownAction({
  seconds,
  href,
  pendingLabel,
  readyLabel,
  className = "",
  processingLabel = "Preparing secure redirect...",
  onReadyClick,
}: CountdownActionProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(seconds);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRemainingSeconds((currentValue) => {
        if (currentValue <= 1) {
          window.clearInterval(intervalId);
          return 0;
        }

        return currentValue - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [seconds]);

  const isLocked = remainingSeconds > 0;
  const isDisabled = isLocked || isProcessing;

  async function handleClick() {
    if (isDisabled) return;

    setErrorMessage("");
    setIsProcessing(true);

    try {
      await onReadyClick?.();
      window.location.assign(href);
    } catch (error) {
      console.error("Countdown action failed", error);
      setErrorMessage("Please wait on page 1 and try again.");
      setIsProcessing(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        disabled={isDisabled}
        onClick={handleClick}
        className={`flex min-h-14 w-full items-center justify-center rounded-2xl px-4 py-4 text-center text-[11px] font-black uppercase leading-tight tracking-[0.16em] transition-all sm:px-6 sm:text-sm sm:tracking-[0.2em] ${
          isDisabled
            ? "cursor-not-allowed bg-gray-200 text-gray-500"
            : "bg-[#10B981] text-white shadow-xl shadow-emerald-500/20 hover:bg-[#059669]"
        } ${className}`}
      >
        {isLocked
          ? `${pendingLabel} ${remainingSeconds}s`
          : isProcessing
            ? processingLabel
            : readyLabel}
      </button>

      {errorMessage ? (
        <p className="text-center text-xs font-bold text-red-500" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
