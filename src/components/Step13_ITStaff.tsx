import { useState } from 'react'
import type { SurveyData } from '../types/survey'

interface Props {
  data: Partial<SurveyData>
  onNext: (data: Partial<SurveyData>) => void
  onBack: () => void
}

const STAFF_STATUSES = [
  'IT専任担当者がいる',
  '他業務と兼任している',
  'IT担当者がいない'
]

const OUTSOURCE_STATUSES = [
  '全てアウトソースしている',
  '一部アウトソースしている',
  'していない'
]

const CONSULTATIONS = [
  { value: 'suiteq', label: 'スイテック' },
  { value: 'other', label: '他社のITベンダー' },
  { value: 'self', label: '社内で完結' },
  { value: 'none', label: '相談先がない' }
]

export default function Step13_ITStaff({ data, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    itStaffStatus: data.itStaffStatus || '',
    itOutsource: data.itOutsource || '',
    itConsultation: data.itConsultation || '',
    itConsultationOther: data.itConsultationOther || ''
  })

  const handleNext = () => {
    onNext(formData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-2">👥</div>
        <h2 className="text-2xl font-bold" style={{ color: '#1E4D8C' }}>IT担当・体制</h2>
        <p className="text-gray-500 text-sm mt-1">社内のIT管理体制についてお聞かせください</p>
      </div>

      <div className="space-y-8">
        {/* Q1: 社内のIT担当者 */}
        <div>
          <label className="block text-[17px] font-bold text-gray-700 mb-3">
            社内のIT担当者は？
          </label>
          <div className="grid grid-cols-1 gap-3">
            {STAFF_STATUSES.map(status => (
              <button
                key={status}
                onClick={() => setFormData({ ...formData, itStaffStatus: status })}
                className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-left text-lg flex items-center gap-2 ${
                  formData.itStaffStatus === status
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.itStaffStatus === status ? { background: '#1E4D8C' } : {}}
              >
                {formData.itStaffStatus === status && <span className="text-white">✓</span>}
                <span className="flex-1">{status}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Q2: IT管理のアウトソース状況 */}
        <div>
          <label className="block text-[17px] font-bold text-gray-700 mb-3">
            IT管理のアウトソース状況（任意）
          </label>
          <div className="grid grid-cols-1 gap-3">
            {OUTSOURCE_STATUSES.map(status => (
              <button
                key={status}
                onClick={() => setFormData({ ...formData, itOutsource: status })}
                className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-left text-lg flex items-center gap-2 ${
                  formData.itOutsource === status
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.itOutsource === status ? { background: '#1E4D8C' } : {}}
              >
                {formData.itOutsource === status && <span className="text-white">✓</span>}
                <span className="flex-1">{status}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Q3: ITに関する相談先 */}
        <div>
          <label className="block text-[17px] font-bold text-gray-700 mb-3">
            ITに関する相談先（任意）
          </label>
          <div className="grid grid-cols-2 gap-3">
            {CONSULTATIONS.map(c => (
              <button
                key={c.value}
                onClick={() => setFormData({ ...formData, itConsultation: c.value, itConsultationOther: c.value !== 'other' ? '' : formData.itConsultationOther })}
                className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-lg flex items-center gap-2 ${
                  formData.itConsultation === c.value
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.itConsultation === c.value ? { background: '#1E4D8C' } : {}}
              >
                {formData.itConsultation === c.value && <span className="text-white">✓</span>}
                <span className="flex-1">{c.label}</span>
              </button>
            ))}
          </div>

          {formData.itConsultation === 'other' && (
            <div className="mt-3 animate-fadeIn">
              <label className="block text-sm text-gray-600 mb-1">→ 会社名を入力してください</label>
              <input
                type="text"
                value={formData.itConsultationOther}
                onChange={e => setFormData({ ...formData, itConsultationOther: e.target.value })}
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
