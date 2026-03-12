# survey-app 完全作り直し指示書 Part4

現在 `C:\Users\user\survey-app` にいることを確認してから実行してください。

## 概要
アンケートを19ステップに完全作り直します。
完了後は3段階の画面（IT環境サマリー→ホワイトスペースマップ→ご提案内容）を表示します。

---

## 新しいステップ構成（全19ステップ）

```
Step1  基本情報
Step2  PC・端末
Step3  サーバー・クラウド
Step4  基幹システム
Step5  勤怠管理
Step6  セキュリティ
Step7  バックアップ ★新規
Step8  回線・ネットワーク
Step9  複合機
Step10 電話
Step11 保守・サポート契約 ★新規
Step12 AI活用
Step13 IT担当者・体制 ★新規
Step14 課題・意向
Step15 スイテックへの期待
Step16 動画視聴
Step17 完了・ギフト表示
→ 画面A：IT環境サマリー
→ 画面B：ホワイトスペースマップ
→ 画面C：ご提案内容
```

---

## ファイル構成

```
src/
├── App.tsx
├── types/survey.ts
├── utils/whitespace.ts       ← ホワイトスペース判定ロジック
├── utils/proposals.ts        ← 提案内容生成ロジック
└── components/
    ├── ModeSelect.tsx
    ├── AdminLogin.tsx
    ├── AdminDashboard.tsx
    ├── StepIndicator.tsx
    ├── Step01_BasicInfo.tsx
    ├── Step02_PC.tsx
    ├── Step03_Server.tsx
    ├── Step04_CoreSystem.tsx
    ├── Step05_Attendance.tsx
    ├── Step06_Security.tsx
    ├── Step07_Backup.tsx
    ├── Step08_Network.tsx
    ├── Step09_MFP.tsx
    ├── Step10_Phone.tsx
    ├── Step11_Maintenance.tsx
    ├── Step12_AI.tsx
    ├── Step13_ITStaff.tsx
    ├── Step14_Issues.tsx
    ├── Step15_Expectation.tsx
    ├── Step16_Video.tsx
    ├── Step17_Complete.tsx
    ├── ResultSummary.tsx      ← 画面A：IT環境サマリー
    ├── WhitespaceMap.tsx      ← 画面B：ホワイトスペースマップ
    └── ProposalCards.tsx      ← 画面C：ご提案内容
```

---

## types/survey.ts

```typescript
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
```

---

## utils/whitespace.ts

