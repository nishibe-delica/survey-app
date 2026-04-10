import { useState } from 'react'
import type { SurveyData } from '../types/survey'

interface Props {
  data: Partial<SurveyData>
  onNext: (data: Partial<SurveyData>) => void
  onBack: () => void
}

const AI_STATUSES = [
  { value: 'active', label: '積極的に活用中' },
  { value: 'partial', label: '一部で活用中' },
  { value: 'considering', label: '検討中' },
  { value: 'none', label: 'まだ活用していない' }
]

const AI_SERVICES = ['ChatGPT', 'Microsoft Copilot', 'Claude', 'Google Gemini', 'その他']

export default function Step10_AI({ data, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    aiStatus: data.aiStatus || '',
    aiServices: data.aiServices || [],
    aiServicesOther: data.aiServicesOther || ''
  })

  const toggleService = (service: string) => {
    const newServices = formData.aiServices.includes(service)
      ? formData.aiServices.filter(s => s !== service)
      : [...formData.aiServices, service]
    setFormData({ ...formData, aiServices: newServices })
  }

  const showServices = formData.aiStatus === 'active' || formData.aiStatus === 'partial'

  const handleNext = () => {
    onNext(formData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-2">🤖</div>
        <h2 className="text-2xl font-bold" style={{ color: '#1E4D8C' }}>AI活用</h2>
        <p className="text-gray-500 text-sm mt-1">AIツールの活用状況についてお聞かせください</p>
      </div>

      <div className="space-y-8">
        {/* 質問1：活用状況 */}
        <div>
          <label className="block text-[17px] font-bold text-gray-700 mb-3">
            活用状況 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 gap-3">
            {AI_STATUSES.map(s => (
              <button
                key={s.value}
                onClick={() => setFormData({ ...formData, aiStatus: s.value })}
                className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-left text-lg flex items-center gap-2 ${
                  formData.aiStatus === s.value
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.aiStatus === s.value ? { background: '#1E4D8C' } : {}}
              >
                {formData.aiStatus === s.value && <span className="text-white">✓</span>}
                <span className="flex-1">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 質問2：利用中のAIサービス（活用中の場合） */}
        {showServices && (
          <div className="animate-fadeIn">
            <label className="block text-[17px] font-bold text-gray-700 mb-3">
              利用中のAIサービス（複数選択可） <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3">
              {AI_SERVICES.map(service => (
                <button
                  key={service}
                  onClick={() => toggleService(service)}
                  className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-left text-lg flex items-center gap-2 ${
                    formData.aiServices.includes(service)
                      ? 'border-transparent text-white font-semibold'
                      : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                  }`}
                  style={formData.aiServices.includes(service) ? { background: '#1E4D8C' } : {}}
                >
                  {formData.aiServices.includes(service) && <span className="text-white">✓</span>}
                  <span className="flex-1">{service}</span>
                </button>
              ))}
            </div>

            {formData.aiServices.includes('その他') && (
              <div className="mt-3 animate-fadeIn">
                <label className="block text-sm text-gray-600 mb-1">→ サービス名を入力してください</label>
                <input
                  type="text"
                  value={formData.aiServicesOther}
                  onChange={e => setFormData({ ...formData, aiServicesOther: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例）○○AI"
                />
              </div>
            )}
          </div>
        )}
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
