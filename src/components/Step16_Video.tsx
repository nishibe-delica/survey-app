import { useState } from 'react'
import type { SurveyData } from '../types/survey'

interface Props {
  data: Partial<SurveyData>
  onNext: (data: Partial<SurveyData>) => void
  onBack: () => void
}

export default function Step16_Video({ data, onNext, onBack }: Props) {
  const [videoWatched, setVideoWatched] = useState(data.videoWatched || false)

  const handleNext = () => {
    onNext({ videoWatched })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-2">🎬</div>
        <h2 className="text-2xl font-bold" style={{ color: '#1E4D8C' }}>スイテック40周年記念</h2>
      </div>

      {/* mp4動画再生 */}
      <div className="rounded-lg overflow-hidden shadow-lg bg-black">
        <video
          controls
          className="w-full"
          style={{ maxHeight: '500px' }}
        >
          <source src="/anniversary40.mp4" type="video/mp4" />
          お使いのブラウザは動画再生に対応していません。
        </video>
      </div>

      {/* 視聴確認チェックボックス（必須） */}
      <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="videoWatched"
            checked={videoWatched}
            onChange={e => setVideoWatched(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
          <div className="flex-1">
            <label htmlFor="videoWatched" className="text-base font-medium text-gray-800 cursor-pointer block">
              視聴しました
            </label>
            <p className="text-xs text-gray-600 mt-1">
              ※チェックを入れると次へ進めます
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          ← 戻る
        </button>
        <button
          onClick={handleNext}
          disabled={!videoWatched}
          className={`flex-1 py-3 rounded-lg font-bold transition-all ${
            videoWatched
              ? 'text-white hover:opacity-90 cursor-pointer'
              : 'text-gray-400 bg-gray-300 cursor-not-allowed'
          }`}
          style={videoWatched ? { background: '#1E4D8C' } : {}}
        >
          {videoWatched ? '次へ（ギフト受取へ） →' : '次へ →'}
        </button>
      </div>
    </div>
  )
}
