import type { Expectation } from '../types/survey'

interface Props {
  data: Expectation
  onChange: (data: Expectation) => void
  onNext: () => void
  onBack: () => void
}

const EXPECTATION_ITEMS = [
  '迅速な対応', '提案力の向上', '価格競争力',
  '最新技術情報の提供', '担当者との関係強化', 'サポート品質', 'その他'
]

const getNpsColor = (score: number) => {
  if (score <= 6) return '#EF4444'
  if (score <= 8) return '#F59E0B'
  return '#10B981'
}

const getNpsLabel = (score: number) => {
  if (score <= 6) return '😞 批判者'
  if (score <= 8) return '😐 中立者'
  return '😊 推奨者'
}

export default function Step4_Expectation({ data, onChange, onNext, onBack }: Props) {
  const set = <K extends keyof Expectation>(key: K, val: Expectation[K]) => onChange({ ...data, [key]: val })

  const toggleExp = (item: string) => {
    const next = data.expectations.includes(item)
      ? data.expectations.filter(v => v !== item)
      : [...data.expectations, item]
    set('expectations', next)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Step 4：スイテックへの期待</h2>
        <p className="text-gray-500 text-sm mt-1">スイテックへのご評価・ご期待をお聞かせください</p>
      </div>

      <div className="space-y-8">

        {/* NPS */}
        <div className="bg-gray-50 rounded-xl p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            スイテックを知人・同業者に勧める可能性はどのくらいですか？
          </p>

          {/* スコア表示 */}
          <div className="text-center mb-4">
            <span className="text-5xl font-bold" style={{ color: getNpsColor(data.nps) }}>
              {data.nps}
            </span>
            <span className="text-gray-500 text-lg"> / 10</span>
            <div className="mt-1 text-sm font-semibold" style={{ color: getNpsColor(data.nps) }}>
              {getNpsLabel(data.nps)}
            </div>
          </div>

          {/* スライダー */}
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="10"
              value={data.nps}
              onChange={e => set('nps', Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: getNpsColor(data.nps) }}
            />
            <div className="flex justify-between mt-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <span key={n} className="text-xs text-gray-400">{n}</span>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">全く思わない</span>
              <span className="text-xs text-gray-400">強くそう思う</span>
            </div>
          </div>
        </div>

        {/* 期待項目 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            スイテックに期待すること（複数選択可）
          </label>
          <div className="flex flex-wrap gap-2">
            {EXPECTATION_ITEMS.map(item => (
              <label key={item} className={`px-4 py-2 rounded-lg border cursor-pointer text-sm transition-all ${data.expectations.includes(item) ? 'border-blue-700 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-300 text-gray-600 hover:border-blue-300'}`}>
                <input type="checkbox" className="hidden" checked={data.expectations.includes(item)} onChange={() => toggleExp(item)} />
                {item}
              </label>
            ))}
          </div>
        </div>

      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl font-bold text-gray-600 border border-gray-300 hover:bg-gray-50 transition-all">
          ← 戻る
        </button>
        <button onClick={onNext} className="py-3 px-8 rounded-xl font-bold text-white transition-all" style={{ background: '#1E4D8C', flex: 2 }}>
          回答を送信する ✓
        </button>
      </div>
    </div>
  )
}
