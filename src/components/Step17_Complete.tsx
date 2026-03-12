import { useState } from 'react'

interface Props {
  onViewSummary: () => void
  onRestart: () => void
}

export default function Step17_Complete({ onViewSummary, onRestart }: Props) {
  const [copied, setCopied] = useState(false)
  const giftCode = 'AMZN-1234-5678-ABCD'

  const handleCopy = () => {
    navigator.clipboard.writeText(giftCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E4D8C 0%, #2563EB 100%)' }}>
      {/* 紙吹雪アニメーション */}
      <div className="confetti-container">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              background: ['#F0A500', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][Math.floor(Math.random() * 5)]
            }}
          />
        ))}
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 max-w-2xl w-full">
        {/* 大きな絵文字 */}
        <div className="text-center mb-6">
          <div className="text-8xl mb-4 animate-bounce">🎉</div>
          <h1 className="text-4xl font-bold text-white mb-3">ご回答ありがとうございました！</h1>
          <p className="text-blue-100 text-lg">
            創業40周年記念 ITアンケートにご協力いただき、誠にありがとうございます。
          </p>
        </div>

        {/* ギフトカード */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="text-center">
            <div className="text-5xl mb-4">🎁</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Amazonギフト券プレゼント</h2>

            {/* ギフトコード */}
            <div className="bg-gray-100 rounded-lg p-6 mb-4">
              <div className="text-3xl font-mono font-bold mb-3" style={{ color: '#1E4D8C' }}>
                {giftCode}
              </div>
              <button
                onClick={handleCopy}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {copied ? '✓ コピーしました！' : '📋 コードをコピー'}
              </button>
            </div>

            <p className="text-sm text-gray-600">
              上記コードをAmazonのギフト券コード入力画面でご利用ください
            </p>
          </div>
        </div>

        {/* ボタン */}
        <div className="space-y-4">
          <button
            onClick={onViewSummary}
            className="w-full py-5 bg-white rounded-xl font-bold text-xl shadow-lg hover:bg-blue-50 transition-colors"
            style={{ color: '#1E4D8C' }}
          >
            📊 IT環境サマリーを見る　→
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 bg-transparent text-white rounded-xl hover:bg-white hover:bg-opacity-10 transition-colors text-base"
          >
            🏠 最初に戻る
          </button>
        </div>
      </div>

      <style>{`
        .confetti-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: confetti-fall linear infinite;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0.3;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
