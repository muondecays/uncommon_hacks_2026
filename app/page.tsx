"use client";

import { useState, useRef } from "react";
import { pickRandom, checkGuess, ILLNESSES } from "./lib/illnesses";

type GameState = "idle" | "loading" | "playing" | "revealed";

export default function Home() {
  const [state, setState] = useState<GameState>("idle");
  const [illness, setIllness] = useState("");
  const [description, setDescription] = useState("");
  const [guess, setGuess] = useState("");
  const [correct, setCorrect] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function startGame() {
    const picked = pickRandom();
    setIllness(picked);
    setGuess("");
    setError("");
    setState("loading");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ illness: picked }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setDescription(data.text);
      setState("playing");
      setTimeout(() => inputRef.current?.focus(), 50);
    } catch {
      setError("Failed to generate. Check your API key and try again.");
      setState("idle");
    }
  }

  function submitGuess() {
    if (!guess.trim()) return;
    const isCorrect = checkGuess(guess, illness);
    setCorrect(isCorrect);
    setState("revealed");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") submitGuess();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Mind Reader
          </h1>
          <p className="text-slate-400 text-sm">
            Read the AI&apos;s first-person experience. Guess the condition.
          </p>
        </div>

        {/* Idle */}
        {state === "idle" && (
          <div className="flex flex-col items-center gap-4 pt-6">
            {error && (
              <p className="text-red-400 text-sm bg-red-950/40 px-4 py-2 rounded-lg">
                {error}
              </p>
            )}
            <button
              onClick={startGame}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-semibold rounded-xl transition-colors"
            >
              Start Game
            </button>
            <p className="text-slate-500 text-xs">
              {ILLNESSES.length} possible conditions
            </p>
          </div>
        )}

        {/* Loading */}
        {state === "loading" && (
          <div className="flex flex-col items-center gap-4 pt-10">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400">Generating experience&hellip;</p>
          </div>
        )}

        {/* Playing & Revealed */}
        {(state === "playing" || state === "revealed") && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 space-y-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl select-none">🧠</span>
              <p className="text-slate-100 leading-relaxed text-base whitespace-pre-wrap">
                {description}
              </p>
            </div>

            {state === "playing" && (
              <div className="space-y-3 pt-2 border-t border-slate-700">
                <label className="text-sm text-slate-400 block">
                  What condition is this person experiencing?
                </label>
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. OCD, depression, PTSD…"
                    className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={submitGuess}
                    disabled={!guess.trim()}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                  >
                    Guess
                  </button>
                </div>
              </div>
            )}

            {state === "revealed" && (
              <div className="pt-2 border-t border-slate-700 space-y-4">
                <div
                  className={`rounded-xl px-5 py-4 text-center ${
                    correct
                      ? "bg-emerald-900/50 border border-emerald-700"
                      : "bg-red-900/40 border border-red-800"
                  }`}
                >
                  <p className="text-2xl font-bold">
                    {correct ? "Correct! 🎉" : "Not quite 😔"}
                  </p>
                  <p className="text-slate-300 mt-1">
                    Your guess:{" "}
                    <span className="font-semibold text-white">
                      {guess || "—"}
                    </span>
                  </p>
                  <p className="text-slate-300">
                    Answer:{" "}
                    <span className="font-semibold text-white">{illness}</span>
                  </p>
                </div>
                <button
                  onClick={startGame}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
