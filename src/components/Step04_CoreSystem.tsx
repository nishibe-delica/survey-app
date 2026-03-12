import { useState } from 'react'
import type { SurveyData } from '../types/survey'

interface Props {
  data: Partial<SurveyData>
  onNext: (data: Partial<SurveyData>) => void
  onBack: () => void
}

const STATUSES = [
  { value: '導入済み', label: '導入済み' },
  { value: '検討中', label: '検討中' },
  { value: '未導入', label: '未導入' }
]

const SYSTEM_TYPES = ['販売管理', '在庫管理', '会計・財務', '生産管理', 'CRM（顧客管理）', 'その他']
const CLOUD_TYPES = ['クラウド型（SaaS）', 'オンプレミス（自社設置）', '不明']
const AGES = ['3年未満', '3〜7年', '7年以上', '不明']
const VENDORS = [
  { value: 'suiteq', label: 'スイテック' },
  { value: 'other', label: '他社' },
  { value: 'self', label: '自社開発' },
  { value: 'unknown', label: 'わからない' }
]

export default function Step04_CoreSystem({ data, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    coreSystemStatus: data.coreSystemStatus || '',
    coreSystemTypes: data.coreSystemTypes || [],
    coreSystemName: data.coreSystemName || '',
    coreSystemCloud: data.coreSystemCloud || '',
    coreSystemAge: data.coreSystemAge || '',
    coreSystemVendor: data.coreSystemVendor || '',
    coreSystemVendorOther: data.coreSystemVendorOther || ''
  })

  const toggleType = (type: string) => {
    const newTypes = formData.coreSystemTypes.includes(type)
      ? formData.coreSystemTypes.filter(t => t !== type)
      : [...formData.coreSystemTypes, type]
    setFormData({ ...formData, coreSystemTypes: newTypes })
  }

  const showDetails = formData.coreSystemStatus === '導入済み'

  const handleNext = () => {
    onNext(formData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-2">📊</div>
        <h2 className="text-2xl font-bold" style={{ color: '#1E4D8C' }}>基幹システム</h2>
        <p className="text-gray-500 text-sm mt-1">受注・販売・会計など業務の中核となるシステムについてお聞かせください</p>
      </div>

      <div className="space-y-8">
        {/* Q1: 導入状況 */}
        <div>
          <label className="block text-[17px] font-bold text-gray-700 mb-3">
            導入状況
          </label>
          <div className="grid grid-cols-3 gap-3">
            {STATUSES.map(s => (
              <button
                key={s.value}
                onClick={() => setFormData({ ...formData, coreSystemStatus: s.value })}
                className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-left text-lg flex items-center gap-2 ${
                  formData.coreSystemStatus === s.value
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.coreSystemStatus === s.value ? { background: '#1E4D8C' } : {}}
              >
                {formData.coreSystemStatus === s.value && <span className="text-white">✓</span>}
                <span className="flex-1">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Q2: 利用中のシステム種類 */}
        {showDetails && (
          <div className="animate-fadeIn">
            <label className="block text-[17px] font-bold text-gray-700 mb-3">
              利用中のシステム種類（複数選択可）
            </label>
            <div className="grid grid-cols-2 gap-3">
              {SYSTEM_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-left text-lg flex items-center gap-2 ${
                    formData.coreSystemTypes.includes(type)
                      ? 'border-transparent text-white font-semibold'
                      : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                  }`}
                  style={formData.coreSystemTypes.includes(type) ? { background: '#1E4D8C' } : {}}
                >
                  {formData.coreSystemTypes.includes(type) && <span className="text-white">✓</span>}
                  <span className="flex-1">{type}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Q3: システム名 */}
        {showDetails && (
          <div className="animate-fadeIn">
            <label className="block text-[17px] font-bold text-gray-700 mb-3">
              システム名（任意）
            </label>
            <input
              type="text"
              value={formData.coreSystemName}
              onChange={e => setFormData({ ...formData, coreSystemName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例）弥生、マネーフォワード、SAP、独自開発 など"
            />
          </div>
        )}

        {/* Q4: システムの種類 */}
        {showDetails && (
          <div className="animate-fadeIn">
            <label className="block text-[17px] font-bold text-gray-700 mb-3">
              システムの種類
            </label>
            <div className="grid grid-cols-1 gap-3">
              {CLOUD_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setFormData({ ...formData, coreSystemCloud: type })}
                  className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-left text-lg flex items-center gap-2 ${
                    formData.coreSystemCloud === type
                      ? 'border-transparent text-white font-semibold'
                      : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                  }`}
                  style={formData.coreSystemCloud === type ? { background: '#1E4D8C' } : {}}
                >
                  {formData.coreSystemCloud === type && <span className="text-white">✓</span>}
                  <span className="flex-1">{type}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Q5: 導入からの年数 */}
        {showDetails && (
          <div className="animate-fadeIn">
            <label className="block text-[17px] font-bold text-gray-700 mb-3">
              導入からの年数
            </label>
            <div className="grid grid-cols-2 gap-3">
              {AGES.map(age => (
                <button
                  key={age}
                  onClick={() => setFormData({ ...formData, coreSystemAge: age })}
                  className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-left text-lg flex items-center gap-2 ${
                    formData.coreSystemAge === age
                      ? 'border-transparent text-white font-semibold'
                      : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                  }`}
                  style={formData.coreSystemAge === age ? { background: '#1E4D8C' } : {}}
                >
                  {formData.coreSystemAge === age && <span className="text-white">✓</span>}
                  <span className="flex-1">{age}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Q6: 導入・管理会社 */}
        <div>
          <label className="block text-[17px] font-bold text-gray-700 mb-3">
            導入・管理会社
          </label>
          <div className="grid grid-cols-2 gap-3">
            {VENDORS.map(v => (
              <button
                key={v.value}
                onClick={() => setFormData({ ...formData, coreSystemVendor: v.value, coreSystemVendorOther: v.value !== 'other' ? '' : formData.coreSystemVendorOther })}
                className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-left text-lg flex items-center gap-2 ${
                  formData.coreSystemVendor === v.value
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.coreSystemVendor === v.value ? { background: '#1E4D8C' } : {}}
              >
                {formData.coreSystemVendor === v.value && <span className="text-white">✓</span>}
                <span className="flex-1">{v.label}</span>
              </button>
            ))}
          </div>

          {formData.coreSystemVendor === 'other' && (
            <div className="mt-3 animate-fadeIn">
              <label className="block text-sm text-gray-600 mb-1">→ 会社名を入力してください</label>
              <input
                type="text"
                value={formData.coreSystemVendorOther}
                onChange={e => setFormData({ ...formData, coreSystemVendorOther: e.target.value })}
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
