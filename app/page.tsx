"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import WhatYouCanOptimize from "./components/WhatYouCanOptimize";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import Footer from "./components/Footer";
import { generateStack } from "./lib/engine";
import { Answers, Supplement } from "./lib/types";

type View = "hero" | "quiz" | "results";

export default function Home() {
  const [view, setView] = useState<View>("hero");
  const [stack, setStack] = useState<Supplement[]>([]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("start") === "quiz") {
      setView("quiz");
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  function handleComplete(answers: Answers) {
    const result = generateStack(answers);
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
      <main className="pt-16">
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
