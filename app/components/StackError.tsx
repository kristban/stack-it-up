"use client";

interface StackErrorProps {
  message: string;
  canRetry: boolean;
  onRetry: () => void;
  onReset: () => void;
}

export default function StackError({ message, canRetry, onRetry, onReset }: StackErrorProps) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <span aria-hidden="true" className="text-4xl mb-4 block">
          😕
        </span>
        <p
          className="text-2xl sm:text-3xl mb-3 leading-tight tracking-tight"
          style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
        >
          We couldn&apos;t build your routine
        </p>
        <p className="text-base mb-8" style={{ color: "#6B6558" }} role="alert">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center">
          {canRetry && (
            <button
              onClick={onRetry}
              className="px-8 py-3.5 rounded-full font-medium text-base transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: "#111111", color: "#FFFFFF" }}
            >
              Try again
            </button>
          )}
          <button
            onClick={onReset}
            className="px-8 py-3.5 rounded-full font-medium text-base transition-all duration-200 hover:scale-105 active:scale-95 border-2"
            style={{ borderColor: "#111111", color: "#111111", background: "transparent" }}
          >
            ← Start Over
          </button>
        </div>
      </div>
    </section>
  );
}
