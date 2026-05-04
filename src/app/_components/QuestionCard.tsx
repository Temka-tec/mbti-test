import { AnswerKey, ANSWER_LABELS, Question } from "../data/questions";

interface Props {
  question: Question;
  answer: AnswerKey | undefined;
  onChange: (id: number, val: AnswerKey) => void;
}

const KEYS: AnswerKey[] = ["sa", "a", "n", "d", "sd"];

export default function QuestionCard({ question, answer, onChange }: Props) {
  return (
    <div
      className="rounded-2xl p-6 transition-all duration-300"
      style={{
        background: "#1a1a2e",
        border: answer ? "1px solid #6366f155" : "1px solid #ffffff0d",
      }}
    >
      <p className="text-white/80 font-medium mb-5 text-[15px] leading-relaxed">
        <span className="text-white/25 mr-2 font-mono text-xs">
          {String(question.id).padStart(2, "0")}
        </span>
        {question.text}
      </p>

      <div className="flex gap-2">
        {KEYS.map((key) => {
          const active = answer === key;
          return (
            <button
              key={key}
              onClick={() => onChange(question.id, key)}
              title={ANSWER_LABELS[key]}
              className="flex-1 py-3 rounded-xl text-[11px] font-semibold leading-tight transition-all duration-200 hover:scale-105"
              style={{
                background: active ? "#6366f1" : "#ffffff08",
                color: active ? "#fff" : "#ffffff44",
                border: active ? "1px solid #818cf8" : "1px solid transparent",
              }}
            >
              {ANSWER_LABELS[key]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
