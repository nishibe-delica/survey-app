interface Props {
  onStartSurvey: () => void
  onAdminLogin: () => void
}

export default function ModeSelect({ onStartSurvey, onAdminLogin }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative" style={{ background: 'linear-gradient(135deg, #1E4D8C 0%, #2563EB 100%)' }}>
      <div className="text-center mb-12">
        <div className="text-5xl mb-4">🏢</div>
        <h1 className="text-3xl font-bold text-white mb-2">スイテック</h1>
        <p className="text-blue-200 text-lg font-medium">創業40周年記念 ITアンケート</p>
      </div>

      <div className="w-full max-w-md">
        <button
          onClick={onStartSurvey}
          className="w-full bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group"
          style={{ background: '#1E4D8C' }}
        >
          <span className="text-5xl group-hover:scale-110 transition-transform">🤝</span>
          <div className="text-center">
            <div className="font-bold text-white text-2xl">アンケート開始</div>
          </div>
        </button>
      </div>

      <p className="text-blue-200 text-sm mt-10">所要時間：約5〜10分</p>

      {/* 管理者ログインリンク */}
      <button
        onClick={onAdminLogin}
        className="absolute bottom-8 right-8 text-blue-200 text-sm hover:text-white transition-colors underline"
      >
        管理者ログイン
      </button>
    </div>
  )
}
