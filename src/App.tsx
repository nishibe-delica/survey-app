import { useState } from 'react'
import type { SurveyData, Screen } from './types/survey'
import ModeSelect from './components/ModeSelect'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import StepIndicator from './components/StepIndicator'
import Step01_BasicInfo from './components/Step01_BasicInfo'
import Step02_PC from './components/Step02_PC'
import Step03_Server from './components/Step03_Server'
import Step04_CoreSystem from './components/Step04_CoreSystem'
import Step05_Attendance from './components/Step05_Attendance'
import Step06_Security from './components/Step06_Security'
import Step07_Backup from './components/Step07_Backup'
import Step08_Network from './components/Step08_Network'
import Step09_MFP from './components/Step09_MFP'
import Step10_Phone from './components/Step10_Phone'
import Step11_Maintenance from './components/Step11_Maintenance'
import Step12_AI from './components/Step12_AI'
import Step13_ITStaff from './components/Step13_ITStaff'
import Step14_Issues from './components/Step14_Issues'
import Step15_Expectation from './components/Step15_Expectation'
import Step16_Video from './components/Step16_Video'
import Step17_Complete from './components/Step17_Complete'
import ResultSummary from './components/ResultSummary'
import WhitespaceMap from './components/WhitespaceMap'
import ProposalCards from './components/ProposalCards'

export default function App() {
  const [screen, setScreen] = useState<Screen>('modeSelect')
  const [currentStep, setCurrentStep] = useState(1)
  const [surveyData, setSurveyData] = useState<Partial<SurveyData>>({})

  const handleNext = (stepData: Partial<SurveyData>) => {
    const newData = { ...surveyData, ...stepData }
    setSurveyData(newData)
    if (currentStep < 17) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      setScreen('modeSelect')
    }
  }

  const handleRestart = () => {
    setScreen('modeSelect')
    setCurrentStep(1)
    setSurveyData({})
  }

  // モード選択画面
  if (screen === 'modeSelect') {
    return (
      <ModeSelect
        onStartSurvey={() => setScreen('survey')}
        onAdminLogin={() => setScreen('adminLogin')}
      />
    )
  }

  // 管理者ログイン画面
  if (screen === 'adminLogin') {
    return (
      <AdminLogin
        onSuccess={() => setScreen('adminDashboard')}
        onBack={() => setScreen('modeSelect')}
      />
    )
  }

  // 管理者ダッシュボード
  if (screen === 'adminDashboard') {
    return (
      <AdminDashboard
        onLogout={() => setScreen('modeSelect')}
      />
    )
  }

  // 結果サマリー
  if (screen === 'resultSummary') {
    return (
      <ResultSummary
        surveyData={surveyData}
        onNext={() => setScreen('whitespaceMap')}
        onBack={() => setScreen('survey')}
      />
    )
  }

  // ホワイトスペースマップ
  if (screen === 'whitespaceMap') {
    return (
      <WhitespaceMap
        surveyData={surveyData}
        onNext={() => setScreen('proposalCards')}
        onBack={() => setScreen('resultSummary')}
      />
    )
  }

  // ご提案内容
  if (screen === 'proposalCards') {
    return (
      <ProposalCards
        surveyData={surveyData}
        onRestart={handleRestart}
      />
    )
  }

  // アンケート画面
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="sticky top-0 z-40 shadow-md" style={{ background: '#1E4D8C' }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">🏢</span>
          <div>
            <div className="text-white font-bold text-base leading-tight">スイテック ITアンケート</div>
            <div className="text-blue-200 text-xs">創業40周年記念</div>
          </div>
          <div className="ml-auto">
            <span className="text-xs px-2 py-1 rounded-full font-medium bg-amber-400 text-amber-900">
              💼 同行
            </span>
          </div>
        </div>
      </header>

      {/* ステップインジケーター */}
      {currentStep <= 17 && <StepIndicator current={currentStep} total={17} />}

      {/* メインコンテンツ */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {currentStep === 1 && <Step01_BasicInfo data={surveyData} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 2 && <Step02_PC data={surveyData} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 3 && <Step03_Server data={surveyData} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 4 && <Step04_CoreSystem data={surveyData} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 5 && <Step05_Attendance data={surveyData} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 6 && <Step06_Security data={surveyData} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 7 && <Step07_Backup data={surveyData} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 8 && <Step08_Network data={surveyData} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 9 && <Step09_MFP data={surveyData} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 10 && <Step10_Phone data={surveyData} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 11 && <Step11_Maintenance data={surveyData} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 12 && <Step12_AI data={surveyData} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 13 && <Step13_ITStaff data={surveyData} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 14 && <Step14_Issues data={surveyData} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 15 && <Step15_Expectation data={surveyData} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 16 && <Step16_Video data={surveyData} onNext={handleNext} onBack={handleBack} />}
          {currentStep === 17 && (
            <Step17_Complete
              onViewSummary={() => setScreen('resultSummary')}
              onRestart={handleRestart}
            />
          )}
        </div>
      </main>
    </div>
  )
}