```typescript
import { SurveyData, WhitespaceItem, WhitespaceStatus } from '../types/survey';

function getStatus(vendor: string, status?: string): WhitespaceStatus {
  if (vendor === 'suiteq') return 'suiteq';
  if (vendor === 'other') return 'competitor';
  if (status === '検討中') return 'considering';
  if (status === '未導入' || status === 'none') return 'none';
  return 'unknown';
}

export function calcWhitespace(data: Partial<SurveyData>): WhitespaceItem[] {
  return [
    {
      category: 'PC・端末',
      icon: '💻',
      status: getStatus(data.pcVendor || '', ''),
      competitorName: data.pcVendorOther,
      proposalMessage: '最適なPC・端末のご提案ができます',
      urgency: data.pcVendor === 'other' ? 'medium' : data.pcVendor === 'suiteq' ? 'none' : 'low',
    },
    {
      category: 'サーバー・クラウド',
      icon: '🖥️',
      status: getStatus(data.serverVendor || '', data.serverEnv?.includes('未導入') ? '未導入' : ''),
      competitorName: data.serverVendorOther,
      proposalMessage: 'クラウド移行・サーバー構築をご支援します',
      urgency: data.serverEnv?.includes('未導入') ? 'high' : data.serverVendor === 'other' ? 'medium' : 'none',
    },
    {
      category: '基幹システム',
      icon: '📊',
      status: getStatus(data.coreSystemVendor || '', data.coreSystemStatus),
      competitorName: data.coreSystemVendorOther,
      proposalMessage: '業務に最適な基幹システムをご提案します',
      urgency: data.coreSystemAge === '7年以上' ? 'high' : data.coreSystemStatus === '検討中' ? 'high' : data.coreSystemStatus === '未導入' ? 'medium' : 'none',
    },
    {
      category: '勤怠管理',
      icon: '⏰',
      status: getStatus(data.attendanceVendor || '', data.attendanceMethod === 'タイムカード' || data.attendanceMethod === '紙・手書き' ? '未導入' : ''),
      competitorName: data.attendanceVendorOther,
      proposalMessage: '勤怠管理システムの導入をサポートします',
      urgency: data.attendanceMethod === '紙・手書き' || data.attendanceMethod === 'タイムカード' ? 'high' : data.attendanceVendor === 'other' ? 'medium' : 'none',
    },
    {
      category: 'セキュリティ',
      icon: '🔒',
      status: getStatus(data.securityVendor || '', data.securityStatus?.includes('未対応') ? '未導入' : ''),
      competitorName: data.securityVendorOther,
      proposalMessage: 'セキュリティ対策の強化をご支援します',
      urgency: data.securityStatus?.includes('未対応') ? 'high' : data.securityVendor === 'other' ? 'medium' : 'none',
    },
    {
      category: 'バックアップ',
      icon: '💾',
      status: getStatus(data.backupVendor || '', data.backupStatus === 'していない' ? '未導入' : ''),
      competitorName: data.backupVendorOther,
      proposalMessage: '安全なバックアップ環境をご提案します',
      urgency: data.backupStatus === 'していない' ? 'high' : data.backupRestoreTest === 'したことない' ? 'medium' : 'none',
    },
    {
      category: '回線・ネットワーク',
      icon: '🌐',
      status: getStatus(data.networkVendor || '', ''),
      competitorName: data.networkVendorOther,
      proposalMessage: '安定した回線・ネットワーク環境をご提案します',
      urgency: data.networkVendor === 'other' ? 'medium' : 'none',
    },
    {
      category: '複合機',
      icon: '🖨️',
      status: getStatus(data.mfpVendor || '', ''),
      competitorName: data.mfpVendorOther,
      proposalMessage: '最新複合機へのリプレイスをご提案します',
      urgency: data.mfpReplaceTime === '1年以内' ? 'high' : data.mfpReplaceTime === '1〜3年' ? 'medium' : 'none',
    },
    {
      category: '電話・PBX',
      icon: '📞',
      status: getStatus(data.phoneVendor || '', ''),
      competitorName: data.phoneVendorOther,
      proposalMessage: 'クラウド電話へのリプレイスをご提案します',
      urgency: data.phoneEnv === '従来のビジネスフォン（PBX）' ? 'medium' : 'none',
    },
    {
      category: '保守・サポート',
      icon: '🔧',
      status: getStatus(data.maintenanceVendor || '', data.maintenanceStatus === '契約なし' ? '未導入' : ''),
      competitorName: data.maintenanceVendorOther,
      proposalMessage: '包括的な保守サポートをご提供します',
      urgency: data.maintenanceExpired?.length > 0 ? 'high' : data.maintenanceStatus === '契約なし' ? 'high' : 'none',
    },
    {
      category: 'AI活用',
      icon: '🤖',
      status: data.aiStatus === '積極的に活用中' || data.aiStatus === '一部で活用中' ? 'suiteq' : data.aiStatus === '検討中' ? 'considering' : 'none',
      proposalMessage: 'AI導入・活用のご支援ができます',
      urgency: data.aiStatus === '検討中' ? 'medium' : data.aiStatus === 'まだ活用していない' ? 'low' : 'none',
    },
  ];
}
```

---

## utils/proposals.ts

