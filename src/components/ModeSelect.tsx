import type { Mode } from '../types/survey'

interface Props {
  onSelect: (mode: Mode) => void
}

export default function ModeSelect({ onSelect }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #1E4D8C 0%, #2563EB 100%)' }}>
      <div className="text-center mb-12">
        <div className="text-5xl mb-4">🏢</div>
        <h1 className="text-3xl font-bold text-white mb-2">スイテック</h1>
        <p className="text-blue-200 text-lg font-medium">創業40周年記念 ITアンケート</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl">
        <button
          onClick={() => onSelect('companion')}
          className="flex-1 bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group"
        >
          <span className="text-5xl group-hover:scale-110 transition-transform">💼</span>
          <div className="text-center">
            <div className="font-bold text-gray-800 text-lg">営業同行モード</div>
            <div className="text-gray-500 text-sm mt-1">担当者と一緒に回答</div>
          </div>
        </button>

        <button
          onClick={() => onSelect('self')}
          className="flex-1 bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group"
        >
          <span className="text-5xl group-hover:scale-110 transition-transform">📱</span>
          <div className="text-center">
            <div className="font-bold text-gray-800 text-lg">お客様セルフモード</div>
            <div className="text-gray-500 text-sm mt-1">お客様ご自身で回答</div>
          </div>
        </button>
      </div>

      <p className="text-blue-200 text-sm mt-10">所要時間：約5〜10分</p>
    </div>
  )
}
