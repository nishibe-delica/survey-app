import { useState } from 'react'
import type { SurveyData } from '../types/survey'

interface Props {
  data: Partial<SurveyData>
  onNext: (data: Partial<SurveyData>) => void
  onBack: () => void
}

const EXPECTATIONS = [
  '迅速な対応',
  '提案力の向上',
  '価格競争力',
  '最新技術の情報提供',
  '担当者との関係強化',
  'サポート品質の向上',
  'その他'
]

export default function Step15_Expectation({ data, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    expectations: data.expectations || []
  })

  const toggleExpectation = (exp: string) => {
    const newExps = formData.expectations.includes(exp)
      ? formData.expectations.filter(e => e !== exp)
      : [...formData.expectations, exp]
    setFormData({ ...formData, expectations: newExps })
  }

  const handleNext = () => {
    onNext(formData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-2">🌟</div>
        <h2 className="text-2xl font-bold" style={{ color: '#1E4D8C' }}>スイテックへのご期待</h2>
        <p className="text-gray-500 text-sm mt-1">創業40周年を迎えたスイテックへのご意見・ご期待をお聞かせください</p>
      </div>

      <div className="space-y-8">
        {/* 今後期待すること */}
        <div>
          <label className="block text-[17px] font-bold text-gray-700 mb-3">
            スイテックに今後期待すること（複数選択可・任意）
          </label>
          <div className="grid grid-cols-1 gap-3">
            {EXPECTATIONS.map(exp => (
              <button
                key={exp}
                onClick={() => toggleExpectation(exp)}
                className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-left text-lg flex items-center gap-2 ${
                  formData.expectations.includes(exp)
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.expectations.includes(exp) ? { background: '#1E4D8C' } : {}}
              >
                {formData.expectations.includes(exp) && <span className="text-white">✓</span>}
                <span className="flex-1">{exp}</span>
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
