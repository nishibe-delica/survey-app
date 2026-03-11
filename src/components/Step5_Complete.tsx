import { useState } from 'react'
import type { Mode, ITEnv } from '../types/survey'
import WhitespaceMap from './WhitespaceMap'

interface Props {
  mode: Mode
  company: string
  itEnv: ITEnv
  onRestart: () => void
}

const GIFT_CODE = 'ABCD-EFGH-IJKL'

export default function Step5_Complete({ mode, company, itEnv, onRestart }: Props) {
  const [showMap, setShowMap] = useState(false)

  return (
    <>
      <div className="space-y-6 text-center">
        <div className="py-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">回答ありがとうございました！</h2>
          <p className="text-gray-500">スイテック創業40周年記念アンケートにご協力いただきありがとうございます。</p>
        </div>

        {/* Amazonギフトコード */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
          <div className="text-amber-600 font-semibold text-sm mb-2">🎁 Amazonギフトカード</div>
          <div className="text-2xl font-bold tracking-widest text-gray-800 bg-white rounded-xl py-3 px-6 border border-amber-200 shadow-sm font-mono">
            {GIFT_CODE}
          </div>
          <p className="text-amber-600 text-xs mt-3">※ このコードはデモ用のサンプルです</p>
        </div>

        {/* 同行モードの場合：ホワイトスペースマップ */}
        {mode === 'companion' && (
          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
            <p className="text-blue-700 font-semibold text-sm mb-3">📍 営業担当者向け</p>
            <button
              onClick={() => setShowMap(true)}
              className="w-full py-3 rounded-xl font-bold text-white text-base transition-all hover:opacity-90"
              style={{ background: '#1E4D8C' }}
            >
              📊 ホワイトスペースマップを見る
            </button>
            <p className="text-blue-500 text-xs mt-2">回答データをもとに営業優先度を自動判定します</p>
          </div>
        )}

        <button
          onClick={onRestart}
          className="w-full py-3 rounded-xl font-bold text-gray-600 border border-gray-300 hover:bg-gray-50 transition-all"
        >
          最初からやり直す
        </button>
      </div>

      {showMap && (
        <WhitespaceMap
          itEnv={itEnv}
          company={company}
          onClose={() => setShowMap(false)}
        />
      )}
    </>
  )
}
