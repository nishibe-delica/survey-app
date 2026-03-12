interface Props {
  current: number
  total: number
}

const STEP_LABELS = [
  '基本情報',
  'PC・端末',
  'サーバー・クラウド',
  '基幹システム',
  '勤怠管理',
  'セキュリティ',
  'バックアップ',
  '回線・ネットワーク',
  '複合機',
  '電話',
  '保守・サポート',
  'AI活用',
  'IT担当・体制',
  '課題・意向',
  'スイテックへの期待',
  '動画視聴',
  '完了',
  'サマリー',
  'マップ'
]

export default function StepIndicator({ current, total }: Props) {
  const progress = (current / total) * 100
  const currentLabel = STEP_LABELS[current - 1] || ''

  return (
    <div className="w-full bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-2xl mx-auto">
        {/* ステップ番号とタイトル */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium" style={{ color: '#1E4D8C' }}>
            ステップ {current} / {total}
          </div>
          <div className="text-sm font-bold text-gray-800 hidden sm:block">
            {currentLabel}
          </div>
        </div>

        {/* プログレスバー */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full transition-all duration-300 rounded-full"
            style={{
              width: `${progress}%`,
              background: '#1E4D8C'
            }}
          />
        </div>
      </div>
    </div>
  )
}
