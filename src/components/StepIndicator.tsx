interface Props {
  current: number
  total: number
}

const STEP_LABELS = ['基本情報', 'IT環境', '課題・意向', 'ご期待', '完了']

export default function StepIndicator({ current, total }: Props) {
  return (
    <div className="w-full bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          {STEP_LABELS.slice(0, total).map((label, i) => {
            const step = i + 1
            const isCompleted = step < current
            const isActive = step === current
            return (
              <div key={step} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  {i > 0 && (
                    <div className={`flex-1 h-0.5 ${isCompleted ? 'bg-blue-700' : 'bg-gray-200'}`} />
                  )}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isCompleted
                        ? 'bg-blue-700 text-white'
                        : isActive
                        ? 'bg-blue-700 text-white ring-4 ring-blue-100'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted ? '✓' : step}
                  </div>
                  {i < total - 1 && (
                    <div className={`flex-1 h-0.5 ${isCompleted ? 'bg-blue-700' : 'bg-gray-200'}`} />
                  )}
                </div>
                <span className={`text-xs mt-1 text-center ${isActive ? 'text-blue-700 font-semibold' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
