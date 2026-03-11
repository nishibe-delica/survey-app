import { useState } from 'react'
import type { Mode, BasicInfo, ITEnv, Issues, Expectation } from './types/survey'
import ModeSelect from './components/ModeSelect'
import StepIndicator from './components/StepIndicator'
import Step1_BasicInfo from './components/Step1_BasicInfo'
import Step2_ITEnv from './components/Step2_ITEnv'
import Step3_Issues from './components/Step3_Issues'
import Step4_Expectation from './components/Step4_Expectation'
import Step5_Complete from './components/Step5_Complete'

const INITIAL_BASIC_INFO: BasicInfo = {
  company: '', industry: '', scale: '', name: '', email: '', salesName: '', years: ''
}

const INITIAL_IT_ENV: ITEnv = {
  pcPurchase: '', pcPurchaseOther: '', pcCount: '',
  serverEnv: [], serverVendor: '', serverVendorOther: '',
  salesSysStatus: '', salesSysVendor: '', salesSysVendorOther: '',
  attendanceStatus: '', attendanceVendor: '', attendanceVendorOther: '',
  securityStatus: [], securityVendor: '', securityVendorOther: '',
  networkType: [], networkVendor: '', networkVendorOther: '',
  mfpMaker: [], mfpVendor: '', mfpVendorOther: '', mfpReplace: '',
  phoneEnv: '', phoneVendor: '', phoneVendorOther: '',
  aiStatus: '', aiServices: [], aiServicesOther: '',
}

const INITIAL_ISSUES: Issues = {
  mainIssue: '', planItems: [], aiGoal: '', itBudget: ''
}

const INITIAL_EXPECTATION: Expectation = {
  nps: 8, expectations: []
}

export default function App() {
  const [mode, setMode] = useState<Mode | null>(null)
  const [step, setStep] = useState(1)
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(INITIAL_BASIC_INFO)
  const [itEnv, setItEnv] = useState<ITEnv>(INITIAL_IT_ENV)
  const [issues, setIssues] = useState<Issues>(INITIAL_ISSUES)
  const [expectation, setExpectation] = useState<Expectation>(INITIAL_EXPECTATION)

  const handleRestart = () => {
    setMode(null)
    setStep(1)
    setBasicInfo(INITIAL_BASIC_INFO)
    setItEnv(INITIAL_IT_ENV)
    setIssues(INITIAL_ISSUES)
    setExpectation(INITIAL_EXPECTATION)
  }

  if (!mode) return <ModeSelect onSelect={setMode} />

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
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${mode === 'companion' ? 'bg-amber-400 text-amber-900' : 'bg-blue-400 text-white'}`}>
              {mode === 'companion' ? '💼 同行' : '📱 セルフ'}
            </span>
          </div>
        </div>
      </header>

      {/* ステップインジケーター */}
      {step <= 4 && <StepIndicator current={step} total={5} />}

      {/* メインコンテンツ */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {step === 1 && (
            <Step1_BasicInfo
              data={basicInfo}
              onChange={setBasicInfo}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <Step2_ITEnv
              data={itEnv}
              onChange={setItEnv}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <Step3_Issues
              data={issues}
              onChange={setIssues}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <Step4_Expectation
              data={expectation}
              onChange={setExpectation}
              onNext={() => setStep(5)}
              onBack={() => setStep(3)}
            />
          )}
          {step === 5 && (
            <Step5_Complete
              mode={mode}
              company={basicInfo.company}
              itEnv={itEnv}
              onRestart={handleRestart}
            />
          )}
        </div>
      </main>
    </div>
  )
}
