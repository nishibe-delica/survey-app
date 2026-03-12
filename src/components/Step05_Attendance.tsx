import { useState } from 'react'
import type { SurveyData } from '../types/survey'

interface Props {
  data: Partial<SurveyData>
  onNext: (data: Partial<SurveyData>) => void
  onBack: () => void
}

const ATTENDANCE_METHODS = [
  'タイムカード',
  '紙・手書き',
  'Excel等の表計算',
  '勤怠管理システム',
  'その他'
]

const VENDORS = [
  { value: 'suiteq', label: 'スイテック' },
  { value: 'other', label: '他社' },
  { value: 'self', label: '自社' },
  { value: 'unknown', label: 'わからない' }
]

export default function Step05_Attendance({ data, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    attendanceMethod: data.attendanceMethod || '',
    attendanceSystemName: data.attendanceSystemName || '',
    attendanceVendor: data.attendanceVendor || '',
    attendanceVendorOther: data.attendanceVendorOther || ''
  })

  const showSystemName = formData.attendanceMethod === '勤怠管理システム'
  const showVendor = formData.attendanceMethod === '勤怠管理システム' || formData.attendanceMethod === '検討中'

  const handleNext = () => {
    onNext(formData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-2">⏰</div>
        <h2 className="text-2xl font-bold" style={{ color: '#1E4D8C' }}>勤怠管理</h2>
        <p className="text-gray-500 text-sm mt-1">出退勤・勤務時間の管理方法についてお聞かせください</p>
      </div>

      <div className="space-y-6">
        {/* Q1: 現在の勤怠管理方法 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            現在の勤怠管理方法は？
          </label>
          <div className="grid grid-cols-1 gap-2">
            {ATTENDANCE_METHODS.map(method => (
              <button
                key={method}
                onClick={() => setFormData({ ...formData, attendanceMethod: method })}
                className={`px-5 py-3 rounded-lg border transition-all text-left ${
                  formData.attendanceMethod === method
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.attendanceMethod === method ? { background: '#1E4D8C' } : {}}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Q2: 利用中のシステム名 */}
        {showSystemName && (
          <div className="animate-fadeIn">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              利用中のシステム名（任意）
            </label>
            <input
              type="text"
              value={formData.attendanceSystemName}
              onChange={e => setFormData({ ...formData, attendanceSystemName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例）ジョブカン、freee人事労務、KING OF TIME など"
            />
          </div>
        )}

        {/* Q3: 導入・管理会社 */}
        {showVendor && (
          <div className="animate-fadeIn">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              導入・管理会社
            </label>
            <div className="grid grid-cols-2 gap-2">
              {VENDORS.map(v => (
                <button
                  key={v.value}
                  onClick={() => setFormData({ ...formData, attendanceVendor: v.value, attendanceVendorOther: v.value !== 'other' ? '' : formData.attendanceVendorOther })}
                  className={`px-5 py-3 rounded-lg border transition-all ${
                    formData.attendanceVendor === v.value
                      ? 'border-transparent text-white font-semibold'
                      : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                  }`}
                  style={formData.attendanceVendor === v.value ? { background: '#1E4D8C' } : {}}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {formData.attendanceVendor === 'other' && (
              <div className="mt-3 animate-fadeIn">
                <label className="block text-sm text-gray-600 mb-1">→ 会社名を入力してください</label>
                <input
                  type="text"
                  value={formData.attendanceVendorOther}
                  onChange={e => setFormData({ ...formData, attendanceVendorOther: e.target.value })}
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
          className="flex-1 py-3 rounded-lg font-bold text-white transition-all"
          style={{ background: '#1E4D8C' }}
        >
          次へ →
        </button>
      </div>
    </div>
  )
}
