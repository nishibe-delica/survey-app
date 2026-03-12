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

export default function Step12_Expectation({ data, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    nps: data.nps ?? 8,
    expectations: data.expectations || []
  })

  const toggleExpectation = (exp: string) => {
    const newExps = formData.expectations.includes(exp)
      ? formData.expectations.filter(e => e !== exp)
      : [...formData.expectations, exp]
    setFormData({ ...formData, expectations: newExps })
  }

  const canNext = true // NPSは必須、期待は任意

  const handleNext = () => {
    if (canNext) onNext(formData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-2">🌟</div>
        <h2 className="text-2xl font-bold" style={{ color: '#1E4D8C' }}>スイテックへのご期待</h2>
        <p className="text-gray-500 text-sm mt-1">創業40周年を迎えたスイテックへのご意見・ご期待をお聞かせください</p>
      </div>

      <div className="space-y-6">
        {/* 質問1：NPS */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            スイテックを知人・同業者にお勧めする可能性は？ <span className="text-red-500">*</span>
          </label>

          {/* 現在値を大きく表示 */}
          <div className="text-center mb-4">
            <div className="text-5xl font-bold" style={{ color: '#1E4D8C' }}>{formData.nps}</div>
          </div>

          {/* スライダー */}
          <input
            type="range"
            min="0"
            max="10"
            value={formData.nps}
            onChange={e => setFormData({ ...formData, nps: parseInt(e.target.value) })}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #1E4D8C 0%, #1E4D8C ${formData.nps * 10}%, #e5e7eb ${formData.nps * 10}%, #e5e7eb 100%)`
            }}
          />

          {/* ラベル */}
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>0 勧めない</span>
            <span>10 ぜひ勧めたい</span>
          </div>
        </div>

        {/* 質問2：今後期待すること */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            スイテックに今後期待すること（複数選択可・任意）
          </label>
          <div className="grid grid-cols-1 gap-2">
            {EXPECTATIONS.map(exp => (
              <button
                key={exp}
                onClick={() => toggleExpectation(exp)}
                className={`px-5 py-3 rounded-lg border transition-all text-left ${
                  formData.expectations.includes(exp)
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.expectations.includes(exp) ? { background: '#1E4D8C' } : {}}
              >
                {exp}
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

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #1E4D8C;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #1E4D8C;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}
