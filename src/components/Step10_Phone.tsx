import { useState } from 'react'
import type { SurveyData } from '../types/survey'

interface Props {
  data: Partial<SurveyData>
  onNext: (data: Partial<SurveyData>) => void
  onBack: () => void
}

const PHONE_ENVS = [
  '従来のビジネスフォン（PBX）',
  'クラウド電話',
  'IP-PBX',
  '携帯電話のみ',
  'その他'
]

const VENDORS = [
  { value: 'suiteq', label: 'スイテック' },
  { value: 'other', label: '他社' },
  { value: 'unknown', label: '不明' }
]

export default function Step09_Phone({ data, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    phoneEnv: data.phoneEnv || '',
    phoneVendor: data.phoneVendor || '',
    phoneVendorOther: data.phoneVendorOther || ''
  })

  const handleNext = () => {
    onNext(formData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-2">📞</div>
        <h2 className="text-2xl font-bold" style={{ color: '#1E4D8C' }}>電話・IP-PBX</h2>
        <p className="text-gray-500 text-sm mt-1">会社の電話環境についてお聞かせください</p>
      </div>

      <div className="space-y-8">
        {/* 質問1：現在の電話環境 */}
        <div>
          <label className="block text-[17px] font-bold text-gray-700 mb-3">
            現在の電話環境 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 gap-3">
            {PHONE_ENVS.map(env => (
              <button
                key={env}
                onClick={() => setFormData({ ...formData, phoneEnv: env })}
                className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-left text-lg flex items-center gap-2 ${
                  formData.phoneEnv === env
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.phoneEnv === env ? { background: '#1E4D8C' } : {}}
              >
                {formData.phoneEnv === env && <span className="text-white">✓</span>}
                <span className="flex-1">{env}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 質問2：管理・導入会社 */}
        <div>
          <label className="block text-[17px] font-bold text-gray-700 mb-3">
            管理・導入会社 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {VENDORS.map(v => (
              <button
                key={v.value}
                onClick={() => setFormData({ ...formData, phoneVendor: v.value, phoneVendorOther: v.value !== 'other' ? '' : formData.phoneVendorOther })}
                className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-lg flex items-center gap-2 ${
                  formData.phoneVendor === v.value
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.phoneVendor === v.value ? { background: '#1E4D8C' } : {}}
              >
                {formData.phoneVendor === v.value && <span className="text-white">✓</span>}
                <span className="flex-1">{v.label}</span>
              </button>
            ))}
          </div>

          {formData.phoneVendor === 'other' && (
            <div className="mt-3 animate-fadeIn">
              <label className="block text-sm text-gray-600 mb-1">→ 会社名を入力してください</label>
              <input
                type="text"
                value={formData.phoneVendorOther}
                onChange={e => setFormData({ ...formData, phoneVendorOther: e.target.value })}
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
