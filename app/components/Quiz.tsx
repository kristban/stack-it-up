"use client";

import { useEffect, useState } from "react";
import { questions } from "../lib/questions";
import { Answers } from "../lib/types";

interface QuizProps {
  onComplete: (answers: Answers) => void;
  onBack: () => void;
}

const STORAGE_KEY = "stackitup-quiz-progress";

interface SavedProgress {
  step: number;
  answers: Answers;
}

// Read once, synchronously, so the first render already reflects any
// in-progress quiz rather than flashing question 1 before an effect restores it.
function loadSaved(): SavedProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.step !== "number" || typeof parsed?.answers !== "object") return null;
    return parsed as SavedProgress;
  } catch {
    return null;
  }
}

export default function Quiz({ onComplete, onBack }: QuizProps) {
  const [initial] = useState(loadSaved);
  const [step, setStep] = useState(() =>
    Math.min(Math.max(initial?.step ?? 0, 0), questions.length - 1),
  );
  const [answers, setAnswers] = useState<Answers>(() => initial?.answers ?? {});

  // Persist on every change so a refresh (or an accidental tab close) resumes
  // where the visitor left off, instead of restarting a 6-question quiz.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (Object.keys(answers).length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, answers }));
    } catch {
      // Storage unavailable — progress just won't survive a refresh.
    }
  }, [step, answers]);

  const current = questions[step];
  const selected = answers[current.id] ?? [];
  const isLast = step === questions.length - 1;

  function toggle(optionId: string) {
    if (current.type === "single") {
      setAnswers((prev) => ({ ...prev, [current.id]: [optionId] }));
    } else {
      setAnswers((prev) => {
        const cur = prev[current.id] ?? [];
        if (optionId === "none") return { ...prev, [current.id]: ["none"] };
        const filtered = cur.filter((x) => x !== "none");
        const next = filtered.includes(optionId)
          ? filtered.filter((x) => x !== optionId)
          : [...filtered, optionId];
        return { ...prev, [current.id]: next };
      });
    }
  }

  function next() {
    if (selected.length === 0) return;
    if (isLast) {
      if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
      onComplete(answers);
    } else {
      setStep((s) => s + 1);
    }
  }

  function prev() {
    if (step === 0) onBack();
    else setStep((s) => s - 1);
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={prev}
            className="flex items-center gap-2 text-sm font-medium transition-colors duration-150 hover:opacity-70"
            style={{ color: "#6B6558" }}
          >
            ← Back
          </button>
          <span
            className="text-sm font-medium px-3 py-1 rounded-full"
            style={{ color: "#111111", background: "#F4E14F" }}
          >
            {step + 1} / {questions.length}
          </span>
        </div>

        {/* Progress — each segment is a step. Answered steps are clickable so a
            visitor can jump back to fix an earlier answer without clicking
            "Back" repeatedly; unreached steps stay disabled. */}
        <div className="w-full flex gap-1.5 mb-10" role="group" aria-label="Quiz progress">
          {questions.map((q, i) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setStep(i)}
              disabled={i > step}
              aria-current={i === step ? "step" : undefined}
              aria-label={`Question ${i + 1} of ${questions.length}: ${q.question}`}
              className="h-1.5 flex-1 rounded-full transition-all duration-300 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2"
              style={{ background: i <= step ? "#111111" : "rgba(17,17,17,0.08)" }}
            />
          ))}
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2
            className="text-3xl sm:text-4xl mb-2 leading-tight tracking-tight"
            style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
          >
            {current.question}
          </h2>
          {current.subtitle && (
            <p className="text-base" style={{ color: "#6B6558" }}>
              {current.subtitle}
            </p>
          )}
          {current.type === "multi" && (
            <p className="text-xs mt-1 font-medium" style={{ color: "#8A8172" }}>
              Select all that apply
            </p>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
          {current.options.map((opt) => {
            const isSelected = selected.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggle(opt.id)}
                className="flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2"
                style={{
                  borderColor: isSelected ? "#111111" : "rgba(17,17,17,0.1)",
                  background: isSelected ? "#CFE0F7" : "#FFFFFF",
                  color: "#111111",
                }}
                aria-pressed={isSelected}
              >
                <span aria-hidden="true" className="text-2xl flex-shrink-0">{opt.emoji}</span>
                <span className="font-medium text-sm sm:text-base leading-snug">
                  {opt.label}
                </span>
                {isSelected && (
                  <span
                    aria-hidden="true"
                    className="ml-auto flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                    style={{ background: "#111111" }}
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <button
          onClick={next}
          disabled={selected.length === 0}
          className="w-full py-5 rounded-full font-medium text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: selected.length > 0 ? "#111111" : "#DCD8CB",
            color: "#FFFFFF",
          }}
        >
          {isLast ? "Build My Routine" : "Next →"}
        </button>
      </div>
    </section>
  );
}
