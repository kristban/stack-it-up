"use client";

import { useState } from "react";
import { questions } from "../lib/questions";
import { Answers } from "../lib/types";

interface QuizProps {
  onComplete: (answers: Answers) => void;
  onBack: () => void;
}

export default function Quiz({ onComplete, onBack }: QuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const current = questions[step];
  const selected = answers[current.id] ?? [];
  const progress = ((step + 1) / questions.length) * 100;
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
            style={{ color: "#6E6153" }}
          >
            ← Back
          </button>
          <span className="text-sm font-medium" style={{ color: "#8B7E6E" }}>
            {step + 1} / {questions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="w-full h-1.5 rounded-full mb-10 overflow-hidden"
          style={{ background: "rgba(38,32,25,0.08)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "#C4744A",
            }}
          />
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2
            className="text-3xl sm:text-4xl mb-2 leading-tight"
            style={{ color: "#262019", fontFamily: "var(--font-serif)", fontWeight: 700 }}
          >
            {current.question}
          </h2>
          {current.subtitle && (
            <p className="text-base" style={{ color: "#6E6153" }}>
              {current.subtitle}
            </p>
          )}
          {current.type === "multi" && (
            <p className="text-xs mt-1 font-medium" style={{ color: "#8B7E6E" }}>
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
                  borderColor: isSelected ? "#C4744A" : "rgba(38,32,25,0.1)",
                  background: isSelected ? "rgba(196,116,74,0.07)" : "#FFFFFF",
                  color: "#262019",
                }}
                aria-pressed={isSelected}
              >
                <span className="text-2xl flex-shrink-0">{opt.emoji}</span>
                <span className="font-medium text-sm sm:text-base leading-snug">
                  {opt.label}
                </span>
                {isSelected && (
                  <span
                    className="ml-auto flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                    style={{ background: "#C4744A" }}
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
            background: selected.length > 0 ? "#C4744A" : "#DCCFBE",
            color: "#FFFFFF",
          }}
        >
          {isLast ? "Build My Routine" : "Next →"}
        </button>
      </div>
    </section>
  );
}
