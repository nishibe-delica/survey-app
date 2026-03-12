import { useState } from 'react'

interface Props {
  onSuccess: () => void
  onBack: () => void
}

export default function AdminLogin({ onSuccess, onBack }: Props) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === '1111') {
      onSuccess()
    } else {
      setError('パスワードが違います')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #1E4D8C 0%, #2563EB 100%)' }}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">管理者ログイン</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="パスワードを入力"
              autoFocus
            />
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-medium text-white transition-colors"
            style={{ background: '#1E4D8C' }}
          >
            ログイン
          </button>
        </form>

        <button
          onClick={onBack}
          className="mt-4 text-gray-600 text-sm hover:text-gray-800 flex items-center gap-1"
        >
          ← 戻る
        </button>
      </div>
    </div>
  )
}
