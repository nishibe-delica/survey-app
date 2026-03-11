import type { ITEnv } from '../types/survey'

interface Props {
  data: ITEnv
  onChange: (data: ITEnv) => void
  onNext: () => void
  onBack: () => void
}

const inputClass = 'border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full'
const sectionClass = 'bg-gray-50 rounded-xl p-5 space-y-4'
const sectionTitleClass = 'font-bold text-gray-800 text-base flex items-center gap-2'
const subLabelClass = 'text-sm font-semibold text-gray-600 mb-2'

function RadioGroup({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <label key={o} className={`px-3 py-1.5 rounded-lg border cursor-pointer text-sm transition-all ${value === o ? 'border-blue-700 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-300 text-gray-600 hover:border-blue-300'}`}>
          <input type="radio" className="hidden" checked={value === o} onChange={() => onChange(o)} />
          {o}
        </label>
      ))}
    </div>
  )
}

function CheckGroup({ values, options, onChange }: { values: string[]; options: string[]; onChange: (v: string[]) => void }) {
  const toggle = (o: string) => {
    onChange(values.includes(o) ? values.filter(v => v !== o) : [...values, o])
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <label key={o} className={`px-3 py-1.5 rounded-lg border cursor-pointer text-sm transition-all ${values.includes(o) ? 'border-blue-700 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-300 text-gray-600 hover:border-blue-300'}`}>
          <input type="checkbox" className="hidden" checked={values.includes(o)} onChange={() => toggle(o)} />
          {o}
        </label>
      ))}
    </div>
  )
}

function VendorRadio({ value, otherValue, onVendorChange, onOtherChange }: {
  value: string; otherValue: string
  onVendorChange: (v: string) => void; onOtherChange: (v: string) => void
}) {
  const options = ['スイテック', '他社', '自社管理', 'わからない']
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <label key={o} className={`px-3 py-1.5 rounded-lg border cursor-pointer text-sm transition-all ${value === o ? 'border-blue-700 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-300 text-gray-600 hover:border-blue-300'}`}>
            <input type="radio" className="hidden" checked={value === o} onChange={() => onVendorChange(o)} />
            {o}
          </label>
        ))}
      </div>
      {value === '他社' && (
        <input className={inputClass} placeholder="会社名を入力" value={otherValue} onChange={e => onOtherChange(e.target.value)} />
      )}
    </div>
  )
}

