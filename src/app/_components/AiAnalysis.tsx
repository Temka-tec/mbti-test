interface Props {
  loading: boolean;
  text: string | null;
  color: string;
}

export default function AiAnalysis({ loading, text, color }: Props) {
  return (
    <div
      className="rounded-2xl p-7 mb-6"
      style={{ background: "#13131f", border: "1px solid #ffffff0f" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">✦</span>
        <span
          className="text-[11px] font-bold uppercase tracking-[0.15em]"
          style={{ color }}
        >
          AI Дүн шинжилгээ
        </span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2">
          {[0, 120, 240].map((delay) => (
            <span
              key={delay}
              className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{ background: color, animationDelay: `${delay}ms` }}
            />
          ))}
          <span className="text-white/30 text-sm ml-2">Шинжилж байна...</span>
        </div>
      ) : (
        <p className="text-white/60 leading-relaxed text-sm whitespace-pre-line">
          {text}
        </p>
      )}
    </div>
  );
}