```typescript
import { WhitespaceItem, ProposalCard } from '../types/survey';

export function generateProposals(items: WhitespaceItem[]): ProposalCard[] {
  const proposals: ProposalCard[] = [];

  items.forEach(item => {
    if (item.status === 'suiteq') return; // スイテック取引中はスキップ

    if (item.urgency === 'high') {
      proposals.push({
        category: item.category,
        icon: item.icon,
        title: `【緊急】${item.category}のご提案`,
        description: item.proposalMessage,
        urgencyLabel: '早急なご対応をお勧めします',
        urgencyColor: 'red',
      });
    } else if (item.urgency === 'medium') {
      proposals.push({
        category: item.category,
        icon: item.icon,
        title: `${item.category}のご提案`,
        description: item.proposalMessage,
        urgencyLabel: 'ご検討をお勧めします',
        urgencyColor: 'orange',
      });
    } else if (item.urgency === 'low') {
      proposals.push({
        category: item.category,
        icon: item.icon,
        title: `${item.category}について`,
        description: item.proposalMessage,
        urgencyLabel: '将来的にご相談ください',
        urgencyColor: 'blue',
      });
    }
  });

  // 緊急度順にソート
  const order = { red: 0, orange: 1, blue: 2 };
  return proposals.sort((a, b) => order[a.urgencyColor as keyof typeof order] - order[b.urgencyColor as keyof typeof order]);
}
```

---

## 各Stepコンポーネントの仕様

### 共通デザインルール
```
- 白カード・角丸16px・影
- ヘッダー：アイコン＋タイトル（ネイビー）＋説明文（グレー）
- 選択ボタン：未選択＝白/グレーボーダー、選択済み＝ネイビー/白文字
- 「他社」選択時のみ会社名入力欄を表示（任意・空白でも次へ進める）
- 全項目：必須なし（何も選ばなくても次へ進める）
- 下部：「← 戻る」（グレー）「次へ →」（ネイビー）横並び
- メインカラー：#1E4D8C
```

---

### Step01_BasicInfo.tsx
```
タイトル：📋 基本情報
説明：お客様の基本情報をお聞かせください

- 会社名（テキスト）
- 業種（プルダウン）：製造業/卸売業/小売業/建設業/医療・福祉/サービス業/その他
- 従業員規模（ラジオ）：〜9名/10〜29名/30〜99名/100名以上
- お名前（テキスト）
- メールアドレス（テキスト）
- 担当スイテック営業名（テキスト）
- お付き合い年数（ラジオ）：1年未満/1〜3年/3〜10年/10年以上

全項目：任意（必須なし）
```

---

### Step02_PC.tsx
```
タイトル：💻 パソコン・端末
説明：パソコンやタブレットの導入状況をお聞かせください

Q1「主なメーカーは？」（複数選択可）
富士通 / NEC / Dell / HP / Lenovo / その他
→「その他」選択時：メーカー名入力欄を表示

Q2「購入先・管理会社は？」
スイテック / 他社 / メーカー直販 / 量販店
→「他社」選択時：会社名入力欄を表示

Q3「契約形態は？」
購入 / リース / レンタル / 混在
→「リース」選択時：「リース満了時期（目安）」を表示
   選択肢：1年以内/1〜3年/3年以上先/不明

Q4「台数規模（概算）」（任意）
〜10台 / 11〜30台 / 31〜100台 / 100台以上

Q5「端末の種類」（複数選択可・任意）
デスクトップPC / ノートPC / タブレット / その他
```

---

### Step03_Server.tsx
```
タイトル：🖥️ サーバー・クラウド
説明：データ管理・サーバー環境についてお聞かせください

Q1「現在の環境」（複数選択可）
オンプレミス（自社サーバー）/ NAS / クラウド（AWS・Azure等）/ 未導入

Q2「主な用途」（複数選択可・任意）
ファイル共有 / メールサーバー / 業務システム / バックアップ / その他

Q3「管理・導入会社」
スイテック / 他社 / 自社管理 / わからない
→「他社」選択時：会社名入力欄を表示
```

---