export default function Step2_ITEnv({ data, onChange, onNext, onBack }: Props) {
  const set = <K extends keyof ITEnv>(key: K, val: ITEnv[K]) => onChange({ ...data, [key]: val })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Step 2：IT環境ヒアリング</h2>
        <p className="text-gray-500 text-sm mt-1">現在のIT環境についてお聞かせください（複数選択可の項目あり）</p>
      </div>

      <div className="space-y-4">

        {/* 1. PC・端末 */}
        <div className={sectionClass}>
          <div className={sectionTitleClass}><span>💻</span> 1. PC・端末</div>
          <div>
            <p className={subLabelClass}>購入先</p>
            <div className="space-y-2">
              <RadioGroup value={data.pcPurchase} options={['スイテック', '他社', 'メーカー直販', '量販店']} onChange={v => set('pcPurchase', v)} />
              {data.pcPurchase === '他社' && (
                <input className={inputClass} placeholder="会社名を入力" value={data.pcPurchaseOther} onChange={e => set('pcPurchaseOther', e.target.value)} />
              )}
            </div>
          </div>
          <div>
            <p className={subLabelClass}>台数</p>
            <RadioGroup value={data.pcCount} options={['〜10台', '11〜30台', '31〜100台', '100台以上']} onChange={v => set('pcCount', v)} />
          </div>
        </div>

        {/* 2. サーバー・クラウド */}
        <div className={sectionClass}>
          <div className={sectionTitleClass}><span>🖥️</span> 2. サーバー・クラウド</div>
          <div>
            <p className={subLabelClass}>環境（複数選択可）</p>
            <CheckGroup values={data.serverEnv} options={['オンプレ', 'NAS', 'クラウド', '未導入']} onChange={v => set('serverEnv', v)} />
          </div>
          <div>
            <p className={subLabelClass}>管理会社</p>
            <VendorRadio value={data.serverVendor} otherValue={data.serverVendorOther} onVendorChange={v => set('serverVendor', v)} onOtherChange={v => set('serverVendorOther', v)} />
          </div>
        </div>

        {/* 3. 販売管理システム */}
        <div className={sectionClass}>
          <div className={sectionTitleClass}><span>📊</span> 3. 販売管理システム</div>
          <div>
            <p className={subLabelClass}>状況</p>
            <RadioGroup value={data.salesSysStatus} options={['導入済み', '検討中', '未導入']} onChange={v => set('salesSysStatus', v)} />
          </div>
          {data.salesSysStatus === '導入済み' && (
            <div>
              <p className={subLabelClass}>導入会社</p>
              <div className="space-y-2">
                <RadioGroup value={data.salesSysVendor} options={['スイテック', '他社', '自社']} onChange={v => set('salesSysVendor', v)} />
                {data.salesSysVendor === '他社' && (
                  <input className={inputClass} placeholder="会社名を入力" value={data.salesSysVendorOther} onChange={e => set('salesSysVendorOther', e.target.value)} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* 4. 勤怠システム */}
        <div className={sectionClass}>
          <div className={sectionTitleClass}><span>🕐</span> 4. 勤怠システム</div>
          <div>
            <p className={subLabelClass}>状況</p>
            <RadioGroup value={data.attendanceStatus} options={['導入済み', '検討中', '未導入']} onChange={v => set('attendanceStatus', v)} />
          </div>
          {data.attendanceStatus === '導入済み' && (
            <div>
              <p className={subLabelClass}>導入会社</p>
              <div className="space-y-2">
                <RadioGroup value={data.attendanceVendor} options={['スイテック', '他社', '自社']} onChange={v => set('attendanceVendor', v)} />
                {data.attendanceVendor === '他社' && (
                  <input className={inputClass} placeholder="会社名を入力" value={data.attendanceVendorOther} onChange={e => set('attendanceVendorOther', e.target.value)} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* 5. セキュリティ */}
        <div className={sectionClass}>
          <div className={sectionTitleClass}><span>🔒</span> 5. セキュリティ</div>
          <div>
            <p className={subLabelClass}>状況（複数選択可）</p>
            <CheckGroup values={data.securityStatus} options={['ウイルス対策ソフト', 'UTM', 'EDR', '未対応', 'わからない']} onChange={v => set('securityStatus', v)} />
          </div>
          <div>
            <p className={subLabelClass}>管理会社</p>
            <div className="space-y-2">
              <RadioGroup value={data.securityVendor} options={['スイテック', '他社', '自社', '未導入']} onChange={v => set('securityVendor', v)} />
              {data.securityVendor === '他社' && (
                <input className={inputClass} placeholder="会社名を入力" value={data.securityVendorOther} onChange={e => set('securityVendorOther', e.target.value)} />
              )}
            </div>
          </div>
        </div>

        {/* 6. 回線・ネットワーク */}
        <div className={sectionClass}>
          <div className={sectionTitleClass}><span>🌐</span> 6. 回線・ネットワーク</div>
          <div>
            <p className={subLabelClass}>種類（複数選択可）</p>
            <CheckGroup values={data.networkType} options={['光回線', '無線LAN', 'MVNO', 'モバイルルーター', 'その他']} onChange={v => set('networkType', v)} />
          </div>
          <div>
            <p className={subLabelClass}>管理会社</p>
            <VendorRadio value={data.networkVendor} otherValue={data.networkVendorOther} onVendorChange={v => set('networkVendor', v)} onOtherChange={v => set('networkVendorOther', v)} />
          </div>
        </div>

        {/* 7. 複合機・MFP */}
        <div className={sectionClass}>
          <div className={sectionTitleClass}><span>🖨️</span> 7. 複合機・MFP</div>
          <div>
            <p className={subLabelClass}>メーカー（複数選択可）</p>
            <CheckGroup values={data.mfpMaker} options={['富士フイルム', 'リコー', 'コニカミノルタ', 'キヤノン', 'その他']} onChange={v => set('mfpMaker', v)} />
          </div>
          <div>
            <p className={subLabelClass}>管理会社</p>
            <div className="space-y-2">
              <RadioGroup value={data.mfpVendor} options={['スイテック', '他社', '不明']} onChange={v => set('mfpVendor', v)} />
              {data.mfpVendor === '他社' && (
                <input className={inputClass} placeholder="会社名を入力" value={data.mfpVendorOther} onChange={e => set('mfpVendorOther', e.target.value)} />
              )}
            </div>
          </div>
          <div>
            <p className={subLabelClass}>リプレイス時期</p>
            <RadioGroup value={data.mfpReplace} options={['1年以内', '1〜3年', '3年以上先', '未定']} onChange={v => set('mfpReplace', v)} />
          </div>
        </div>

        {/* 8. 電話・IP-PBX */}
        <div className={sectionClass}>
          <div className={sectionTitleClass}><span>📞</span> 8. 電話・IP-PBX</div>
          <div>
            <p className={subLabelClass}>環境</p>
            <RadioGroup value={data.phoneEnv} options={['従来PBX', 'クラウド電話', 'IP-PBX', '携帯のみ', 'その他']} onChange={v => set('phoneEnv', v)} />
          </div>
          <div>
            <p className={subLabelClass}>管理会社</p>
            <div className="space-y-2">
              <RadioGroup value={data.phoneVendor} options={['スイテック', '他社', '不明']} onChange={v => set('phoneVendor', v)} />
              {data.phoneVendor === '他社' && (
                <input className={inputClass} placeholder="会社名を入力" value={data.phoneVendorOther} onChange={e => set('phoneVendorOther', e.target.value)} />
              )}
            </div>
          </div>
        </div>

        {/* 9. AI活用 */}
        <div className={sectionClass}>
          <div className={sectionTitleClass}><span>🤖</span> 9. AI活用</div>
          <div>
            <p className={subLabelClass}>状況</p>
            <RadioGroup value={data.aiStatus} options={['積極活用中', '一部活用', '検討中', '未検討']} onChange={v => set('aiStatus', v)} />
          </div>
          <div>
            <p className={subLabelClass}>利用サービス（複数選択可）</p>
            <div className="space-y-2">
              <CheckGroup values={data.aiServices} options={['ChatGPT', 'Copilot', 'Claude', 'Gemini', 'その他', '未使用']} onChange={v => set('aiServices', v)} />
              {data.aiServices.includes('その他') && (
                <input className={inputClass} placeholder="サービス名を入力" value={data.aiServicesOther} onChange={e => set('aiServicesOther', e.target.value)} />
              )}
            </div>
          </div>
        </div>

      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl font-bold text-gray-600 border border-gray-300 hover:bg-gray-50 transition-all">
          ← 戻る
        </button>
        <button onClick={onNext} className="flex-2 py-3 px-8 rounded-xl font-bold text-white transition-all" style={{ background: '#1E4D8C', flex: 2 }}>
          次へ →
        </button>
      </div>
    </div>
  )
}
