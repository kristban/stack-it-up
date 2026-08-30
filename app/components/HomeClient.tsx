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
import { generateStack } from "../lib/engine";
import { Answers, Supplement } from "../lib/types";
import { FeaturedStack } from "../lib/featuredStacks";

type View = "hero" | "quiz" | "results";

interface HomeClientProps {
  supplements: Supplement[];
  featuredStacks: FeaturedStack[];
}

export default function HomeClient({ supplements, featuredStacks }: HomeClientProps) {
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
        {view === "results" && (
          <Results stack={stack} onReset={handleReset} />
        )}
      </main>
      <Footer />
    </>
  );
}
