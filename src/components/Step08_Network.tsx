import { useState } from 'react'
import type { SurveyData } from '../types/survey'

interface Props {
  data: Partial<SurveyData>
  onNext: (data: Partial<SurveyData>) => void
  onBack: () => void
}

const NETWORK_TYPES = ['光回線（有線）', '無線LAN（Wi-Fi）', 'MVNO', 'モバイルルーター', 'その他']
const VENDORS = [
  { value: 'suiteq', label: 'スイテック' },
  { value: 'other', label: '他社' },
  { value: 'self', label: '自社管理' },
  { value: 'unknown', label: 'わからない' }
]

export default function Step08_Network({ data, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    networkTypes: data.networkTypes || [],
    networkTypesOther: data.networkTypesOther || '',
    networkVendor: data.networkVendor || '',
    networkVendorOther: data.networkVendorOther || ''
  })

  const toggleType = (type: string) => {
    const newTypes = formData.networkTypes.includes(type)
      ? formData.networkTypes.filter(t => t !== type)
      : [...formData.networkTypes, type]
    setFormData({ ...formData, networkTypes: newTypes })
  }

  const handleNext = () => {
    onNext(formData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-2">🌐</div>
        <h2 className="text-2xl font-bold" style={{ color: '#1E4D8C' }}>回線・ネットワーク</h2>
        <p className="text-gray-500 text-sm mt-1">インターネット回線・社内ネットワークについてお聞かせください</p>
      </div>

      <div className="space-y-6">
        {/* Q1: 回線の種類 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            回線の種類（複数選択可）
          </label>
          <div className="grid grid-cols-1 gap-2">
            {NETWORK_TYPES.map(type => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`px-5 py-3 rounded-lg border transition-all text-left ${
                  formData.networkTypes.includes(type)
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.networkTypes.includes(type) ? { background: '#1E4D8C' } : {}}
              >
                {type}
              </button>
            ))}
          </div>

          {formData.networkTypes.includes('その他') && (
            <div className="mt-3 animate-fadeIn">
              <label className="block text-sm text-gray-600 mb-1">→ 内容を入力してください</label>
              <input
                type="text"
                value={formData.networkTypesOther}
                onChange={e => setFormData({ ...formData, networkTypesOther: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例）専用線、ADSL など"
              />
            </div>
          )}
        </div>

        {/* Q2: 管理・導入会社 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            管理・導入会社
          </label>
          <div className="grid grid-cols-2 gap-2">
            {VENDORS.map(v => (
              <button
                key={v.value}
                onClick={() => setFormData({ ...formData, networkVendor: v.value, networkVendorOther: v.value !== 'other' ? '' : formData.networkVendorOther })}
                className={`px-5 py-3 rounded-lg border transition-all ${
                  formData.networkVendor === v.value
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.networkVendor === v.value ? { background: '#1E4D8C' } : {}}
              >
                {v.label}
              </button>
            ))}
          </div>

          {formData.networkVendor === 'other' && (
            <div className="mt-3 animate-fadeIn">
              <label className="block text-sm text-gray-600 mb-1">→ 会社名を入力してください</label>
              <input
                type="text"
                value={formData.networkVendorOther}
                onChange={e => setFormData({ ...formData, networkVendorOther: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例）○○株式会社"
              />
            </div>
          )}
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