### Step04_CoreSystem.tsx
```
タイトル：📊 基幹システム
説明：受注・販売・会計など業務の中核となるシステムについてお聞かせください

Q1「導入状況」
導入済み / 検討中 / 未導入

Q2「利用中のシステム種類」（複数選択可・導入済みの場合に表示）
販売管理 / 在庫管理 / 会計・財務 / 生産管理 / CRM（顧客管理）/ その他

Q3「システム名（任意）」（テキスト入力）
例：弥生、マネーフォワード、SAP、独自開発 など

Q4「システムの種類」（導入済みの場合に表示）
クラウド型（SaaS）/ オンプレミス（自社設置）/ 不明

Q5「導入からの年数」（導入済みの場合に表示）
3年未満 / 3〜7年 / 7年以上 / 不明
※7年以上の場合は「老朽化のリプレイス提案チャンス」として判定

Q6「導入・管理会社」
スイテック / 他社 / 自社開発 / わからない
→「他社」選択時：会社名入力欄を表示
```

---

### Step05_Attendance.tsx
```
タイトル：⏰ 勤怠管理
説明：出退勤・勤務時間の管理方法についてお聞かせください

Q1「現在の勤怠管理方法は？」
タイムカード / 紙・手書き / Excel等の表計算 / 勤怠管理システム / その他
※タイムカード・紙の場合は自動的に「未導入」として判定

Q2「利用中のシステム名（任意）」（勤怠システム選択時に表示）
テキスト入力：例）ジョブカン、freee人事労務、KING OF TIME など

Q3「導入・管理会社」（勤怠システム・検討中の場合に表示）
スイテック / 他社 / 自社 / わからない
→「他社」選択時：会社名入力欄を表示
```

---

### Step06_Security.tsx
```
タイトル：🔒 セキュリティ
説明：情報セキュリティ対策の状況についてお聞かせください

Q1「現在の対策状況」（複数選択可）
ウイルス対策ソフト / UTM（統合脅威管理）/ EDR / 未対応 / わからない

Q2「ウイルス対策ソフトのライセンス本数（任意）」（ウイルス対策ソフト選択時に表示）
〜10本 / 11〜30本 / 31〜100本 / 100本以上 / 不明

Q3「最後にセキュリティ診断を受けた時期（任意）」
1年以内 / 1〜3年前 / 3年以上前 / 受けたことがない / わからない

Q4「管理・導入会社」
スイテック / 他社 / 自社管理 / 未導入
→「他社」選択時：会社名入力欄を表示
```

---

### Step07_Backup.tsx
```
タイトル：💾 バックアップ
説明：データのバックアップ状況についてお聞かせください
※近年ランサムウェア被害が急増しています。バックアップ体制の確認は非常に重要です。

Q1「バックアップを実施していますか？」
定期的に実施している / 不定期に実施している / していない / わからない

Q2「バックアップ方法」（複数選択可・実施している場合に表示）
外付けHDD / NAS / クラウドストレージ / テープ / その他

Q3「バックアップ頻度」（実施している場合に表示）
毎日 / 週1回 / 月1回 / 不定期

Q4「復元テストを実施したことがありますか？」（実施している場合に表示）
定期的に実施している / 実施したことがある / したことがない / わからない

Q5「管理・担当会社（任意）」
スイテック / 他社 / 自社管理 / わからない
→「他社」選択時：会社名入力欄を表示
```

---

### Step08_Network.tsx
```
タイトル：🌐 回線・ネットワーク
説明：インターネット回線・社内ネットワークについてお聞かせください

Q1「回線の種類」（複数選択可）
光回線（有線）/ 無線LAN（Wi-Fi）/ MVNO / モバイルルーター / その他
→「その他」選択時：内容入力欄を表示

Q2「管理・導入会社」
スイテック / 他社 / 自社管理 / わからない
→「他社」選択時：会社名入力欄を表示
```

---

