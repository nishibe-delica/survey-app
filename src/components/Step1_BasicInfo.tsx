import type { BasicInfo } from '../types/survey'

interface Props {
  data: BasicInfo
  onChange: (data: BasicInfo) => void
  onNext: () => void
}

const INDUSTRIES = ['製造業', '卸売業', '小売業', '建設業', '医療・福祉', 'サービス業', 'その他']
const SCALES = ['〜9名', '10〜29名', '30〜99名', '100名以上']
const YEARS = ['1年未満', '1〜3年', '3〜10年', '10年以上']

const inputClass = 'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5'

export default function Step1_BasicInfo({ data, onChange, onNext }: Props) {
  const set = (key: keyof BasicInfo, val: string) => onChange({ ...data, [key]: val })

  const canNext = data.company && data.industry && data.scale && data.name && data.email && data.salesName && data.years

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Step 1：基本情報</h2>
        <p className="text-gray-500 text-sm mt-1">お客様の基本情報をご入力ください</p>
      </div>

      <div className="space-y-4">
        {/* 会社名 */}
        <div>
          <label className={labelClass}>会社名 <span className="text-red-500">*</span></label>
          <input className={inputClass} placeholder="例）株式会社スイテック" value={data.company} onChange={e => set('company', e.target.value)} />
        </div>

        {/* 業種 */}
        <div>
          <label className={labelClass}>業種 <span className="text-red-500">*</span></label>
          <select className={inputClass} value={data.industry} onChange={e => set('industry', e.target.value)}>
            <option value="">選択してください</option>
            {INDUSTRIES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        {/* 従業員規模 */}
        <div>
          <label className={labelClass}>従業員規模 <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap gap-3">
            {SCALES.map(v => (
              <label key={v} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${data.scale === v ? 'border-blue-700 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-300 text-gray-600 hover:border-blue-300'}`}>
                <input type="radio" className="hidden" checked={data.scale === v} onChange={() => set('scale', v)} />
                {v}
              </label>
            ))}
          </div>
        </div>

        {/* お名前 */}
        <div>
          <label className={labelClass}>お名前 <span className="text-red-500">*</span></label>
          <input className={inputClass} placeholder="例）山田 太郎" value={data.name} onChange={e => set('name', e.target.value)} />
        </div>

        {/* メールアドレス */}
        <div>
          <label className={labelClass}>メールアドレス <span className="text-red-500">*</span></label>
          <input className={inputClass} type="email" placeholder="例）yamada@example.com" value={data.email} onChange={e => set('email', e.target.value)} />
        </div>

        {/* 担当スイテック営業名 */}
        <div>
          <label className={labelClass}>担当スイテック営業名 <span className="text-red-500">*</span></label>
          <input className={inputClass} placeholder="例）鈴木 一郎" value={data.salesName} onChange={e => set('salesName', e.target.value)} />
        </div>

        {/* お付き合い年数 */}
        <div>
          <label className={labelClass}>スイテックとのお付き合い年数 <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap gap-3">
            {YEARS.map(v => (
              <label key={v} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${data.years === v ? 'border-blue-700 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-300 text-gray-600 hover:border-blue-300'}`}>
                <input type="radio" className="hidden" checked={data.years === v} onChange={() => set('years', v)} />
                {v}
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!canNext}
        className="w-full py-3 rounded-xl font-bold text-white text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: canNext ? '#1E4D8C' : undefined }}
      >
        次へ →
      </button>
    </div>
  )
}
