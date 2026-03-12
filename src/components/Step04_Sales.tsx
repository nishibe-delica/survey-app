import { useState } from 'react'
import type { SurveyData } from '../types/survey'

interface Props {
  data: Partial<SurveyData>
  onNext: (data: Partial<SurveyData>) => void
  onBack: () => void
}

const STATUSES = [
  { value: 'installed', label: '導入済み' },
  { value: 'considering', label: '検討中' },
  { value: 'none', label: '未導入' }
]

const VENDORS = [
  { value: 'suiteq', label: 'スイテック' },
  { value: 'other', label: '他社' },
  { value: 'self', label: '自社開発' }
]

export default function Step04_Sales({ data, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    salesSystem: data.salesSystem || '',
    salesSystemVendor: data.salesSystemVendor || '',
    salesSystemVendorOther: data.salesSystemVendorOther || ''
  })

  const showVendor = formData.salesSystem === 'installed' || formData.salesSystem === 'considering'
  const canNext = formData.salesSystem &&
                  (!showVendor || (formData.salesSystemVendor && (formData.salesSystemVendor !== 'other' || formData.salesSystemVendorOther.trim())))

  const handleNext = () => {
    if (canNext) onNext(formData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-2">📊</div>
        <h2 className="text-2xl font-bold" style={{ color: '#1E4D8C' }}>販売管理システム</h2>
        <p className="text-gray-500 text-sm mt-1">受注・売上・在庫などの管理システムについてお聞かせください</p>
      </div>

      <div className="space-y-6">
        {/* 質問1：導入状況 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            導入状況 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {STATUSES.map(s => (
              <button
                key={s.value}
                onClick={() => setFormData({ ...formData, salesSystem: s.value })}
                className={`px-5 py-3 rounded-lg border transition-all ${
                  formData.salesSystem === s.value
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.salesSystem === s.value ? { background: '#1E4D8C' } : {}}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 質問2：導入・管理会社（導入済み・検討中の場合） */}
        {showVendor && (
          <div className="animate-fadeIn">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              導入・管理会社 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {VENDORS.map(v => (
                <button
                  key={v.value}
                  onClick={() => setFormData({ ...formData, salesSystemVendor: v.value, salesSystemVendorOther: v.value !== 'other' ? '' : formData.salesSystemVendorOther })}
                  className={`px-5 py-3 rounded-lg border transition-all ${
                    formData.salesSystemVendor === v.value
                      ? 'border-transparent text-white font-semibold'
                      : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                  }`}
                  style={formData.salesSystemVendor === v.value ? { background: '#1E4D8C' } : {}}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {formData.salesSystemVendor === 'other' && (
              <div className="mt-3 animate-fadeIn">
                <label className="block text-sm text-gray-600 mb-1">→ 会社名を入力してください</label>
                <input
                  type="text"
                  value={formData.salesSystemVendorOther}
                  onChange={e => setFormData({ ...formData, salesSystemVendorOther: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例）○○株式会社"
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
          disabled={!canNext}
          className="flex-1 py-3 rounded-lg font-bold text-white transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          style={{ background: canNext ? '#1E4D8C' : undefined }}
        >
          次へ →
        </button>
      </div>
    </div>
  )
}
