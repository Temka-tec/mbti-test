"use client";

import { useState } from "react";
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

const PER_PAGE = 5;
const TOTAL_PAGES = Math.ceil(questions.length / PER_PAGE);

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
  const [page, setPage] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const pageQuestions = questions.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  const pageComplete = pageQuestions.every((q) => answers[q.id] !== undefined);

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
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_tokens: 600,
          messages: [
            {
              role: "system",
              content: `Та MBTI мэргэжилтэн юм. Монгол хэлээр хариулна уу.
Хэрэглэгчийн ${mbti} төрлийг 3 хэсэгт тайлбарла:
1. 💪 Хүчтэй талууд
2. 🌱 Хөгжих боломжтой чиглэлүүд
3. 🎯 Карьер ба харилцааны зөвлөмж
Тус бүрт 2-3 өгүүлбэр. Дулаан, урамшуулалтай өнгө аясаар.`,
            },
            {
              role: "user",
              content: `Миний MBTI: ${mbti}\n\n${summary}`,
            },
          ],
        }),
      });
      const data = await res.json();
      setAiText(data.choices?.[0]?.message?.content ?? "Алдаа гарлаа.");
    } catch {
      setAiText("Интернэт холболт шалгана уу.");
    }
    setAiLoading(false);
  }

  function reset() {
    setAnswers({});
    setPage(0);
    setResult(null);
    setAiText(null);
  }

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

  return (
    <Shell>
      <div className="w-full max-w-2xl mx-auto">
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
          answered={Object.keys(answers).length}
          total={questions.length}
          currentPage={page}
          totalPages={TOTAL_PAGES}
        />

        <div className="space-y-4 mb-8">
          {pageQuestions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              answer={answers[q.id]}
              onChange={handleAnswer}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {page > 0 && (
            <button
              onClick={() => setPage((p) => p - 1)}
              className="flex-1 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all hover:opacity-70"
              style={{ background: "#ffffff0d", color: "#ffffff66" }}
            >
              ← Өмнөх
            </button>
          )}

          {page < TOTAL_PAGES - 1 ? (
            <button
              disabled={!pageComplete}
              onClick={() => setPage((p) => p + 1)}
              className="flex-1 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all disabled:opacity-25 hover:opacity-80"
              style={{ background: "linear-gradient(135deg,#6366f1,#a78bfa)" }}
            >
              Дараах →
            </button>
          ) : (
            <button
              disabled={!allAnswered}
              onClick={handleFinish}
              className="flex-1 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all disabled:opacity-25 hover:opacity-80"
              style={{ background: "linear-gradient(135deg,#6366f1,#a78bfa)" }}
            >
              Үр дүн харах ✦
            </button>
          )}
        </div>

        {!pageComplete && (
          <p className="text-center text-white/25 text-xs mt-3">
            Хуудасны бүх асуултанд хариулна уу
          </p>
        )}
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