### Step09_MFP.tsx
```
タイトル：🖨️ 複合機・プリンター
説明：コピー機・複合機・プリンターについてお聞かせください

Q1「メーカー」（複数選択可）
富士フイルム / リコー / コニカミノルタ / キヤノン / その他

Q2「メーカーごとの台数」（選択したメーカーごとに表示）
例：富士フイルム → 1台/2台/3台/4台以上
    リコー      → 1台/2台/3台/4台以上
（選択したメーカーの数だけ表示する）

Q3「管理・導入会社」
スイテック / 他社 / 不明
→「他社」選択時：会社名入力欄を表示

Q4「次回リプレイス時期の目安（任意）」
1年以内 / 1〜3年 / 3年以上先 / 未定

Q5「カラー印刷の月間枚数（任意）」
〜500枚 / 500〜2000枚 / 2000〜5000枚 / 5000枚以上 / 不明
```

---

### Step10_Phone.tsx
```
タイトル：📞 電話
説明：会社の電話・内線環境についてお聞かせください

Q1「現在の電話環境」
従来のビジネスフォン（PBX）
※PBX：会社内の内線電話を管理する装置のことです
クラウド電話（インターネット回線を使った電話）
IP-PBX（インターネット技術を使った社内電話システム）
携帯電話のみ
その他

Q2「管理・導入会社」
スイテック / 他社 / 不明
→「他社」選択時：会社名入力欄を表示
```

---

### Step11_Maintenance.tsx
```
タイトル：🔧 保守・サポート契約
説明：機器・システムの保守サポート状況についてお聞かせください
※保守サポートが切れた機器はトラブル時に修理できない場合があります

Q1「現在の保守サポート契約状況」
全ての機器・システムで契約済み / 一部のみ契約 / 契約していない / わからない

Q2「保守サポートが切れている（または不明な）機器・システム」（複数選択可・任意）
PC・端末 / サーバー / ネットワーク機器 / 複合機 / 電話機 / 特になし

Q3「IT機器・システムの相談先（任意）」
スイテック / 他社 / 社内で対応 / 相談先がない
→「他社」選択時：会社名入力欄を表示
```

---

### Step12_AI.tsx
```
タイトル：🤖 AI活用
説明：AIツールの活用状況と今後の意向についてお聞かせください

Q1「現在のAI活用状況」
積極的に活用している / 一部の業務で活用している / 検討中 / まだ活用していない

Q2「利用中・検討中のAIサービス」（複数選択可・活用中または検討中の場合に表示）
ChatGPT / Microsoft Copilot / Claude / Google Gemini / その他
→「その他」選択時：サービス名入力欄を表示

Q3「AI導入の障壁（任意）」（検討中・未活用の場合に表示）
コストが不明 / セキュリティが不安 / 使い方がわからない /
必要性を感じない / 社内の理解が得られない / その他

Q4「AIで実現したいこと（任意）」（テキストエリア）
例：書類作成の自動化、問い合わせ対応、データ分析など
```

---

### Step13_ITStaff.tsx
```
タイトル：👥 IT担当・体制
説明：社内のIT管理体制についてお聞かせください

Q1「社内のIT担当者は？」
IT専任担当者がいる / 他業務と兼任している / IT担当者がいない

Q2「IT管理のアウトソース状況（任意）」
全てアウトソースしている / 一部アウトソースしている / していない

Q3「ITに関する相談先（任意）」
スイテック / 他社のITベンダー / 社内で完結 / 相談先がない
→「他社」選択時：会社名入力欄を表示
```

---

### Step14_Issues.tsx
```
タイトル：💬 現在の課題・意向
説明：ITに関するお困りごとや今後の計画をお聞かせください

Q1「現在のITで最も困っていることは？（任意）」（テキストエリア）
プレースホルダー：例）システムが古くて使いにくい、セキュリティが不安、
　　　　　　　　　　　担当者が退職してわからないことが増えた など

Q2「1年以内に検討しているIT項目（任意）」（複数選択可）
PC・端末 / サーバー・クラウド / 基幹システム / 勤怠管理 /
セキュリティ / バックアップ / AI導入 / 回線・NW / 電話 / 複合機 / その他

Q3「IT投資の年間予算感（任意）」
〜50万円 / 50〜200万円 / 200〜500万円 / 500万円以上 / 未定
```

