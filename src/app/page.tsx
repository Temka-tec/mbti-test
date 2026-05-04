"use client";

import { useState, useEffect } from "react";
import {
  questions,
  MBTI_INFO,
  ANSWER_WEIGHTS,
  AnswerKey,
  Pole,
} from "./data/questions";
import { ProgressBar } from "./_components/ProgressBar";
import QuestionCard from "./_components/QuestionCard";
import ResultCard from "./_components/ResultCard";
import AiAnalysis from "./_components/AiAnalysis";

function calcMBTI(answers: Record<number, AnswerKey>): string {
  const s: Record<string, number> = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };
  for (const q of questions) {
    const w = ANSWER_WEIGHTS[answers[q.id]];
    if (!w) continue;
    const pos: Pole = q.positive;
    const neg = q.dimension.replace(pos, "") as Pole;
    if (w > 0) s[pos] += w;
    else s[neg] += Math.abs(w);
  }
  return (
    (s.E >= s.I ? "E" : "I") +
    (s.S >= s.N ? "S" : "N") +
    (s.T >= s.F ? "T" : "F") +
    (s.J >= s.P ? "J" : "P")
  );
}

export default function Home() {
  const [answers, setAnswers] = useState<Record<number, AnswerKey>>({});
  // current index into questions array (0–59)
  const [idx, setIdx] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const current = questions[idx];
  const isLast = idx === questions.length - 1;

  // Auto-advance 300ms after answering
  useEffect(() => {
    if (answers[current.id] === undefined) return;
    if (isLast) return; // last question: wait for user to submit
    const t = setTimeout(() => setIdx((i) => i + 1), 300);
    return () => clearTimeout(t);
  }, [answers, current.id, isLast]);

  function handleAnswer(id: number, val: AnswerKey) {
    setAnswers((prev) => ({ ...prev, [id]: val }));
  }

  async function handleFinish() {
    const mbti = calcMBTI(answers);
    setResult(mbti);
    setAiLoading(true);

    const summary = questions
      .map((q) => `Q: ${q.text}\nA: ${answers[q.id]}`)
      .join("\n");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mbti, summary }),
      });
      const data = await res.json();
      setAiText(data.text ?? "Алдаа гарлаа.");
    } catch {
      setAiText("Интернэт холболт шалгана уу.");
    }
    setAiLoading(false);
  }

  function reset() {
    setAnswers({});
    setIdx(0);
    setResult(null);
    setAiText(null);
  }

  // ── Result screen ──────────────────────────────────────
  if (result) {
    const info = MBTI_INFO[result];
    return (
      <Shell>
        <ResultCard type={result} info={info} onRetry={reset}>
          <AiAnalysis loading={aiLoading} text={aiText} color={info.color} />
        </ResultCard>
      </Shell>
    );
  }

  // ── Quiz screen ───────────────────────────────────────
  return (
    <Shell>
      <div className="w-full max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-block mb-4 px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{
              background: "#6366f118",
              color: "#818cf8",
              border: "1px solid #6366f133",
            }}
          >
            Зан чанарын тест
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-2">
            <span style={{ color: "#818cf8" }}>MBTI</span> Тест
          </h1>
          <p className="text-white/35 text-sm">
            60 асуулт · 16 зан чанарын төрөл · AI дүн шинжилгээ
          </p>
        </div>

        <ProgressBar
          answered={idx}
          total={questions.length}
          currentPage={idx}
          totalPages={questions.length}
        />

        {/* Single question */}
        <QuestionCard
          key={current.id}
          question={current}
          answer={answers[current.id]}
          onChange={handleAnswer}
        />

        {/* Back button + last-question submit */}
        <div className="flex gap-3 mt-5">
          {idx > 0 && (
            <button
              onClick={() => setIdx((i) => i - 1)}
              className="flex-1 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all hover:opacity-70"
              style={{ background: "#ffffff0d", color: "#ffffff66" }}
            >
              ← Өмнөх
            </button>
          )}

          {isLast && (
            <button
              disabled={answers[current.id] === undefined}
              onClick={handleFinish}
              className="flex-1 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all disabled:opacity-25 hover:opacity-80"
              style={{ background: "linear-gradient(135deg,#6366f1,#a78bfa)" }}
            >
              Үр дүн харах ✦
            </button>
          )}
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-16 px-4"
      style={{
        background: "#0d0d14",
        fontFamily: "'Outfit', sans-serif",
        color: "#fff",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');`}</style>
      {children}
    </div>
  );
}
