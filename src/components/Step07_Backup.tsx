import { useState } from 'react'
import type { SurveyData } from '../types/survey'

interface Props {
  data: Partial<SurveyData>
  onNext: (data: Partial<SurveyData>) => void
  onBack: () => void
}

const BACKUP_STATUSES = [
  '定期的に実施している',
  '不定期に実施している',
  'していない',
  'わからない'
]

const BACKUP_METHODS = ['外付けHDD', 'NAS', 'クラウドストレージ', 'テープ', 'その他']
const BACKUP_FREQUENCIES = ['毎日', '週1回', '月1回', '不定期']
const RESTORE_TESTS = [
  '定期的に実施している',
  '実施したことがある',
  'したことがない',
  'わからない'
]

const VENDORS = [
  { value: 'suiteq', label: 'スイテック' },
  { value: 'other', label: '他社' },
  { value: 'self', label: '自社管理' },
  { value: 'unknown', label: 'わからない' }
]

export default function Step07_Backup({ data, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    backupStatus: data.backupStatus || '',
    backupMethod: data.backupMethod || [],
    backupFrequency: data.backupFrequency || '',
    backupRestoreTest: data.backupRestoreTest || '',
    backupVendor: data.backupVendor || '',
    backupVendorOther: data.backupVendorOther || ''
  })

  const toggleMethod = (method: string) => {
    const newMethods = formData.backupMethod.includes(method)
      ? formData.backupMethod.filter(m => m !== method)
      : [...formData.backupMethod, method]
    setFormData({ ...formData, backupMethod: newMethods })
  }

  const showDetails = formData.backupStatus === '定期的に実施している' || formData.backupStatus === '不定期に実施している'

  const handleNext = () => {
    onNext(formData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-2">💾</div>
        <h2 className="text-2xl font-bold" style={{ color: '#1E4D8C' }}>バックアップ</h2>
        <p className="text-gray-500 text-sm mt-1">データのバックアップ状況についてお聞かせください</p>
        <p className="text-red-600 text-xs mt-2">※近年ランサムウェア被害が急増しています。バックアップ体制の確認は非常に重要です。</p>
      </div>

      <div className="space-y-6">
        {/* Q1: バックアップを実施していますか */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            バックアップを実施していますか？
          </label>
          <div className="grid grid-cols-1 gap-2">
            {BACKUP_STATUSES.map(status => (
              <button
                key={status}
                onClick={() => setFormData({ ...formData, backupStatus: status })}
                className={`px-5 py-3 rounded-lg border transition-all text-left ${
                  formData.backupStatus === status
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.backupStatus === status ? { background: '#1E4D8C' } : {}}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Q2: バックアップ方法 */}
        {showDetails && (
          <div className="animate-fadeIn">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              バックアップ方法（複数選択可）
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BACKUP_METHODS.map(method => (
                <button
                  key={method}
                  onClick={() => toggleMethod(method)}
                  className={`px-4 py-3 rounded-lg border transition-all ${
                    formData.backupMethod.includes(method)
                      ? 'border-transparent text-white font-semibold'
                      : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                  }`}
                  style={formData.backupMethod.includes(method) ? { background: '#1E4D8C' } : {}}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Q3: バックアップ頻度 */}
        {showDetails && (
          <div className="animate-fadeIn">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              バックアップ頻度
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BACKUP_FREQUENCIES.map(freq => (
                <button
                  key={freq}
                  onClick={() => setFormData({ ...formData, backupFrequency: freq })}
                  className={`px-5 py-3 rounded-lg border transition-all ${
                    formData.backupFrequency === freq
                      ? 'border-transparent text-white font-semibold'
                      : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                  }`}
                  style={formData.backupFrequency === freq ? { background: '#1E4D8C' } : {}}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Q4: 復元テスト */}
        {showDetails && (
          <div className="animate-fadeIn">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              復元テストを実施したことがありますか？
            </label>
            <div className="grid grid-cols-1 gap-2">
              {RESTORE_TESTS.map(test => (
                <button
                  key={test}
                  onClick={() => setFormData({ ...formData, backupRestoreTest: test })}
                  className={`px-5 py-3 rounded-lg border transition-all text-left ${
                    formData.backupRestoreTest === test
                      ? 'border-transparent text-white font-semibold'
                      : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                  }`}
                  style={formData.backupRestoreTest === test ? { background: '#1E4D8C' } : {}}
                >
                  {test}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Q5: 管理・担当会社 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            管理・担当会社（任意）
          </label>
          <div className="grid grid-cols-2 gap-2">
            {VENDORS.map(v => (
              <button
                key={v.value}
                onClick={() => setFormData({ ...formData, backupVendor: v.value, backupVendorOther: v.value !== 'other' ? '' : formData.backupVendorOther })}
                className={`px-5 py-3 rounded-lg border transition-all ${
                  formData.backupVendor === v.value
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.backupVendor === v.value ? { background: '#1E4D8C' } : {}}
              >
                {v.label}
              </button>
            ))}
          </div>

          {formData.backupVendor === 'other' && (
            <div className="mt-3 animate-fadeIn">
              <label className="block text-sm text-gray-600 mb-1">→ 会社名を入力してください</label>
              <input
                type="text"
                value={formData.backupVendorOther}
                onChange={e => setFormData({ ...formData, backupVendorOther: e.target.value })}
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
