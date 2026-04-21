"use client";

import { useEffect, useState } from "react";
import { Clock3, Pause, Play, RotateCcw } from "lucide-react";

type PomodoroCounterProps = {
  workMinutes?: number;
  breakMinutes?: number;
  completedPomodoros?: number;
  onSessionComplete?: (mode: "work" | "break") => void;
  className?: string;
  variant?: "default" | "compact";
};

type TimerMode = "work" | "break";

const DEFAULT_WORK_MINUTES = 25;
const DEFAULT_BREAK_MINUTES = 5;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function PomodoroCounter({
  workMinutes = DEFAULT_WORK_MINUTES,
  breakMinutes = DEFAULT_BREAK_MINUTES,
  completedPomodoros = 0,
  onSessionComplete,
  className = "",
  variant = "default",
}: PomodoroCounterProps) {
  const [mode, setMode] = useState<TimerMode>("work");
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(completedPomodoros);
  const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);

  useEffect(() => {
    if (!isRunning) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current > 1) return current - 1;

        window.clearInterval(timer);
        setIsRunning(false);

        if (mode === "work") {
          setSessionCount((count) => count + 1);
          onSessionComplete?.("work");
          setMode("break");
          return breakMinutes * 60;
        }

        onSessionComplete?.("break");
        setMode("work");
        return workMinutes * 60;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, mode, workMinutes, breakMinutes, onSessionComplete]);

  const progress =
    mode === "work"
      ? 1 - secondsLeft / (workMinutes * 60)
      : 1 - secondsLeft / (breakMinutes * 60);

  const handleReset = () => {
    setIsRunning(false);
    setMode("work");
    setSecondsLeft(workMinutes * 60);
    setSessionCount(completedPomodoros);
  };

  const toggleMode = (nextMode: TimerMode) => {
    setIsRunning(false);
    setMode(nextMode);
    setSecondsLeft(nextMode === "work" ? workMinutes * 60 : breakMinutes * 60);
  };

  return (
    <section
      className={
        variant === "compact"
          ? `w-full rounded-[22px] border border-white/10 bg-white/5 p-4 text-[#f6f1e9] shadow-[0_16px_50px_rgba(0,0,0,0.18)] ${className}`
          : `w-full max-w-md rounded-3xl border border-white/10 bg-[#1f1f24] p-6 text-[#f6f1e9] shadow-[0_24px_80px_rgba(0,0,0,0.28)] ${className}`
      }
    >
      {variant === "compact" ? (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.34em] text-emerald-200/70">
                Pomodoro
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isRunning ? "bg-emerald-300" : "bg-amber-300"
                  }`}
                />
                <p className="text-sm font-medium text-[#f6f1e9]">
                  {mode === "work" ? "Focus" : "Break"} mode
                </p>
              </div>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-[#d9d1c6]">
              {sessionCount} done
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  className="fill-none stroke-white/10"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  className="fill-none stroke-[#b3a5ff]"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={326.73}
                  strokeDashoffset={326.73 * (1 - progress)}
                />
              </svg>
              <span className="font-mono text-xs font-semibold text-[#f6f1e9]">
                {String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:
                {String(secondsLeft % 60).padStart(2, "0")}
              </span>
            </div>

            <div className="flex flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRunning((value) => !value)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#f4efe7] px-3 py-2 text-sm font-semibold text-[#1f1f24] transition hover:bg-white"
              >
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isRunning ? "Pause" : "Start"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded-2xl bg-white/5 px-3 py-2 text-sm font-semibold text-[#e7ded0] transition hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#b9b0a2]">
                Pomodoro
              </p>
              <h3 className="mt-2 text-2xl font-semibold">Focus counter</h3>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-[#d9d1c6]">
              {sessionCount} done
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => toggleMode("work")}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                mode === "work"
                  ? "bg-[#f4efe7] text-[#1f1f24]"
                  : "bg-white/5 text-[#cfc6b8] hover:bg-white/10"
              }`}
            >
              Work
            </button>
            <button
              type="button"
              onClick={() => toggleMode("break")}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                mode === "break"
                  ? "bg-[#f4efe7] text-[#1f1f24]"
                  : "bg-white/5 text-[#cfc6b8] hover:bg-white/10"
              }`}
            >
              Break
            </button>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <div className="relative flex h-48 w-48 items-center justify-center">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  className="fill-none stroke-white/10"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  className="fill-none stroke-[#7c6bff]"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={326.73}
                  strokeDashoffset={326.73 * (1 - progress)}
                />
              </svg>
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.24em] text-[#b9b0a2]">
                  {mode === "work" ? "Focus time" : "Break time"}
                </p>
                <p className="mt-2 font-mono text-5xl font-semibold tracking-tight">
                  {formatTime(secondsLeft)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setIsRunning((value) => !value)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#f4efe7] px-4 py-3 text-sm font-semibold text-[#1f1f24] transition hover:bg-white"
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isRunning ? "Pause" : "Start"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-[#e7ded0] transition hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>

            <div className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-[#e7ded0]">
              <Clock3 className="h-4 w-4" />
              {workMinutes}:{String(breakMinutes).padStart(2, "0")}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
