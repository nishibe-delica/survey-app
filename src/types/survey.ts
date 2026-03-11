export type Mode = 'companion' | 'self'

export interface BasicInfo {
  company: string
  industry: string
  scale: string
  name: string
  email: string
  salesName: string
  years: string
}

export interface ITEnv {
  // PC・端末
  pcPurchase: string
  pcPurchaseOther: string
  pcCount: string
  // サーバー・クラウド
  serverEnv: string[]
  serverVendor: string
  serverVendorOther: string
  // 販売管理
  salesSysStatus: string
  salesSysVendor: string
  salesSysVendorOther: string
  // 勤怠
  attendanceStatus: string
  attendanceVendor: string
  attendanceVendorOther: string
  // セキュリティ
  securityStatus: string[]
  securityVendor: string
  securityVendorOther: string
  // 回線・ネットワーク
  networkType: string[]
  networkVendor: string
  networkVendorOther: string
  // 複合機
  mfpMaker: string[]
  mfpVendor: string
  mfpVendorOther: string
  mfpReplace: string
  // 電話
  phoneEnv: string
  phoneVendor: string
  phoneVendorOther: string
  // AI
  aiStatus: string
  aiServices: string[]
  aiServicesOther: string
}

export interface Issues {
  mainIssue: string
  planItems: string[]
  aiGoal: string
  itBudget: string
}

export interface Expectation {
  nps: number
  expectations: string[]
}

export interface SurveyData {
  mode: Mode
  step: number
  basicInfo: BasicInfo
  itEnv: ITEnv
  issues: Issues
  expectation: Expectation
}
