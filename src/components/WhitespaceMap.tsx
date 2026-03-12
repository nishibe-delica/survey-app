import { calcWhitespace } from '../utils/whitespace'
import type { SurveyData, WhitespaceStatus } from '../types/survey'

interface Props {
  surveyData: Partial<SurveyData>
  onNext: () => void
  onBack: () => void
}

function getStatusBadge(status: WhitespaceStatus, competitorName?: string): { icon: string; label: string; color: string; bgColor: string } {
  switch (status) {
    case 'suiteq':
      return { icon: '🟢', label: 'スイテックご利用中', color: '#059669', bgColor: '#D1FAE5' }
    case 'competitor':
      return { icon: '🟠', label: `${competitorName || '他社'}をご利用中`, color: '#F97316', bgColor: '#FFEDD5' }
    case 'considering':
      return { icon: '🟡', label: 'ご検討中', color: '#F59E0B', bgColor: '#FEF3C7' }
    case 'none':
      return { icon: '⚪', label: '未導入', color: '#6B7280', bgColor: '#F3F4F6' }
    default:
      return { icon: '➖', label: '', color: '#9CA3AF', bgColor: '#F9FAFB' }
  }
}

export default function WhitespaceMap({ surveyData, onNext, onBack }: Props) {
  const whitespaceItems = calcWhitespace(surveyData)
  const proposalCount = whitespaceItems.filter(item => item.proposalMessage && item.status !== 'suiteq').length

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="shadow-md" style={{ background: '#1E4D8C' }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-white font-bold text-2xl">🗺️ ホワイトスペースマップ</h1>
          <p className="text-blue-200 text-sm mt-1">スイテックとのお取引状況と新しいご提案ができる領域です</p>
        </div>
      </header>

      {/* 上部メッセージ */}
      <div className="bg-blue-50 border-b border-blue-100 py-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-lg font-bold text-blue-900">
            ✨ スイテックから{proposalCount}件の新しいご提案ができます
          </p>
        </div>
      </div>

      {/* カード一覧 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-3">
          {whitespaceItems.map((item) => {
            const badge = getStatusBadge(item.status, item.competitorName)
            const showBadge = item.status !== 'unknown'

            return (
              <div key={item.category} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between gap-4">
                  {/* 左側 */}
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-3xl shrink-0">{item.icon}</span>
                    <div className="font-bold text-gray-800 text-lg">{item.category}</div>
                  </div>

                  {/* 右側 */}
                  <div className="text-right shrink-0">
                    {showBadge && (
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <span className="text-lg">{badge.icon}</span>
                        <span
                          className="text-xs font-medium px-3 py-1 rounded-full"
                          style={{ color: badge.color, background: badge.bgColor }}
                        >
                          {badge.label}
                        </span>
                      </div>
                    )}
                    {item.proposalMessage && item.status !== 'suiteq' && (
                      <div className="text-sm font-medium text-blue-700">
                        {item.proposalMessage}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* ボタン */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-3 pb-8">
        <button
          onClick={onNext}
          className="w-full py-4 rounded-lg font-bold text-white text-lg shadow-lg hover:opacity-90 transition-opacity"
          style={{ background: '#1E4D8C' }}
        >
          次へ：スイテックからのご提案を見る →
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 rounded-lg border text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          style={{ borderColor: '#1E4D8C', color: '#1E4D8C' }}
        >
          ← IT環境サマリーに戻る
        </button>
      </div>
    </div>
  )
}
