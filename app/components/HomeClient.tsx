"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import WhatYouCanOptimize from "./WhatYouCanOptimize";
import Quiz from "./Quiz";
import Results from "./Results";
import Footer from "./Footer";
import { generateStack } from "../lib/engine";
import { Answers, Supplement } from "../lib/types";

type View = "hero" | "quiz" | "results";

interface HomeClientProps {
  supplements: Supplement[];
}

export default function HomeClient({ supplements }: HomeClientProps) {
  const [view, setView] = useState<View>("hero");
  const [stack, setStack] = useState<Supplement[]>([]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("start") === "quiz") {
      setView("quiz");
      window.history.replaceState(null, "", window.location.pathname);
    } else if (window.location.hash) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
    }
  }, []);

  function handleComplete(answers: Answers) {
    const result = generateStack(answers, supplements);
    setStack(result);
    setView("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleReset() {
    setView("hero");
    setStack([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleStartQuiz() {
    setView("quiz");
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
          </>
        )}
        {view === "quiz" && (
          <Quiz onComplete={handleComplete} onBack={() => setView("hero")} />
        )}
        {view === "results" && (
          <Results stack={stack} onReset={handleReset} />
        )}
      </main>
      <Footer />
    </>
  );
}
