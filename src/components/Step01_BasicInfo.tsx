import { useState } from 'react'
import type { SurveyData } from '../types/survey'

interface Props {
  data: Partial<SurveyData>
  onNext: (data: Partial<SurveyData>) => void
  onBack: () => void
}

const INDUSTRIES = ['製造業', '卸売業', '小売業', '建設業', '医療・福祉', 'サービス業', 'その他']
const SCALES = ['〜9名', '10〜29名', '30〜99名', '100名以上']
const YEARS = ['1年未満', '1〜3年', '3〜10年', '10年以上']

const inputClass = 'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
const labelClass = 'block text-[17px] font-bold text-gray-700 mb-3'
const buttonClass = (selected: boolean) => `min-h-[60px] px-5 py-4 rounded-lg border transition-all text-left text-lg flex items-center gap-2 ${
  selected
    ? 'border-transparent text-white font-semibold'
    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
}`

export default function Step01_BasicInfo({ data, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    companyName: data.companyName || '',
    industry: data.industry || '',
    employeeSize: data.employeeSize || '',
    contactName: data.contactName || '',
    email: data.email || '',
    salesRepName: data.salesRepName || '',
    relationshipYears: data.relationshipYears || ''
  })

  const set = (key: keyof typeof formData, val: string) => setFormData({ ...formData, [key]: val })

  const handleNext = () => {
    onNext(formData)
  }

  return (
    <div className="space-y-8">
      {/* タイトル */}
      <div className="text-center">
        <div className="text-4xl mb-2">🏢</div>
        <h2 className="text-2xl font-bold" style={{ color: '#1E4D8C' }}>基本情報</h2>
        <p className="text-gray-500 text-sm mt-1">お客様の基本情報をご入力ください</p>
      </div>

      <div className="space-y-8">
        {/* 会社名 */}
        <div>
          <label className={labelClass}>会社名</label>
          <input className={inputClass} placeholder="例）株式会社スイテック" value={formData.companyName} onChange={e => set('companyName', e.target.value)} />
        </div>

        {/* 業種 */}
        <div>
          <label className={labelClass}>業種</label>
          <select className={inputClass} value={formData.industry} onChange={e => set('industry', e.target.value)}>
            <option value="">選択してください</option>
            {INDUSTRIES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        {/* 従業員規模 */}
        <div>
          <label className={labelClass}>従業員規模</label>
          <div className="grid grid-cols-2 gap-3">
            {SCALES.map(v => (
              <button
                key={v}
                onClick={() => set('employeeSize', v)}
                className={buttonClass(formData.employeeSize === v)}
                style={formData.employeeSize === v ? { background: '#1E4D8C' } : {}}
              >
                {formData.employeeSize === v && <span className="text-white">✓</span>}
                <span className="flex-1">{v}</span>
              </button>
            ))}
          </div>
        </div>

        {/* お名前 */}
        <div>
          <label className={labelClass}>お名前</label>
          <input className={inputClass} placeholder="例）山田 太郎" value={formData.contactName} onChange={e => set('contactName', e.target.value)} />
        </div>

        {/* メールアドレス */}
        <div>
          <label className={labelClass}>メールアドレス</label>
          <input className={inputClass} type="email" placeholder="例）yamada@example.com" value={formData.email} onChange={e => set('email', e.target.value)} />
        </div>

        {/* 担当スイテック営業名 */}
        <div>
          <label className={labelClass}>担当スイテック営業名</label>
          <input className={inputClass} placeholder="例）鈴木 一郎" value={formData.salesRepName} onChange={e => set('salesRepName', e.target.value)} />
        </div>

        {/* お付き合い年数 */}
        <div>
          <label className={labelClass}>スイテックとのお付き合い年数</label>
          <div className="grid grid-cols-2 gap-3">
            {YEARS.map(v => (
              <button
                key={v}
                onClick={() => set('relationshipYears', v)}
                className={buttonClass(formData.relationshipYears === v)}
                style={formData.relationshipYears === v ? { background: '#1E4D8C' } : {}}
              >
                {formData.relationshipYears === v && <span className="text-white">✓</span>}
                <span className="flex-1">{v}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ボタン */}
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
