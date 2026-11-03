"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "./Navbar";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import WhatYouCanOptimize from "./WhatYouCanOptimize";
import FeaturedStacks from "./FeaturedStacks";
import Footer from "./Footer";

// Neither is needed for the initial "hero" view — every visitor pays for
// Navbar/Hero/etc. on first load regardless, but Quiz and Results only start
// downloading once the visitor actually clicks in, trimming initial JS.
const Quiz = dynamic(() => import("./Quiz"));
const Results = dynamic(() => import("./Results"));
const GeneratingStack = dynamic(() => import("./GeneratingStack"));
const StackError = dynamic(() => import("./StackError"));
import { generateStack } from "../lib/engine";
import { decodeAnswers } from "../lib/shareStack";
import { Answers, Supplement } from "../lib/types";
import { FeaturedStack } from "../lib/featuredStacks";

type View = "hero" | "quiz" | "generating" | "results" | "error";

// Shown when our own /api/stack fetch never got a response at all (e.g. the
// visitor is offline) — the server's own copy covers every case it can
// actually detect, so this is only the "couldn't even ask" fallback.
const UNREACHABLE_MESSAGE = "Something went wrong — please try again.";

interface HomeClientProps {
  supplements: Supplement[];
  featuredStacks: FeaturedStack[];
}

export default function HomeClient({ supplements, featuredStacks }: HomeClientProps) {
  const [view, setView] = useState<View>("hero");
  const [stack, setStack] = useState<Supplement[]>([]);
  const [answers, setAnswers] = useState<Answers | null>(null);
  const [stackError, setStackError] = useState<{ message: string; canRetry: boolean } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedStack = params.get("stack");
    const decoded = sharedStack ? decodeAnswers(sharedStack) : null;

    if (decoded) {
      // A shared routine link (?stack=...) — regenerate it from the encoded
      // answers rather than storing the resolved stack itself, so it always
      // reflects the current supplement library.
      setAnswers(decoded);
      setStack(generateStack(decoded, supplements));
      setView("results");
      window.history.replaceState(null, "", window.location.pathname);
    } else if (params.get("start") === "quiz") {
      setView("quiz");
      window.history.replaceState(null, "", window.location.pathname);
    } else if (window.location.hash) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
    }
  }, [supplements]);

  async function requestStack(quizAnswers: Answers) {
    setView("generating");
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const res = await fetch("/api/stack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: quizAnswers }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && Array.isArray(data?.stack)) {
        setStack(data.stack);
        setView("results");
        return;
      }

      // Server already logged the real error and sent back a safe message —
      // never surface the raw response here. Quota exhaustion won't resolve
      // by retrying today, so that's the one case with no retry button.
      setStackError({
        message: typeof data?.message === "string" ? data.message : UNREACHABLE_MESSAGE,
        canRetry: data?.error !== "quota_exceeded",
      });
      setView("error");
    } catch {
      // Didn't even get a response from our own API (e.g. offline).
      setStackError({ message: UNREACHABLE_MESSAGE, canRetry: true });
      setView("error");
    }
  }

  function handleComplete(quizAnswers: Answers) {
    setAnswers(quizAnswers);
    requestStack(quizAnswers);
  }

  function handleRetry() {
    if (answers) requestStack(answers);
  }

  function handleReset() {
    setView("hero");
    setStack([]);
    setAnswers(null);
    setStackError(null);
    // Drop any lingering hash (e.g. #newsletter) so the logo returns to a clean URL.
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleStartQuiz() {
    setView("quiz");
    // Drop any lingering hash (e.g. #newsletter) so the quiz opens on a clean URL.
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <Navbar onLogoClick={handleReset} onStartQuiz={handleStartQuiz} />
      <main className="pt-24">
        {view === "hero" && (
          <>
            <Hero onStart={() => setView("quiz")} />
            <HowItWorks />
            <WhatYouCanOptimize />
            <FeaturedStacks stacks={featuredStacks} />
          </>
        )}
        {view === "quiz" && (
          <Quiz onComplete={handleComplete} onBack={() => setView("hero")} />
        )}
        {view === "generating" && <GeneratingStack />}
        {view === "error" && stackError && (
          <StackError
            message={stackError.message}
            canRetry={stackError.canRetry}
            onRetry={handleRetry}
            onReset={handleReset}
          />
        )}
        {view === "results" && (
          <Results stack={stack} answers={answers} onReset={handleReset} />
        )}
      </main>
      <Footer />
    </>
  );
}
