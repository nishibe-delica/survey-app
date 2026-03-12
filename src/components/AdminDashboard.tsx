interface Props {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: Props) {
  // ダミーデータ
  const totalResponses = 12
  const salesReps = [
    { name: '田中太郎', count: 5 },
    { name: '鈴木花子', count: 4 },
    { name: '佐藤一郎', count: 3 },
  ]
  const recentResponses = [
    { company: '株式会社山田商事', salesRep: '田中太郎', date: '2026-03-12 14:30', whitespaceCount: 3 },
    { company: '有限会社鈴木工業', salesRep: '鈴木花子', date: '2026-03-12 11:15', whitespaceCount: 5 },
    { company: '佐藤産業株式会社', salesRep: '田中太郎', date: '2026-03-11 16:45', whitespaceCount: 2 },
    { company: '株式会社高橋製作所', salesRep: '佐藤一郎', date: '2026-03-11 10:20', whitespaceCount: 4 },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="shadow-md" style={{ background: '#1E4D8C' }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl">管理者ダッシュボード</h1>
            <p className="text-blue-200 text-sm">ITアンケート 回答状況</p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            ← ログアウト
          </button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* サマリーカード */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📊 回答サマリー</h2>
            <div className="text-5xl font-bold text-blue-600">{totalResponses}件</div>
            <div className="text-gray-600 mt-2">累計回答数</div>
          </div>
        </div>

        {/* 担当営業別テーブル */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">👥 担当営業別 回答数</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-700 font-medium">担当営業</th>
                <th className="text-right py-3 px-4 text-gray-700 font-medium">回答数</th>
              </tr>
            </thead>
            <tbody>
              {salesReps.map((rep) => (
                <tr key={rep.name} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{rep.name}</td>
                  <td className="text-right py-3 px-4 font-medium text-blue-600">{rep.count}件</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 最近の回答リスト */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📝 最近の回答</h2>
          <div className="space-y-3">
            {recentResponses.map((response, idx) => (
              <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-gray-800">{response.company}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      担当：{response.salesRep} | {response.date}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                      ホワイトスペース {response.whitespaceCount}件
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Googleスプレッドシートボタン */}
        <div className="mt-8 text-center">
          <button
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            onClick={() => alert('Googleスプレッドシート連携機能は実装予定です')}
          >
            📊 Googleスプレッドシートで開く
          </button>
        </div>
      </main>
    </div>
  )
}
