import type { SurveyData } from '../types/survey'

interface Props {
  surveyData: Partial<SurveyData>
  onNext: () => void
  onBack: () => void
}

export default function ResultSummary({ surveyData, onNext, onBack }: Props) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="shadow-md" style={{ background: '#1E4D8C' }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-white font-bold text-2xl">📊 IT環境サマリー</h1>
          <p className="text-blue-200 text-sm mt-1">
            {surveyData.companyName || '○○株式会社'} 様　担当：{surveyData.salesRepName || '－'}
          </p>
        </div>
      </header>

      {/* メイン */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* 基本情報 */}
        {surveyData.companyName && (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📋</span>
              <h2 className="font-bold text-lg">基本情報</h2>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">会社名：</span>{surveyData.companyName}</p>
              {surveyData.industry && <p><span className="text-gray-600">業種：</span>{surveyData.industry}</p>}
              {surveyData.employeeSize && <p><span className="text-gray-600">従業員規模：</span>{surveyData.employeeSize}</p>}
            </div>
          </div>
        )}

        {/* PC・端末 */}
        {surveyData.pcVendor && (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">💻</span>
              <h2 className="font-bold text-lg">PC・端末</h2>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">購入先：</span>{surveyData.pcVendor === 'suiteq' ? 'スイテック' : surveyData.pcVendor === 'other' ? `他社（${surveyData.pcVendorOther}）` : surveyData.pcVendor}</p>
              {surveyData.pcContract && <p><span className="text-gray-600">契約形態：</span>{surveyData.pcContract}{surveyData.pcLeaseEnd ? `（満了：${surveyData.pcLeaseEnd}）` : ''}</p>}
              {surveyData.pcCount && <p><span className="text-gray-600">台数：</span>{surveyData.pcCount}</p>}
            </div>
          </div>
        )}

        {/* サーバー・クラウド */}
        {surveyData.serverEnv && surveyData.serverEnv.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🖥️</span>
              <h2 className="font-bold text-lg">サーバー・クラウド</h2>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">環境：</span>{surveyData.serverEnv.join('・')}</p>
              {surveyData.serverUsage && surveyData.serverUsage.length > 0 && <p><span className="text-gray-600">用途：</span>{surveyData.serverUsage.join('・')}</p>}
              {surveyData.serverVendor && <p><span className="text-gray-600">管理会社：</span>{surveyData.serverVendor === 'suiteq' ? 'スイテック' : surveyData.serverVendor === 'other' ? `他社（${surveyData.serverVendorOther}）` : surveyData.serverVendor}</p>}
            </div>
          </div>
        )}

        {/* 基幹システム */}
        {surveyData.coreSystemStatus && (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📊</span>
              <h2 className="font-bold text-lg">基幹システム</h2>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">導入状況：</span>{surveyData.coreSystemStatus}</p>
              {surveyData.coreSystemTypes && surveyData.coreSystemTypes.length > 0 && <p><span className="text-gray-600">種類：</span>{surveyData.coreSystemTypes.join('・')}</p>}
              {surveyData.coreSystemAge && <p><span className="text-gray-600">導入からの年数：</span>{surveyData.coreSystemAge}</p>}
            </div>
          </div>
        )}

        {/* 他のカテゴリも同様に追加（簡略版）*/}
        {surveyData.backupStatus && (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">💾</span>
              <h2 className="font-bold text-lg">バックアップ</h2>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">実施状況：</span>{surveyData.backupStatus}</p>
              {surveyData.backupMethod && surveyData.backupMethod.length > 0 && <p><span className="text-gray-600">方法：</span>{surveyData.backupMethod.join('・')}</p>}
            </div>
          </div>
        )}
      </main>

      {/* ボタン */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-3">
        <button
          onClick={onNext}
          className="w-full py-4 rounded-lg font-bold text-white text-lg shadow-lg hover:opacity-90 transition-opacity"
          style={{ background: '#1E4D8C' }}
        >
          次へ：ホワイトスペースマップを見る →
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 rounded-lg border text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          style={{ borderColor: '#1E4D8C', color: '#1E4D8C' }}
        >
          ← アンケートに戻る
        </button>
      </div>
    </div>
  )
}
