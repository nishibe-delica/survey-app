import { calcWhitespace } from '../utils/whitespace'
import { generateProposals } from '../utils/proposals'
import type { SurveyData } from '../types/survey'

interface Props {
  surveyData: Partial<SurveyData>
  onRestart: () => void
}

export default function ProposalCards({ surveyData, onRestart }: Props) {
  const whitespaceItems = calcWhitespace(surveyData)
  const proposals = generateProposals(whitespaceItems)

  const colorMap = {
    red: { bg: '#FEF2F2', border: '#DC2626', text: '#DC2626' },
    orange: { bg: '#FFF7ED', border: '#F97316', text: '#F97316' },
    blue: { bg: '#EFF6FF', border: '#3B82F6', text: '#3B82F6' }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="shadow-md" style={{ background: '#1E4D8C' }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-white font-bold text-2xl">💡 スイテックからのご提案</h1>
          <p className="text-blue-200 text-sm mt-1">{surveyData.companyName || '○○株式会社'} 様へのご提案内容</p>
        </div>
      </header>

      {/* メイン */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {proposals.length > 0 ? (
          <div className="space-y-4">
            {proposals.map((proposal, idx) => {
              const colors = colorMap[proposal.urgencyColor as keyof typeof colorMap]
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-sm p-5 border-l-4"
                  style={{ borderColor: colors.border, background: colors.bg }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{proposal.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2" style={{ color: colors.text }}>
                        {proposal.title}
                      </h3>
                      <p className="text-gray-700 mb-3">{proposal.description}</p>
                      <div className="inline-block px-3 py-1 rounded-full text-sm font-medium" style={{ background: colors.border, color: 'white' }}>
                        {proposal.urgency === 'high' && '⚠️'} {proposal.urgency === 'medium' && '📋'} {proposal.urgency === 'low' && '💡'} {proposal.urgencyLabel}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">現在のITご支援状況は良好です</h3>
            <p className="text-gray-600">引き続きスイテックにお任せください。</p>
          </div>
        )}
      </main>

      {/* フッター */}
      <div className="mt-8 py-8 text-center" style={{ background: '#1E4D8C' }}>
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-white text-lg mb-4">📞 詳しくはスイテックまでお問い合わせください</p>
          <p className="text-blue-200 text-sm mb-6">担当：{surveyData.salesRepName || '－'}　スイテック</p>
          <button
            onClick={onRestart}
            className="px-8 py-3 bg-white rounded-lg font-medium hover:bg-gray-100 transition-colors"
            style={{ color: '#1E4D8C' }}
          >
            🏠 最初に戻る
          </button>
        </div>
      </div>
    </div>
  )
}
