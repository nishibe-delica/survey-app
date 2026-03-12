import { useState } from 'react'
import type { SurveyData } from '../types/survey'

interface Props {
  data: Partial<SurveyData>
  onNext: (data: Partial<SurveyData>) => void
  onBack: () => void
}

const MFP_MAKERS = ['富士フイルム', 'リコー', 'コニカミノルタ', 'キヤノン', 'その他']
const VENDORS = [
  { value: 'suiteq', label: 'スイテック' },
  { value: 'other', label: '他社' },
  { value: 'unknown', label: '不明' }
]
const REPLACE_TIMES = ['1年以内', '1〜3年', '3年以上先', '未定']

export default function Step08_MFP({ data, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    mfpMakers: data.mfpMakers || [],
    mfpVendor: data.mfpVendor || '',
    mfpVendorOther: data.mfpVendorOther || '',
    mfpReplaceTime: data.mfpReplaceTime || ''
  })

  const toggleMaker = (maker: string) => {
    const newMakers = formData.mfpMakers.includes(maker)
      ? formData.mfpMakers.filter(m => m !== maker)
      : [...formData.mfpMakers, maker]
    setFormData({ ...formData, mfpMakers: newMakers })
  }

  const canNext = formData.mfpMakers.length > 0 && formData.mfpVendor && formData.mfpReplaceTime &&
                  (formData.mfpVendor !== 'other' || formData.mfpVendorOther.trim())

  const handleNext = () => {
    if (canNext) onNext(formData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-2">🖨️</div>
        <h2 className="text-2xl font-bold" style={{ color: '#1E4D8C' }}>複合機・MFP</h2>
        <p className="text-gray-500 text-sm mt-1">コピー機・複合機・プリンターについてお聞かせください</p>
      </div>

      <div className="space-y-8">
        {/* 質問1：メーカー */}
        <div>
          <label className="block text-[17px] font-bold text-gray-700 mb-3">
            メーカー（複数選択可） <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 gap-3">
            {MFP_MAKERS.map(maker => (
              <button
                key={maker}
                onClick={() => toggleMaker(maker)}
                className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-left text-lg flex items-center gap-2 ${
                  formData.mfpMakers.includes(maker)
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.mfpMakers.includes(maker) ? { background: '#1E4D8C' } : {}}
              >
                {formData.mfpMakers.includes(maker) && <span className="text-white">✓</span>}
                <span className="flex-1">{maker}</span>
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
                onClick={() => setFormData({ ...formData, mfpVendor: v.value, mfpVendorOther: v.value !== 'other' ? '' : formData.mfpVendorOther })}
                className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-lg flex items-center gap-2 ${
                  formData.mfpVendor === v.value
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.mfpVendor === v.value ? { background: '#1E4D8C' } : {}}
              >
                {formData.mfpVendor === v.value && <span className="text-white">✓</span>}
                <span className="flex-1">{v.label}</span>
              </button>
            ))}
          </div>

          {formData.mfpVendor === 'other' && (
            <div className="mt-3 animate-fadeIn">
              <label className="block text-sm text-gray-600 mb-1">→ 会社名を入力してください</label>
              <input
                type="text"
                value={formData.mfpVendorOther}
                onChange={e => setFormData({ ...formData, mfpVendorOther: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例）○○株式会社"
              />
            </div>
          )}
        </div>

        {/* 質問3：次回リプレイス時期 */}
        <div>
          <label className="block text-[17px] font-bold text-gray-700 mb-3">
            次回リプレイス時期の目安 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {REPLACE_TIMES.map(time => (
              <button
                key={time}
                onClick={() => setFormData({ ...formData, mfpReplaceTime: time })}
                className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-lg flex items-center gap-2 ${
                  formData.mfpReplaceTime === time
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.mfpReplaceTime === time ? { background: '#1E4D8C' } : {}}
              >
                {formData.mfpReplaceTime === time && <span className="text-white">✓</span>}
                <span className="flex-1">{time}</span>
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
