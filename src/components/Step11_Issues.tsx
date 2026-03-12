import { useState } from 'react'
import type { SurveyData } from '../types/survey'

interface Props {
  data: Partial<SurveyData>
  onNext: (data: Partial<SurveyData>) => void
  onBack: () => void
}

const CONSIDERING_ITEMS = [
  'PC・端末',
  'サーバー・クラウド',
  '販売管理',
  '勤怠システム',
  'セキュリティ',
  'AI導入',
  '回線・NW',
  '電話',
  '複合機',
  'その他'
]

const IT_BUDGETS = ['〜50万円', '50〜200万円', '200〜500万円', '500万円以上', '未定']

export default function Step11_Issues({ data, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    itIssues: data.itIssues || '',
    consideringItems: data.consideringItems || [],
    aiGoals: data.aiGoals || '',
    itBudget: data.itBudget || ''
  })

  const toggleItem = (item: string) => {
    const newItems = formData.consideringItems.includes(item)
      ? formData.consideringItems.filter(i => i !== item)
      : [...formData.consideringItems, item]
    setFormData({ ...formData, consideringItems: newItems })
  }

  // 任意項目なので常に次へ進める
  const canNext = true

  const handleNext = () => {
    if (canNext) onNext(formData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-2">💬</div>
        <h2 className="text-2xl font-bold" style={{ color: '#1E4D8C' }}>現在のITの課題</h2>
        <p className="text-gray-500 text-sm mt-1">ITに関するお困りごとや今後の計画をお聞かせください</p>
      </div>

      <div className="space-y-6">
        {/* 質問1：現在のITで最も困っていること */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            現在のITで最も困っていることは？（任意）
          </label>
          <textarea
            value={formData.itIssues}
            onChange={e => setFormData({ ...formData, itIssues: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            placeholder="例）システムが古くて使いにくい、セキュリティが不安など"
          />
        </div>

        {/* 質問2：1年以内に検討しているIT項目 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            1年以内に検討しているIT項目（複数選択可・任意）
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CONSIDERING_ITEMS.map(item => (
              <button
                key={item}
                onClick={() => toggleItem(item)}
                className={`px-4 py-3 rounded-lg border transition-all text-sm ${
                  formData.consideringItems.includes(item)
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.consideringItems.includes(item) ? { background: '#1E4D8C' } : {}}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* 質問3：AIで実現したいこと */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            AIで実現したいことは？（任意）
          </label>
          <textarea
            value={formData.aiGoals}
            onChange={e => setFormData({ ...formData, aiGoals: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            placeholder="例）書類作成の自動化、問い合わせ対応など"
          />
        </div>

        {/* 質問4：IT投資の年間予算感 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            IT投資の年間予算感（任意）
          </label>
          <div className="grid grid-cols-2 gap-2">
            {IT_BUDGETS.map(budget => (
              <button
                key={budget}
                onClick={() => setFormData({ ...formData, itBudget: budget })}
                className={`px-5 py-3 rounded-lg border transition-all ${
                  formData.itBudget === budget
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.itBudget === budget ? { background: '#1E4D8C' } : {}}
              >
                {budget}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg border text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          style={{ borderColor: '#1E4D8C', color: '#1E4D8C' }}
        >
          ← 戻る
        </button>
        <button
          onClick={handleNext}
          className="flex-1 py-3 rounded-lg font-bold text-white transition-all"
          style={{ background: '#1E4D8C' }}
        >
          次へ →
        </button>
      </div>
    </div>
  )
}
