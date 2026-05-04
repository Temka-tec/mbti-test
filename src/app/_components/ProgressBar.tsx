interface ProgressBarProps {
  answered: number;
  total: number;
  currentPage: number;
  totalPages: number;
}

export function ProgressBar({
  answered,
  total,
  currentPage,
  totalPages,
}: ProgressBarProps) {
  const progressPercent = (answered / total) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-white/70">
          Хуудас {currentPage + 1} / {totalPages}
        </span>
        <span className="text-xs font-semibold text-white/70">
          {answered} / {total}
        </span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
