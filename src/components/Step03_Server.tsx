import { useState } from 'react'
import type { SurveyData } from '../types/survey'

interface Props {
  data: Partial<SurveyData>
  onNext: (data: Partial<SurveyData>) => void
  onBack: () => void
}

const SERVER_ENVS = ['オンプレミス（自社サーバー）', 'NAS', 'クラウド（AWS・Azure等）', '未導入']
const SERVER_USAGES = ['ファイル共有', 'メールサーバー', '業務システム', 'バックアップ', 'その他']
const VENDORS = [
  { value: 'suiteq', label: 'スイテック' },
  { value: 'other', label: '他社' },
  { value: 'self', label: '自社管理' },
  { value: 'unknown', label: 'わからない' }
]

export default function Step03_Server({ data, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    serverEnv: data.serverEnv || [],
    serverUsage: data.serverUsage || [],
    serverVendor: data.serverVendor || '',
    serverVendorOther: data.serverVendorOther || ''
  })

  const toggleEnv = (env: string) => {
    const newEnvs = formData.serverEnv.includes(env)
      ? formData.serverEnv.filter(e => e !== env)
      : [...formData.serverEnv, env]
    setFormData({ ...formData, serverEnv: newEnvs })
  }

  const toggleUsage = (usage: string) => {
    const newUsages = formData.serverUsage.includes(usage)
      ? formData.serverUsage.filter(u => u !== usage)
      : [...formData.serverUsage, usage]
    setFormData({ ...formData, serverUsage: newUsages })
  }

  const handleNext = () => {
    onNext(formData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-2">🖥️</div>
        <h2 className="text-2xl font-bold" style={{ color: '#1E4D8C' }}>サーバー・クラウド</h2>
        <p className="text-gray-500 text-sm mt-1">データ管理・サーバー環境についてお聞かせください</p>
      </div>

      <div className="space-y-6">
        {/* Q1: 現在の環境 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            現在の環境（複数選択可）
          </label>
          <div className="grid grid-cols-1 gap-2">
            {SERVER_ENVS.map(env => (
              <button
                key={env}
                onClick={() => toggleEnv(env)}
                className={`px-5 py-3 rounded-lg border transition-all text-left ${
                  formData.serverEnv.includes(env)
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.serverEnv.includes(env) ? { background: '#1E4D8C' } : {}}
              >
                {env}
              </button>
            ))}
          </div>
        </div>

        {/* Q2: 主な用途 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            主な用途（複数選択可・任意）
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SERVER_USAGES.map(usage => (
              <button
                key={usage}
                onClick={() => toggleUsage(usage)}
                className={`px-4 py-3 rounded-lg border transition-all ${
                  formData.serverUsage.includes(usage)
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.serverUsage.includes(usage) ? { background: '#1E4D8C' } : {}}
              >
                {usage}
              </button>
            ))}
          </div>
        </div>

        {/* Q3: 管理・導入会社 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            管理・導入会社
          </label>
          <div className="grid grid-cols-2 gap-2">
            {VENDORS.map(v => (
              <button
                key={v.value}
                onClick={() => setFormData({ ...formData, serverVendor: v.value, serverVendorOther: v.value !== 'other' ? '' : formData.serverVendorOther })}
                className={`px-5 py-3 rounded-lg border transition-all ${
                  formData.serverVendor === v.value
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.serverVendor === v.value ? { background: '#1E4D8C' } : {}}
              >
                {v.label}
              </button>
            ))}
          </div>

          {formData.serverVendor === 'other' && (
            <div className="mt-3 animate-fadeIn">
              <label className="block text-sm text-gray-600 mb-1">→ 会社名を入力してください</label>
              <input
                type="text"
                value={formData.serverVendorOther}
                onChange={e => setFormData({ ...formData, serverVendorOther: e.target.value })}
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
