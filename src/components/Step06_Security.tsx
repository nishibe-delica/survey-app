import { useState } from 'react'
import type { SurveyData } from '../types/survey'

interface Props {
  data: Partial<SurveyData>
  onNext: (data: Partial<SurveyData>) => void
  onBack: () => void
}

const SECURITY_ITEMS = ['ウイルス対策ソフト', 'UTM（統合脅威管理）', 'EDR', '未対応', 'わからない']
const LICENSE_COUNTS = ['〜10本', '11〜30本', '31〜100本', '100本以上', '不明']
const LAST_CHECKS = ['1年以内', '1〜3年前', '3年以上前', '受けたことがない', 'わからない']
const VENDORS = [
  { value: 'suiteq', label: 'スイテック' },
  { value: 'other', label: '他社' },
  { value: 'self', label: '自社管理' },
  { value: 'none', label: '未導入' }
]

export default function Step06_Security({ data, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    securityStatus: data.securityStatus || [],
    securityLicenseCount: data.securityLicenseCount || '',
    securityLastCheck: data.securityLastCheck || '',
    securityVendor: data.securityVendor || '',
    securityVendorOther: data.securityVendorOther || ''
  })

  const toggleStatus = (status: string) => {
    const newStatus = formData.securityStatus.includes(status)
      ? formData.securityStatus.filter(s => s !== status)
      : [...formData.securityStatus, status]
    setFormData({ ...formData, securityStatus: newStatus })
  }

  const showLicense = formData.securityStatus.includes('ウイルス対策ソフト')

  const handleNext = () => {
    onNext(formData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-2">🔒</div>
        <h2 className="text-2xl font-bold" style={{ color: '#1E4D8C' }}>セキュリティ</h2>
        <p className="text-gray-500 text-sm mt-1">情報セキュリティ対策の状況についてお聞かせください</p>
      </div>

      <div className="space-y-8">
        {/* Q1: 現在の対策状況 */}
        <div>
          <label className="block text-[17px] font-bold text-gray-700 mb-3">
            現在の対策状況（複数選択可）
          </label>
          <div className="grid grid-cols-1 gap-3">
            {SECURITY_ITEMS.map(item => (
              <button
                key={item}
                onClick={() => toggleStatus(item)}
                className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-left text-lg flex items-center gap-2 ${
                  formData.securityStatus.includes(item)
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.securityStatus.includes(item) ? { background: '#1E4D8C' } : {}}
              >
                {formData.securityStatus.includes(item) && <span className="text-white">✓</span>}
                <span className="flex-1">{item}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Q2: ライセンス本数 */}
        {showLicense && (
          <div className="animate-fadeIn">
            <label className="block text-[17px] font-bold text-gray-700 mb-3">
              ウイルス対策ソフトのライセンス本数（任意）
            </label>
            <div className="grid grid-cols-2 gap-3">
              {LICENSE_COUNTS.map(count => (
                <button
                  key={count}
                  onClick={() => setFormData({ ...formData, securityLicenseCount: count })}
                  className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-lg flex items-center gap-2 ${
                    formData.securityLicenseCount === count
                      ? 'border-transparent text-white font-semibold'
                      : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                  }`}
                  style={formData.securityLicenseCount === count ? { background: '#1E4D8C' } : {}}
                >
                  {formData.securityLicenseCount === count && <span className="text-white">✓</span>}
                  <span className="flex-1">{count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Q3: 最後にセキュリティ診断を受けた時期 */}
        <div>
          <label className="block text-[17px] font-bold text-gray-700 mb-3">
            最後にセキュリティ診断を受けた時期（任意）
          </label>
          <div className="grid grid-cols-2 gap-3">
            {LAST_CHECKS.map(check => (
              <button
                key={check}
                onClick={() => setFormData({ ...formData, securityLastCheck: check })}
                className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-lg flex items-center gap-2 ${
                  formData.securityLastCheck === check
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.securityLastCheck === check ? { background: '#1E4D8C' } : {}}
              >
                {formData.securityLastCheck === check && <span className="text-white">✓</span>}
                <span className="flex-1">{check}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Q4: 管理・導入会社 */}
        <div>
          <label className="block text-[17px] font-bold text-gray-700 mb-3">
            管理・導入会社
          </label>
          <div className="grid grid-cols-2 gap-3">
            {VENDORS.map(v => (
              <button
                key={v.value}
                onClick={() => setFormData({ ...formData, securityVendor: v.value, securityVendorOther: v.value !== 'other' ? '' : formData.securityVendorOther })}
                className={`min-h-[60px] px-5 py-4 rounded-lg border transition-all text-lg flex items-center gap-2 ${
                  formData.securityVendor === v.value
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.securityVendor === v.value ? { background: '#1E4D8C' } : {}}
              >
                {formData.securityVendor === v.value && <span className="text-white">✓</span>}
                <span className="flex-1">{v.label}</span>
              </button>
            ))}
          </div>

          {formData.securityVendor === 'other' && (
            <div className="mt-3 animate-fadeIn">
              <label className="block text-sm text-gray-600 mb-1">→ 会社名を入力してください</label>
              <input
                type="text"
                value={formData.securityVendorOther}
                onChange={e => setFormData({ ...formData, securityVendorOther: e.target.value })}
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
