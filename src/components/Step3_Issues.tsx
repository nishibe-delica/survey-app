import type { Issues } from '../types/survey'

interface Props {
  data: Issues
  onChange: (data: Issues) => void
  onNext: () => void
  onBack: () => void
}

const PLAN_ITEMS = ['PC', 'サーバー', '販売管理', '勤怠', 'セキュリティ', 'AI', '回線', '電話', '複合機', 'その他']
const BUDGETS = ['〜50万円', '〜200万円', '〜500万円', '500万円以上', '未定']

export default function Step3_Issues({ data, onChange, onNext, onBack }: Props) {
  const set = <K extends keyof Issues>(key: K, val: Issues[K]) => onChange({ ...data, [key]: val })

  const togglePlan = (item: string) => {
    const next = data.planItems.includes(item)
      ? data.planItems.filter(v => v !== item)
      : [...data.planItems, item]
    set('planItems', next)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Step 3：課題・意向</h2>
        <p className="text-gray-500 text-sm mt-1">現在の課題と今後の計画をお聞かせください</p>
      </div>

      <div className="space-y-5">

        {/* 最も困っていること */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            現在のITで最も困っていること
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
            rows={4}
            placeholder="例）サーバーが古くなってきた、セキュリティが不安、テレワークへの対応..."
            value={data.mainIssue}
            onChange={e => set('mainIssue', e.target.value)}
          />
        </div>

        {/* 1年以内に検討しているIT項目 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            1年以内に検討しているIT項目（複数選択可）
          </label>
          <div className="flex flex-wrap gap-2">
            {PLAN_ITEMS.map(item => (
              <label key={item} className={`px-4 py-2 rounded-lg border cursor-pointer text-sm font-medium transition-all ${data.planItems.includes(item) ? 'border-blue-700 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600 hover:border-blue-300'}`}>
                <input type="checkbox" className="hidden" checked={data.planItems.includes(item)} onChange={() => togglePlan(item)} />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* AIで実現したいこと */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            AIで実現したいこと
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
            rows={3}
            placeholder="例）議事録の自動作成、問い合わせ対応の自動化、データ分析..."
            value={data.aiGoal}
            onChange={e => set('aiGoal', e.target.value)}
          />
        </div>

        {/* IT投資の年間予算感 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            IT投資の年間予算感
          </label>
          <div className="flex flex-wrap gap-2">
            {BUDGETS.map(v => (
              <label key={v} className={`px-4 py-2 rounded-lg border cursor-pointer text-sm transition-all ${data.itBudget === v ? 'border-blue-700 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-300 text-gray-600 hover:border-blue-300'}`}>
                <input type="radio" className="hidden" checked={data.itBudget === v} onChange={() => set('itBudget', v)} />
                {v}
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
          次へ →
        </button>
      </div>
    </div>
  )
}
