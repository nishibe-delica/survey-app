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
        <h2 className="text-2xl font-bold" style={{ color: '#1E4D8C' }}>スイテック40周年紹介</h2>
        <p className="text-gray-500 text-sm mt-1">スイテックの40年の歩みをご覧ください</p>
      </div>

      {/* YouTube動画埋め込み */}
      <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="スイテック40周年紹介"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>

      {/* 視聴確認チェックボックス */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="videoWatched"
          checked={videoWatched}
          onChange={e => setVideoWatched(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="videoWatched" className="text-sm text-gray-700 cursor-pointer">
          動画を視聴しました
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg border text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          style={{ borderColor: '#1E4D8C', color: '#1E4D8C' }}
        >
          ← 戻る
        </button>
        <button
          onClick={handleNext}
          className="flex-1 py-3 rounded-lg font-bold text-white transition-all"
          style={{ background: '#1E4D8C' }}
        >
          次へ（アンケート完了） →
        </button>
      </div>
    </div>
  )
}
