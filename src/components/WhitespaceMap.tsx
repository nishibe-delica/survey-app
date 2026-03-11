import type { ITEnv } from '../types/survey'

interface Props {
  itEnv: ITEnv
  company: string
  onClose: () => void
}

interface CategoryResult {
  label: string
  icon: string
  status: '🟢' | '🔴' | '🟡' | '⚪' | '➖'
  statusLabel: string
  message: string
  score: number
  vendor: string
}

function judgeCategory(vendor: string, status: string): { status: '🟢' | '🔴' | '🟡' | '⚪' | '➖'; score: number; message: string } {
  if (vendor === 'スイテック') return { status: '🟢', score: 0, message: '' }
  if (vendor === '他社') return { status: '🔴', score: 2, message: 'リプレイスのご提案が可能です' }
  if (status === '検討中') return { status: '🟡', score: 2, message: 'タイムリーなご提案ができます' }
  if (status === '未導入' || status === '未対応' || status === '未検討') return { status: '⚪', score: 3, message: '導入のご支援ができます' }
  return { status: '➖', score: 0, message: '' }
}

export default function WhitespaceMap({ itEnv, company, onClose }: Props) {
  const categories: CategoryResult[] = [
    (() => {
      const j = judgeCategory(itEnv.pcPurchase, '')
      return { label: 'PC・端末', icon: '💻', ...j, statusLabel: getStatusLabel(j.status), vendor: itEnv.pcPurchase === '他社' ? itEnv.pcPurchaseOther : itEnv.pcPurchase }
    })(),
    (() => {
      const j = judgeCategory(itEnv.serverVendor, itEnv.serverEnv.includes('未導入') ? '未導入' : '')
      return { label: 'サーバー・クラウド', icon: '🖥️', ...j, statusLabel: getStatusLabel(j.status), vendor: itEnv.serverVendor === '他社' ? itEnv.serverVendorOther : itEnv.serverVendor }
    })(),
    (() => {
      const j = judgeCategory(itEnv.salesSysVendor, itEnv.salesSysStatus)
      return { label: '販売管理', icon: '📊', ...j, statusLabel: getStatusLabel(j.status), vendor: itEnv.salesSysVendor === '他社' ? itEnv.salesSysVendorOther : (itEnv.salesSysVendor || itEnv.salesSysStatus) }
    })(),
    (() => {
      const j = judgeCategory(itEnv.attendanceVendor, itEnv.attendanceStatus)
      return { label: '勤怠システム', icon: '🕐', ...j, statusLabel: getStatusLabel(j.status), vendor: itEnv.attendanceVendor === '他社' ? itEnv.attendanceVendorOther : (itEnv.attendanceVendor || itEnv.attendanceStatus) }
    })(),
    (() => {
      const hasUnresponded = itEnv.securityStatus.includes('未対応')
      const j = judgeCategory(itEnv.securityVendor, hasUnresponded ? '未対応' : '')
      return { label: 'セキュリティ', icon: '🔒', ...j, statusLabel: getStatusLabel(j.status), vendor: itEnv.securityVendor === '他社' ? itEnv.securityVendorOther : itEnv.securityVendor }
    })(),
    (() => {
      const j = judgeCategory(itEnv.networkVendor, '')
      return { label: '回線・ネットワーク', icon: '🌐', ...j, statusLabel: getStatusLabel(j.status), vendor: itEnv.networkVendor === '他社' ? itEnv.networkVendorOther : itEnv.networkVendor }
    })(),
    (() => {
      const j = judgeCategory(itEnv.mfpVendor, '')
      return { label: '複合機・MFP', icon: '🖨️', ...j, statusLabel: getStatusLabel(j.status), vendor: itEnv.mfpVendor === '他社' ? itEnv.mfpVendorOther : itEnv.mfpVendor }
    })(),
    (() => {
      const j = judgeCategory(itEnv.phoneVendor, '')
      return { label: '電話・IP-PBX', icon: '📞', ...j, statusLabel: getStatusLabel(j.status), vendor: itEnv.phoneVendor === '他社' ? itEnv.phoneVendorOther : itEnv.phoneVendor }
    })(),
    (() => {
      const j = judgeCategory('', itEnv.aiStatus)
      return { label: 'AI活用', icon: '🤖', ...j, statusLabel: getStatusLabel(j.status), vendor: itEnv.aiStatus }
    })(),
  ]

  const totalScore = categories.reduce((sum, c) => sum + c.score, 0)
  const rank = totalScore >= 15 ? { label: '🔥 Aランク', color: '#EF4444', bg: '#FEF2F2', desc: '複数の商談機会があります。優先的にアプローチしましょう。' }
    : totalScore >= 8 ? { label: '📋 Bランク', color: '#F59E0B', bg: '#FFFBEB', desc: '中期的な商談機会があります。継続的なフォローを行いましょう。' }
    : { label: '💼 Cランク', color: '#10B981', bg: '#F0FDF4', desc: 'スイテックとの関係が良好です。深耕提案を検討しましょう。' }

  const redItems = categories.filter(c => c.status === '🔴')
  const whiteItems = categories.filter(c => c.status === '⚪')
  const yellowItems = categories.filter(c => c.status === '🟡')

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center overflow-y-auto py-4 px-2">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-4">
        {/* ヘッダー */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between" style={{ background: '#1E4D8C', borderRadius: '1rem 1rem 0 0' }}>
          <div>
            <div className="text-white font-bold text-lg">📍 ホワイトスペースマップ</div>
            <div className="text-blue-200 text-sm">{company}</div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none">✕</button>
        </div>

        <div className="p-5 space-y-4">

          {/* 営業優先度 */}
          <div className="rounded-xl p-4 text-center" style={{ background: rank.bg, border: `2px solid ${rank.color}` }}>
            <div className="text-2xl font-bold" style={{ color: rank.color }}>{rank.label}</div>
            <div className="text-sm text-gray-600 mt-1">{rank.desc}</div>
            <div className="text-xs text-gray-400 mt-1">合計スコア：{totalScore}点</div>
          </div>

          {/* カテゴリ一覧 */}
          <div className="space-y-2">
            {categories.map((c) => (
              <div key={c.label} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-xl">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 text-sm">{c.label}</div>
                  {c.vendor && <div className="text-xs text-gray-500 truncate">{c.vendor}</div>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xl">{c.status}</span>
                  <span className="text-xs text-gray-500 hidden sm:block">{c.statusLabel}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 凡例 */}
          <div className="flex flex-wrap gap-3 text-xs text-gray-500 pt-1">
            <span>🟢 スイテック</span>
            <span>🔴 競合</span>
            <span>🟡 検討中</span>
            <span>⚪ 未導入</span>
            <span>➖ 情報なし</span>
          </div>

          {/* 提案メッセージ */}
          {(redItems.length > 0 || whiteItems.length > 0 || yellowItems.length > 0) && (
            <div className="bg-blue-50 rounded-xl p-4 space-y-2">
              <p className="font-bold text-blue-800 text-sm">💡 提案ポイント</p>
              {redItems.length > 0 && (
                <p className="text-sm text-gray-700">🔴 <strong>{redItems.map(c => c.label).join('・')}</strong>：リプレイスのご提案が可能です</p>
              )}
              {whiteItems.length > 0 && (
                <p className="text-sm text-gray-700">⚪ <strong>{whiteItems.map(c => c.label).join('・')}</strong>：導入のご支援ができます</p>
              )}
              {yellowItems.length > 0 && (
                <p className="text-sm text-gray-700">🟡 <strong>{yellowItems.map(c => c.label).join('・')}</strong>：タイムリーなご提案ができます</p>
              )}
            </div>
          )}

          <button onClick={onClose} className="w-full py-3 rounded-xl font-bold text-white" style={{ background: '#1E4D8C' }}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}

function getStatusLabel(status: string): string {
  switch (status) {
    case '🟢': return 'スイテック取引中'
    case '🔴': return '競合導入'
    case '🟡': return '検討中'
    case '⚪': return '未導入'
    default: return '情報なし'
  }
}
