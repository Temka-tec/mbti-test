import { MbtiInfo } from "../data/questions";

interface Props {
  type: string;
  info: MbtiInfo;
  onRetry: () => void;
  children: React.ReactNode; // AiAnalysis slot
}

export default function ResultCard({ type, info, onRetry, children }: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="rounded-3xl p-10 mb-6 text-center"
        style={{
          background: `linear-gradient(135deg, ${info.color}18 0%, ${info.color}35 100%)`,
          border: `1px solid ${info.color}44`,
        }}
      >
        <div className="text-6xl mb-3">{info.emoji}</div>
        <div
          className="text-7xl font-extrabold tracking-[0.15em] mb-2"
          style={{ color: info.color }}
        >
          {type}
        </div>
        <div className="text-xl font-semibold text-white/70 mb-3">
          {info.title}
        </div>
        <p className="text-white/50 text-sm leading-relaxed max-w-sm mx-auto">
          {info.desc}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {info.traits.map((t) => (
          <span
            key={t}
            className="px-4 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: `${info.color}22`,
              color: info.color,
              border: `1px solid ${info.color}44`,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {children}

      <button
        onClick={onRetry}
        className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all hover:opacity-80 active:scale-95"
        style={{ background: info.color }}
      >
        Дахин тест өгөх
      </button>
    </div>
  );
}