---

### Step15_Expectation.tsx
```
タイトル：🌟 スイテックへのご期待
説明：創業40周年を迎えたスイテックへのご意見・ご期待をお聞かせください

Q1「スイテックに今後期待することは？（複数選択可・任意）」
迅速な対応 / 提案力の向上 / 価格競争力 /
最新技術の情報提供 / 担当者との関係強化 / サポート品質の向上 / その他
```

---

### Step16_Video.tsx
```
タイトル：🎬 スイテック40周年紹介
説明：スイテックの40年の歩みをご覧ください

・YouTubeサンプル動画を埋め込み
  URL: https://www.youtube.com/embed/dQw4w9WgXcQ
  （後で差し替え予定のサンプル）

・「動画を視聴しました」チェックボックス
  （チェックしなくても次へ進める）

・「次へ（アンケート完了）→」ボタン
```

---

### Step17_Complete.tsx（華やかなデザイン）
```
背景：ネイビー（#1E4D8C）グラデーション
紙吹雪アニメーション（CSSキーフレームで実装）

中央カード（白・角丸・影）：
  🎉「ご回答ありがとうございました！」
  「創業40周年記念 ITアンケートにご協力いただき、誠にありがとうございます。」

ギフトエリア：
  🎁「Amazonギフト券プレゼント」
  コード：AMZN-DEMO-1234-5678（大きく表示・コピーボタン付き）
  「Amazonのギフト券コード入力画面でご利用ください」

ボタン（縦に並べる）：
  「📊 IT環境サマリーを見る」→ ResultSummaryへ
  「🏠 最初に戻る」（小さめ・グレー）
```

---

## ResultSummary.tsx（画面A：IT環境サマリー）

```
ヘッダー（ネイビー）：
  「📊 IT環境サマリー」
  「○○株式会社 様　担当：[営業名]」

回答内容を全カテゴリで一覧表示：
  各カテゴリをカード形式で表示
  左：アイコン＋カテゴリ名
  右：回答内容（選択値・入力値をそのまま表示）

例：
  💻 PC・端末
    購入先：他社（△△商会）
    台数：11〜30台
    契約形態：リース（満了：1〜3年）

  🖥️ サーバー・クラウド
    環境：クラウド（AWS・Azure等）
    用途：ファイル共有・業務システム
    管理会社：他社（□□システム）

下部ボタン：
  「次へ：ホワイトスペースマップを見る →」（ネイビー・大きめ）
  「← アンケートに戻る」（グレー・小さめ）
```

---

## WhitespaceMap.tsx（画面B：ホワイトスペースマップ）

```
ヘッダー（ネイビー）：
  「🗺️ ホワイトスペースマップ」
  「スイテックとのお取引状況と新しいご提案ができる領域です」

上部メッセージ（ライトブルー背景）：
  「✨ スイテックから○件の新しいご提案ができます」
  ※ランク・スコアは一切表示しない

カード一覧（11カテゴリ）：
  各カテゴリを横幅いっぱいのカードで表示
  
  ステータス表示：
    🟢 緑バッジ「スイテックご利用中」→ 提案メッセージなし
    🟠 オレンジバッジ「[他社名]をご利用中」→「より良いご提案ができます」
    🟡 黄バッジ「ご検討中」→「タイムリーなご提案があります」
    ⚪ グレーバッジ「未導入」→「導入のご支援ができます」
    ➖ 表示なし「情報なし」→ メッセージなし

下部ボタン：
  「次へ：スイテックからのご提案を見る →」（ネイビー・大きめ）
  「← IT環境サマリーに戻る」（グレー）
```

