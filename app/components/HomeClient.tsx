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

// Fallback copy for the rare case where /api/stack responds but without the
// friendly message it normally includes — the server's own message covers
// every case it can actually detect, so this is just a safety net.
const UNREACHABLE_MESSAGE = "Something went wrong — please try again.";

interface HomeClientProps {
  supplements: Supplement[];
  featuredStacks: FeaturedStack[];
}

export default function HomeClient({ supplements, featuredStacks }: HomeClientProps) {
  const [view, setView] = useState<View>("hero");
  const [stack, setStack] = useState<Supplement[]>([]);
  const [aiGenerated, setAiGenerated] = useState(true);
  const [answers, setAnswers] = useState<Answers | null>(null);
  const [stackError, setStackError] = useState<{ message: string; canRetry: boolean } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedStack = params.get("stack");
    const decoded = sharedStack ? decodeAnswers(sharedStack) : null;

    if (decoded) {
      // A shared routine link (?stack=...) — regenerate it from the encoded
      // answers rather than storing the resolved stack itself, so it always
      // reflects the current supplement library. This is always the
      // rule-based engine (never Gemini — see Results' "standard
      // recommendation" note), so it's marked as such too.
      setAnswers(decoded);
      setStack(generateStack(decoded, supplements));
      setAiGenerated(false);
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
        // /api/stack itself already falls back to the rule-based engine
        // (and logs the real error) when Gemini fails or times out, so a
        // 200 here is always a usable result — aiGenerated just says which
        // kind, for the "standard recommendation" note on Results.
        setStack(data.stack);
        setAiGenerated(data.aiGenerated === true);
        setView("results");
        return;
      }

      // A non-200 here means even the rule-based fallback couldn't run
      // (bad request, our own rate limit, or the catalog itself failed to
      // load) — there's nothing to show instead, so this is a real error.
      setStackError({
        message: typeof data?.message === "string" ? data.message : UNREACHABLE_MESSAGE,
        canRetry: true,
      });
      setView("error");
    } catch {
      // Didn't get a response from our own API at all (e.g. offline) — we
      // still have the catalog and the answers client-side, so fall back
      // to the same rule-based engine rather than dead-ending on an error.
      setStack(generateStack(quizAnswers, supplements));
      setAiGenerated(false);
      setView("results");
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
    setAiGenerated(true);
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
          <Results stack={stack} aiGenerated={aiGenerated} answers={answers} onReset={handleReset} />
        )}
      </main>
      <Footer />
    </>
  );
}
