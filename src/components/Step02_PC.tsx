import { useState } from 'react'
import type { SurveyData } from '../types/survey'

interface Props {
  data: Partial<SurveyData>
  onNext: (data: Partial<SurveyData>) => void
  onBack: () => void
}

const PC_MAKERS = ['富士通', 'NEC', 'Dell', 'HP', 'Lenovo', 'その他']
const VENDORS = [
  { value: 'suiteq', label: 'スイテック' },
  { value: 'other', label: '他社' },
  { value: 'direct', label: 'メーカー直販' },
  { value: 'retail', label: '量販店' }
]
const CONTRACTS = ['購入', 'リース', 'レンタル', '混在']
const LEASE_ENDS = ['1年以内', '1〜3年', '3年以上先', '不明']
const PC_COUNTS = ['〜10台', '11〜30台', '31〜100台', '100台以上']
const PC_TYPES = ['デスクトップPC', 'ノートPC', 'タブレット', 'その他']

export default function Step02_PC({ data, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    pcMaker: data.pcMaker || '',
    pcMakerOther: data.pcMakerOther || '',
    pcVendor: data.pcVendor || '',
    pcVendorOther: data.pcVendorOther || '',
    pcContract: data.pcContract || '',
    pcLeaseEnd: data.pcLeaseEnd || '',
    pcCount: data.pcCount || '',
    pcTypes: data.pcTypes || []
  })

  const toggleType = (type: string) => {
    const newTypes = formData.pcTypes.includes(type)
      ? formData.pcTypes.filter(t => t !== type)
      : [...formData.pcTypes, type]
    setFormData({ ...formData, pcTypes: newTypes })
  }

  const handleNext = () => {
    onNext(formData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-2">💻</div>
        <h2 className="text-2xl font-bold" style={{ color: '#1E4D8C' }}>パソコン・端末</h2>
        <p className="text-gray-500 text-sm mt-1">パソコンやタブレットの導入状況をお聞かせください</p>
      </div>

      <div className="space-y-6">
        {/* Q1: 主なメーカー */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            主なメーカーは？（複数選択可）
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PC_MAKERS.map(maker => (
              <button
                key={maker}
                onClick={() => setFormData({ ...formData, pcMaker: maker })}
                className={`px-5 py-3 rounded-lg border transition-all ${
                  formData.pcMaker === maker
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.pcMaker === maker ? { background: '#1E4D8C' } : {}}
              >
                {maker}
              </button>
            ))}
          </div>

          {formData.pcMaker === 'その他' && (
            <div className="mt-3 animate-fadeIn">
              <label className="block text-sm text-gray-600 mb-1">→ メーカー名を入力してください</label>
              <input
                type="text"
                value={formData.pcMakerOther}
                onChange={e => setFormData({ ...formData, pcMakerOther: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例）Microsoft、ASUS など"
              />
            </div>
          )}
        </div>

        {/* Q2: 購入先・管理会社 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            購入先・管理会社は？
          </label>
          <div className="grid grid-cols-2 gap-2">
            {VENDORS.map(v => (
              <button
                key={v.value}
                onClick={() => setFormData({ ...formData, pcVendor: v.value, pcVendorOther: v.value !== 'other' ? '' : formData.pcVendorOther })}
                className={`px-5 py-3 rounded-lg border transition-all ${
                  formData.pcVendor === v.value
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.pcVendor === v.value ? { background: '#1E4D8C' } : {}}
              >
                {v.label}
              </button>
            ))}
          </div>

          {formData.pcVendor === 'other' && (
            <div className="mt-3 animate-fadeIn">
              <label className="block text-sm text-gray-600 mb-1">→ 会社名を入力してください</label>
              <input
                type="text"
                value={formData.pcVendorOther}
                onChange={e => setFormData({ ...formData, pcVendorOther: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例）○○株式会社"
              />
            </div>
          )}
        </div>

        {/* Q3: 契約形態 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            契約形態は？
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CONTRACTS.map(contract => (
              <button
                key={contract}
                onClick={() => setFormData({ ...formData, pcContract: contract })}
                className={`px-5 py-3 rounded-lg border transition-all ${
                  formData.pcContract === contract
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.pcContract === contract ? { background: '#1E4D8C' } : {}}
              >
                {contract}
              </button>
            ))}
          </div>

          {formData.pcContract === 'リース' && (
            <div className="mt-3 animate-fadeIn">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                リース満了時期（目安）
              </label>
              <div className="grid grid-cols-2 gap-2">
                {LEASE_ENDS.map(end => (
                  <button
                    key={end}
                    onClick={() => setFormData({ ...formData, pcLeaseEnd: end })}
                    className={`px-5 py-3 rounded-lg border transition-all ${
                      formData.pcLeaseEnd === end
                        ? 'border-transparent text-white font-semibold'
                        : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                    }`}
                    style={formData.pcLeaseEnd === end ? { background: '#1E4D8C' } : {}}
                  >
                    {end}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Q4: 台数規模 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            台数規模（概算）（任意）
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PC_COUNTS.map(count => (
              <button
                key={count}
                onClick={() => setFormData({ ...formData, pcCount: count })}
                className={`px-5 py-3 rounded-lg border transition-all ${
                  formData.pcCount === count
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.pcCount === count ? { background: '#1E4D8C' } : {}}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Q5: 端末の種類 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            端末の種類（複数選択可・任意）
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PC_TYPES.map(type => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`px-5 py-3 rounded-lg border transition-all ${
                  formData.pcTypes.includes(type)
                    ? 'border-transparent text-white font-semibold'
                    : 'border-gray-300 text-gray-700 bg-white hover:border-blue-300'
                }`}
                style={formData.pcTypes.includes(type) ? { background: '#1E4D8C' } : {}}
              >
                {type}
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
          className="flex-1 py-3 rounded-lg font-bold text-white transition-all"
          style={{ background: '#1E4D8C' }}
        >
          次へ →
        </button>
      </div>
    </div>
  )
}