---

## ProposalCards.tsx（画面C：ご提案内容）

```
ヘッダー（ネイビー）：
  「💡 スイテックからのご提案」
  「○○株式会社 様へのご提案内容」

提案カード一覧（緊急度順に自動表示）：

  【緊急提案カード】赤いボーダー・左に赤帯
    🔒 セキュリティ対策のご提案
    「セキュリティが未対応です。ウイルス対策・UTM導入をお勧めします。」
    「⚠️ 早急なご対応をお勧めします」

  【通常提案カード】オレンジボーダー・左にオレンジ帯
    💻 PC・端末のリプレイスご提案
    「現在他社製品をご利用中です。次回更新時はぜひご相談ください。」
    「📋 ご検討をお勧めします」

  【将来提案カード】ブルーボーダー・左にブルー帯
    🤖 AI活用のご提案
    「AI導入のご支援ができます。まずはお気軽にご相談ください。」
    「💡 将来的にご相談ください」

提案がない場合：
  「現在のITご支援状況は良好です。引き続きスイテックにお任せください。」

下部（ネイビー背景エリア）：
  「📞 詳しくはスイテックまでお問い合わせください」
  「担当：[営業名]　スイテック」
  「🏠 最初に戻る」ボタン（白・ネイビー文字）
```

---

## StepIndicator.tsx（更新）

```
19ステップ対応
表示：「ステップ 3 / 19　サーバー・クラウド」
プログレスバー：現在ステップ/19 の割合で表示
スマホ：番号のみ表示
```

---

## App.tsx の画面管理

```typescript
type Screen = 'modeSelect' | 'adminLogin' | 'adminDashboard' | 'survey' | 'resultSummary' | 'whitespaceMap' | 'proposalCards';

// ステップ1〜19
const [currentStep, setCurrentStep] = useState(1);
const [screen, setScreen] = useState<Screen>('modeSelect');
const [surveyData, setSurveyData] = useState<Partial<SurveyData>>({});

const handleNext = (stepData: Partial<SurveyData>) => {
  const newData = { ...surveyData, ...stepData };
  setSurveyData(newData);
  if (currentStep < 19) {
    setCurrentStep(currentStep + 1);
  } else {
    setScreen('resultSummary');
  }
};

const handleBack = () => {
  if (currentStep > 1) setCurrentStep(currentStep - 1);
  else setScreen('modeSelect');
};
```

---

## デザイン統一ルール

```
メインカラー：#1E4D8C（ネイビー）
アクセント：#F0A500（ゴールド）
背景：#F5F7FA
カード背景：#FFFFFF
テキスト：#1A1A2E
サブテキスト：#666666

緊急：#DC2626（赤）
注意：#F97316（オレンジ）
情報：#3B82F6（ブルー）
成功：#16A34A（グリーン）

ボタン：
  プライマリ：#1E4D8C・白文字・角丸8px・padding 14px 32px
  セカンダリ：白・#1E4D8C ボーダー＆文字
  非活性：#CCCCCC
```

---

## 完了後の確認項目

```
1. トップ画面
   ✓ 「営業同行モードで始める」ボタンのみ
   ✓ 右下に「管理者ログイン」リンク

2. アンケート（Step1〜19）
   ✓ 全ステップに戻る・次へボタン
   ✓ 「他社」選択時のみ会社名入力欄表示
   ✓ 全項目任意（空白でも次へ進める）
   ✓ Step16に動画埋め込み

3. 完了後の3画面
   ✓ 画面A：IT環境サマリー（全回答内容表示）
   ✓ 画面B：ホワイトスペースマップ（ステータスバッジ表示）
   ✓ 画面C：ご提案内容（緊急度順の提案カード自動表示）

4. 管理者画面
   ✓ パスワード「1111」でログイン
   ✓ ダミーデータで回答一覧表示

完了したらスクリーンショットを送ってください。
```
