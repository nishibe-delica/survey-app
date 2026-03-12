import { useState } from 'react'
import type { SurveyData } from '../types/survey'

interface Props {
  data: Partial<SurveyData>
  onNext: (data: Partial<SurveyData>) => void
  onBack: () => void
}

const MAINTENANCE_STATUSES = [
  '全ての機器・システムで契約済み',
  '一部のみ契約',
  '契約していない',
  'わからない'
]

const EXPIRED_ITEMS = [
  'PC・端末',
  'サーバー',
  'ネットワーク機器',
  '複合機',
  '電話機',
  '特になし'
]

const VENDORS = [
  { value: 'suiteq', label: 'スイテック' },
  { value: 'other', label: '他社' },
  { value: 'self', label: '社内で対応' },
  { value: 'none', label: '相談先がない' }
]

export default function Step11_Maintenance({ data, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    maintenanceStatus: data.maintenanceStatus || '',
    maintenanceExpired: data.maintenanceExpired || [],
    maintenanceVendor: data.maintenanceVendor || '',
    maintenanceVendorOther: data.maintenanceVendorOther || ''
  })

  const toggleExpired = (item: string) => {
    const newExpired = formData.maintenanceExpired.includes(item)
      ? formData.maintenanceExpired.filter(i => i !== item)
      : [...formData.maintenanceExpired, item]
    setFormData({ ...formData, maintenanceExpired: newExpired })
  }

  const handleNext = () => {
    onNext(formData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-2">🔧</div>
        <h2 className="text-2xl font-bold" style={{ color: '#1E4D8C' }}>保守・サポート契約</h2>
        <p className="text-gray-500 text-sm mt-1">機器・システムの保守サポート状況についてお聞かせください</p>
        <p className="text-red-600 text-xs mt-2">※保守サポートが切れた機器はトラブル時に修理できない場合があります</p>
      </div>

      <div className="space-y-8">
        {/* Q1: 現在の保守サポート契約状況 */}
        <div>
          <label className="block text-[17px] font-bold text-gray-700 mb-3">
            現在の保守サポート契約状況
          </label>
          <div className="grid grid-cols-1 gap-3">
            {MAINTENANCE_STATUSES.map(status => (
              <button
                key={status}
                onClick={() => setFormData({ ...formData, maintenanceStatus: status })}
                className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-left text-lg flex items-center gap-2 ${
                  formData.maintenanceStatus === status
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.maintenanceStatus === status ? { background: '#1E4D8C' } : {}}
              >
                {formData.maintenanceStatus === status && <span className="text-white">✓</span>}
                <span className="flex-1">{status}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Q2: 保守サポートが切れている機器 */}
        <div>
          <label className="block text-[17px] font-bold text-gray-700 mb-3">
            保守サポートが切れている（または不明な）機器・システム（複数選択可・任意）
          </label>
          <div className="grid grid-cols-2 gap-3">
            {EXPIRED_ITEMS.map(item => (
              <button
                key={item}
                onClick={() => toggleExpired(item)}
                className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-lg flex items-center gap-2 ${
                  formData.maintenanceExpired.includes(item)
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.maintenanceExpired.includes(item) ? { background: '#1E4D8C' } : {}}
              >
                {formData.maintenanceExpired.includes(item) && <span className="text-white">✓</span>}
                <span className="flex-1">{item}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Q3: IT機器・システムの相談先 */}
        <div>
          <label className="block text-[17px] font-bold text-gray-700 mb-3">
            IT機器・システムの相談先（任意）
          </label>
          <div className="grid grid-cols-2 gap-3">
            {VENDORS.map(v => (
              <button
                key={v.value}
                onClick={() => setFormData({ ...formData, maintenanceVendor: v.value, maintenanceVendorOther: v.value !== 'other' ? '' : formData.maintenanceVendorOther })}
                className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-lg flex items-center gap-2 ${
                  formData.maintenanceVendor === v.value
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.maintenanceVendor === v.value ? { background: '#1E4D8C' } : {}}
              >
                {formData.maintenanceVendor === v.value && <span className="text-white">✓</span>}
                <span className="flex-1">{v.label}</span>
              </button>
            ))}
          </div>

          {formData.maintenanceVendor === 'other' && (
            <div className="mt-3 animate-fadeIn">
              <label className="block text-sm text-gray-600 mb-1">→ 会社名を入力してください</label>
              <input
                type="text"
                value={formData.maintenanceVendorOther}
                onChange={e => setFormData({ ...formData, maintenanceVendorOther: e.target.value })}
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
