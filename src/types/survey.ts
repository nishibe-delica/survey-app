// === 認証ユーザー型 ===
export interface AuthUser {
  id: string;
  email: string;          // GWSメールアドレス（@delicasuito.com）
  name: string;           // 表示名（Googleアカウント名）
  avatarUrl: string | null; // プロフィール画像URL
}

export type Screen =
  | 'modeSelect'
  | 'adminLogin'
  | 'adminDashboard'
  | 'survey'
  | 'resultSummary'
  | 'whitespaceMap'
  | 'proposalCards';

export interface SurveyData {
  // Step1 基本情報
  companyName: string;
  industry: string;
  employeeSize: string;
  contactName: string;
  email: string;
  salesRepName: string;
  relationshipYears: string;

  // Step2 PC・端末
  pcMaker: string;           // メーカー（富士通/NEC/Dell/HP/Lenovo/その他）
  pcMakerOther: string;
  pcVendor: string;          // 購入先（スイテック/他社/メーカー直販/量販店）
  pcVendorOther: string;
  pcContract: string;        // 契約形態（購入/リース/レンタル/混在）
  pcLeaseEnd: string;        // リース満了時期（リース選択時のみ）
  pcCount: string;
  pcTypes: string[];

  // Step3 サーバー・クラウド
  serverEnv: string[];       // オンプレ/NAS/クラウド/未導入
  serverUsage: string[];     // 用途（ファイル共有/メール/業務システム/バックアップ/その他）
  serverVendor: string;
  serverVendorOther: string;

  // Step4 基幹システム
  coreSystemStatus: string;  // 導入済み/検討中/未導入
  coreSystemTypes: string[]; // 販売管理/在庫管理/会計/生産管理/CRM/その他
  coreSystemName: string;
  coreSystemCloud: string;   // クラウド型/オンプレ/不明
  coreSystemAge: string;     // 導入から何年（〜3年/3〜7年/7年以上/不明）
  coreSystemVendor: string;
  coreSystemVendorOther: string;

  // Step5 勤怠管理
  attendanceMethod: string;  // タイムカード/紙・手書き/Excelなど表計算/勤怠システム/その他
  attendanceSystemName: string;
  attendanceVendor: string;
  attendanceVendorOther: string;

  // Step6 セキュリティ
  securityStatus: string[];  // ウイルス対策ソフト/UTM/EDR/未対応/わからない
  securityLicenseCount: string; // ライセンス本数
  securityLastCheck: string; // 最後にセキュリティ診断を受けた時期
  securityVendor: string;
  securityVendorOther: string;

  // Step7 バックアップ
  backupStatus: string;      // 実施している/していない/わからない
  backupMethod: string[];    // 外付けHDD/NAS/クラウド/テープ/その他
  backupFrequency: string;   // 毎日/週1/月1/不定期
  backupRestoreTest: string; // 復元テスト実施（している/していない/したことない）
  backupVendor: string;
  backupVendorOther: string;

  // Step8 回線・ネットワーク
  networkTypes: string[];
  networkTypesOther: string;
  networkVendor: string;
  networkVendorOther: string;

  // Step9 複合機
  mfpMakers: string[];
  mfpMakerCounts: Record<string, string>; // メーカーごとの台数
  mfpVendor: string;
  mfpVendorOther: string;
  mfpReplaceTime: string;
  mfpColorPrint: string;     // カラー印刷月間枚数

  // Step10 電話
  phoneEnv: string;
  phoneVendor: string;
  phoneVendorOther: string;

  // Step11 保守・サポート契約
  maintenanceStatus: string; // 全て契約済み/一部契約/契約なし/わからない
  maintenanceExpired: string[]; // 保守切れ機器（PC/サーバー/ネットワーク機器/複合機/電話/なし）
  maintenanceVendor: string;
  maintenanceVendorOther: string;

  // Step12 AI活用
  aiStatus: string;
  aiServices: string[];
  aiServicesOther: string;
  aiBarriers: string[];      // 導入障壁（コスト/セキュリティ/使い方がわからない/必要性を感じない/その他）
  aiGoals: string;           // AIで実現したいこと（自由記述）

  // Step13 IT担当者・体制
  itStaffStatus: string;     // 専任担当者あり/兼任あり/担当者なし
  itOutsource: string;       // IT管理のアウトソース状況（全てアウトソース/一部/していない）
  itConsultation: string;    // IT相談先（スイテック/他社/社内/相談先なし）
  itConsultationOther: string;

  // Step14 課題・意向
  itIssues: string;
  consideringItems: string[];
  itBudget: string;

  // Step15 期待
  expectations: string[];

  // Step16 動画視聴
  videoWatched: boolean;
}

export type WhitespaceStatus = 'suiteq' | 'competitor' | 'considering' | 'none' | 'unknown';

export interface WhitespaceItem {
  category: string;
  icon: string;
  status: WhitespaceStatus;
  competitorName?: string;
  proposalMessage: string;
  urgency: 'high' | 'medium' | 'low' | 'none';
}

export interface ProposalCard {
  category: string;
  icon: string;
  title: string;
  description: string;
  urgencyLabel: string;
  urgencyColor: string;
}
