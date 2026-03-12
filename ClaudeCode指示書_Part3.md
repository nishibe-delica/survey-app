# survey-app 改善指示書 Part3

現在 `C:\Users\user\survey-app` にいることを確認してから実行してください。

---

## 今回の改善内容

1. セルフモード削除（同行ヒアリング専用に変更）
2. トップ画面に「管理者ログイン」ボタン追加（パスワード：1111）
3. 戻るボタンを全ステップに追加
4. Step2（IT環境）を9カテゴリ×1ページに分割（全13ステップ構成）
5. 「他社」選択時のみ会社名入力欄を表示
6. ホワイトスペースマップをポジティブメッセージのみに変更（ランク削除）
7. ホワイトスペースマップを全画面表示に変更（モーダル廃止）
8. 進捗バーを13ステップ対応に更新
9. 完了画面を華やかに変更
10. アンケート画面のデザイン改善（カード・余白・タップしやすいボタン）

---

## 新しいステップ構成

```
Step1  基本情報
Step2  PC・端末
Step3  サーバー・クラウド
Step4  販売管理システム
Step5  勤怠システム
Step6  セキュリティ
Step7  回線・ネットワーク
Step8  複合機・MFP
Step9  電話・IP-PBX
Step10 AI活用
Step11 課題・意向
Step12 スイテックへの期待（NPS）
Step13 完了・ホワイトスペースマップ
```

---

## ファイル構成（全面刷新）

以下のファイルを新規作成・更新してください。

```
src/
├── App.tsx                         ← 全面更新
├── types/survey.ts                 ← 全面更新
└── components/
    ├── ModeSelect.tsx              ← セルフモード削除・管理者ログイン追加
    ├── AdminLogin.tsx              ← 新規作成
    ├── AdminDashboard.tsx          ← 新規作成（ダミーデータで表示）
    ├── StepIndicator.tsx           ← 13ステップ対応に更新
    ├── Step01_BasicInfo.tsx        ← 更新
    ├── Step02_PC.tsx               ← 新規作成（PCカテゴリ単独）
    ├── Step03_Server.tsx           ← 新規作成
    ├── Step04_Sales.tsx            ← 新規作成
    ├── Step05_Attendance.tsx       ← 新規作成
    ├── Step06_Security.tsx         ← 新規作成
    ├── Step07_Network.tsx          ← 新規作成
    ├── Step08_MFP.tsx              ← 新規作成
    ├── Step09_Phone.tsx            ← 新規作成
    ├── Step10_AI.tsx               ← 新規作成
    ├── Step11_Issues.tsx           ← 更新
    ├── Step12_Expectation.tsx      ← 更新
    ├── Step13_Complete.tsx         ← 全面更新（華やかなデザイン）
    └── WhitespaceMap.tsx           ← 全面更新（全画面・ポジティブメッセージ）
```

---

## 詳細仕様

### types/survey.ts

```typescript
export type Mode = 'accompany'; // セルフモード削除

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
  pcVendor: string;          // 'suiteq' | 'other' | 'direct' | 'retail'
  pcVendorOther: string;     // 他社選択時の会社名
  pcCount: string;
  pcTypes: string[];

  // Step3 サーバー・クラウド
  serverEnv: string[];
  serverVendor: string;
  serverVendorOther: string;

  // Step4 販売管理
  salesSystem: string;       // 'installed' | 'considering' | 'none'
  salesSystemName: string;
  salesSystemVendor: string;
  salesSystemVendorOther: string;

  // Step5 勤怠システム
  attendanceSystem: string;
  attendanceSystemName: string;
  attendanceVendor: string;
  attendanceVendorOther: string;

  // Step6 セキュリティ
  securityStatus: string[];
  securityVendor: string;
  securityVendorOther: string;

  // Step7 回線・NW
  networkTypes: string[];
  networkVendor: string;
  networkVendorOther: string;

  // Step8 複合機
  mfpMakers: string[];
  mfpVendor: string;
  mfpVendorOther: string;
  mfpReplaceTime: string;

  // Step9 電話
  phoneEnv: string;
  phoneVendor: string;
  phoneVendorOther: string;

  // Step10 AI
  aiStatus: string;
  aiServices: string[];
  aiServicesOther: string;

  // Step11 課題
  itIssues: string;
  consideringItems: string[];
  aiGoals: string;
  itBudget: string;

  // Step12 期待
  nps: number;
  expectations: string[];
}

export type WhitespaceStatus = 'suiteq' | 'competitor' | 'considering' | 'none' | 'unknown';

export interface WhitespaceItem {
  category: string;
  icon: string;
  status: WhitespaceStatus;
  competitorName?: string;
  message: string;
}
```

---

### App.tsx の構造

```typescript
// 画面管理
type Screen = 'modeSelect' | 'adminLogin' | 'adminDashboard' | 'survey' | 'whitespace';

// surveyステップは1〜13
const [currentStep, setCurrentStep] = useState(1);
const [screen, setScreen] = useState<Screen>('modeSelect');
const [surveyData, setSurveyData] = useState<Partial<SurveyData>>({});

// 戻る処理
const handleBack = () => {
  if (currentStep > 1) setCurrentStep(currentStep - 1);
  else setScreen('modeSelect');
};

// 次へ処理
const handleNext = (data: Partial<SurveyData>) => {
  setSurveyData(prev => ({ ...prev, ...data }));
  if (currentStep < 13) setCurrentStep(currentStep + 1);
};
```

---

### ModeSelect.tsx

- 画面中央にスイテックロゴ（テキスト）と「創業40周年記念 ITアンケート」
- 「🤝 営業同行モードで始める」ボタン（大きめ・ネイビー）
- 画面右下に小さく「管理者ログイン」テキストリンク
- セルフモードボタンは削除

---

### AdminLogin.tsx

- シンプルなパスワード入力画面
- パスワード：1111
- 間違えたら「パスワードが違います」エラー表示
- 「← 戻る」リンク

---

### AdminDashboard.tsx

- ダミーデータで以下を表示：
  - 回答件数：12件
  - 担当営業別テーブル（田中太郎：5件、鈴木花子：4件、佐藤一郎：3件）
  - 最近の回答リスト（会社名・担当営業・日時・ホワイトスペース件数）
- 「← ログアウト」ボタン
- 「Googleスプレッドシートで開く」ボタン（ダミー・リンクなし）

---

### StepIndicator.tsx

- 13ステップ対応
- 現在のステップ番号と名前を表示
- 「Step 3 / 13 ｜ サーバー・クラウド」形式
- プログレスバーで進捗を視覚化
- スマホでは番号のみ表示（名前は省略）

---

### 各Stepコンポーネントの共通デザイン仕様

```
- 白背景カード・角丸16px・影付き
- カード内上部にカテゴリアイコン＋タイトル（ネイビー）
- 質問ラベルは太字・グレー
- 選択ボタン：
    未選択：白背景・グレーボーダー
    選択済み：ネイビー背景・白文字
    サイズ：padding 12px 20px・角丸8px
- 「他社」選択時：下に会社名入力欄をスムーズに表示（アニメーション）
- 下部に「← 戻る」（グレー）と「次へ →」（ネイビー）ボタンを横並び
- 「次へ」は必須項目が未入力の場合は非活性（グレーアウト）
```

---

### Step02_PC.tsx の実装例（他Stepの参考に）

```
タイトル：💻 PC・端末
説明文：パソコンやタブレットの導入・管理状況をお聞かせください

質問1「購入先・管理会社」
選択肢：スイテック / 他社 / メーカー直販 / 量販店
※「他社」選択時：「→ 会社名を入力してください」テキスト入力欄を表示

質問2「台数規模（概算）」
選択肢：〜10台 / 11〜30台 / 31〜100台 / 100台以上

質問3「端末の種類」（複数選択可）
選択肢：デスクトップPC / ノートPC / タブレット / その他
```

---

### Step03_Server.tsx

```
タイトル：🖥️ サーバー・クラウド
説明文：データ管理・サーバー環境についてお聞かせください

質問1「現在の環境」（複数選択可）
選択肢：オンプレミス（自社サーバー）/ NAS / クラウド（AWS・Azure等）/ 未導入

質問2「管理・導入会社」
選択肢：スイテック / 他社 / 自社管理 / わからない
※「他社」選択時：会社名入力欄を表示
```

---

### Step04_Sales.tsx

```
タイトル：📊 販売管理システム
説明文：受注・売上・在庫などの管理システムについてお聞かせください

質問1「導入状況」
選択肢：導入済み / 検討中 / 未導入

質問2「導入・管理会社」（「導入済み」または「検討中」の場合に表示）
選択肢：スイテック / 他社 / 自社開発
※「他社」選択時：会社名入力欄を表示
```

---

### Step05_Attendance.tsx

```
タイトル：⏰ 勤怠システム
説明文：出退勤・勤務時間の管理システムについてお聞かせください

質問1「導入状況」
選択肢：導入済み / 検討中 / 未導入

質問2「導入・管理会社」（「導入済み」または「検討中」の場合に表示）
選択肢：スイテック / 他社 / 自社開発
※「他社」選択時：会社名入力欄を表示
```

---

### Step06_Security.tsx

```
タイトル：🔒 セキュリティ
説明文：情報セキュリティ対策の状況についてお聞かせください

質問1「対策状況」（複数選択可）
選択肢：ウイルス対策ソフト / UTM（統合脅威管理）/ EDR / 未対応 / わからない

質問2「管理・導入会社」
選択肢：スイテック / 他社 / 自社管理 / 未導入
※「他社」選択時：会社名入力欄を表示
```

---

### Step07_Network.tsx

```
タイトル：🌐 回線・ネットワーク
説明文：インターネット回線・社内ネットワークについてお聞かせください

質問1「回線の種類」（複数選択可）
選択肢：光回線（有線）/ 無線LAN（Wi-Fi）/ MVNO / モバイルルーター / その他

質問2「管理・導入会社」
選択肢：スイテック / 他社 / 自社管理 / わからない
※「他社」選択時：会社名入力欄を表示
```

---

### Step08_MFP.tsx

```
タイトル：🖨️ 複合機・MFP
説明文：コピー機・複合機・プリンターについてお聞かせください

質問1「メーカー」（複数選択可）
選択肢：富士フイルム / リコー / コニカミノルタ / キヤノン / その他

質問2「管理・導入会社」
選択肢：スイテック / 他社 / 不明
※「他社」選択時：会社名入力欄を表示

質問3「次回リプレイス時期の目安」
選択肢：1年以内 / 1〜3年 / 3年以上先 / 未定
```

---

### Step09_Phone.tsx

```
タイトル：📞 電話・IP-PBX
説明文：会社の電話環境についてお聞かせください

質問1「現在の電話環境」
選択肢：従来のビジネスフォン（PBX）/ クラウド電話 / IP-PBX / 携帯電話のみ / その他

質問2「管理・導入会社」
選択肢：スイテック / 他社 / 不明
※「他社」選択時：会社名入力欄を表示
```

---

### Step10_AI.tsx

```
タイトル：🤖 AI活用
説明文：AIツールの活用状況についてお聞かせください

質問1「活用状況」
選択肢：積極的に活用中 / 一部で活用中 / 検討中 / まだ活用していない

質問2「利用中のAIサービス」（複数選択可・「積極活用中」「一部活用」の場合に表示）
選択肢：ChatGPT / Microsoft Copilot / Claude / Google Gemini / その他
※「その他」選択時：サービス名入力欄を表示
```

---

### Step11_Issues.tsx

```
タイトル：💬 現在のITの課題
説明文：ITに関するお困りごとや今後の計画をお聞かせください

質問1「現在のITで最も困っていることは？」（テキストエリア・任意）
プレースホルダー：例）システムが古くて使いにくい、セキュリティが不安など

質問2「1年以内に検討しているIT項目」（複数選択可・任意）
選択肢：PC・端末 / サーバー・クラウド / 販売管理 / 勤怠システム / セキュリティ / AI導入 / 回線・NW / 電話 / 複合機 / その他

質問3「AIで実現したいことは？」（テキストエリア・任意）
プレースホルダー：例）書類作成の自動化、問い合わせ対応など

質問4「IT投資の年間予算感」（任意）
選択肢：〜50万円 / 50〜200万円 / 200〜500万円 / 500万円以上 / 未定
```

---

### Step12_Expectation.tsx

```
タイトル：🌟 スイテックへのご期待
説明文：創業40周年を迎えたスイテックへのご意見・ご期待をお聞かせください

質問1「スイテックを知人・同業者にお勧めする可能性は？」
0〜10のスライダー
左ラベル：「0 勧めない」　右ラベル：「10 ぜひ勧めたい」
現在値を大きく中央に表示

質問2「スイテックに今後期待すること」（複数選択可・任意）
選択肢：迅速な対応 / 提案力の向上 / 価格競争力 / 最新技術の情報提供 / 担当者との関係強化 / サポート品質の向上 / その他
```

---

### Step13_Complete.tsx（華やかなデザイン）

```
背景：ネイビーのグラデーション
上部：🎉 大きな紙吹雪アニメーション（CSSで実装）
中央：
  「ご回答ありがとうございました！」（白・大文字）
  「創業40周年記念 ITアンケートにご協力いただき、誠にありがとうございます。」

ギフトカード：
  白いカード・角丸・影
  「🎁 Amazonギフト券プレゼント」
  ギフトコード：[AMZN-1234-5678-ABCD]（大きめ・コピーボタン付き）
  「上記コードをAmazonのギフト券コード入力画面でご利用ください」

ホワイトスペースマップボタン：
  「📊 IT環境サマリーを見る」（白背景・ネイビー文字・大きめボタン）
  ※同行モードのみ表示

「最初に戻る」ボタン（小さめ・グレー）
```

---

### WhitespaceMap.tsx（全面刷新）

**全画面表示（モーダル廃止）**

```
ヘッダー：
  ネイビー背景
  「📊 ○○株式会社 様のIT環境サマリー」（会社名を表示）
  「担当：[営業名]」

上部メッセージエリア：
  ライトブルー背景
  「✨ スイテックから新しいご提案ができます」（ポジティブメッセージ）
  ※ランク・スコアは一切表示しない

カード一覧（9カテゴリ）：
  各カテゴリを横幅いっぱいのカードで表示
  左：アイコン＋カテゴリ名
  右：ステータスバッジ＋提案メッセージ

ステータスバッジと提案メッセージ：
  🟢 スイテック：「緑バッジ：ご利用中」 → メッセージ非表示
  🔴 競合他社：「オレンジバッジ：[他社名]をご利用中」 → 「より良いご提案ができます」
  🟡 検討中：「黄バッジ：検討中」 → 「タイムリーなご提案があります」
  ⚪ 未導入：「グレーバッジ：未導入」 → 「導入のご支援ができます」
  ➖ 情報なし：バッジ非表示・メッセージ非表示

フッター：
  「← アンケートに戻る」ボタン
  「最初に戻る」ボタン
```

---

## ホワイトスペース判定ロジック（WhitespaceMap.tsx内）

```typescript
function calcWhitespace(data: Partial<SurveyData>): WhitespaceItem[] {
  return [
    {
      category: 'PC・端末',
      icon: '💻',
      status: getVendorStatus(data.pcVendor),
      competitorName: data.pcVendorOther,
      message: getProposalMessage(getVendorStatus(data.pcVendor))
    },
    // 同様に9カテゴリ分
  ];
}

function getVendorStatus(vendor?: string): WhitespaceStatus {
  if (!vendor) return 'unknown';
  if (vendor === 'suiteq') return 'suiteq';
  if (vendor === 'other') return 'competitor';
  if (vendor === 'considering') return 'considering';
  if (vendor === 'none') return 'none';
  return 'unknown';
}

function getProposalMessage(status: WhitespaceStatus): string {
  switch (status) {
    case 'competitor': return 'より良いご提案ができます';
    case 'considering': return 'タイムリーなご提案があります';
    case 'none': return '導入のご支援ができます';
    default: return '';
  }
}
```

---

## デザイン統一ルール

```
メインカラー：#1E4D8C（ネイビー）
アクセント：#F0A500（ゴールド・完了画面・強調に使用）
背景：#F5F7FA（薄いグレー）
カード背景：#FFFFFF
テキスト：#1A1A2E（ほぼ黒）
サブテキスト：#666666

ボタン：
  プライマリ（次へ）：#1E4D8C 背景・白文字・角丸8px・padding 14px 32px
  セカンダリ（戻る）：白背景・#1E4D8C ボーダー・#1E4D8C 文字
  非活性：#CCCCCC 背景・白文字

フォント：
  見出し：24px bold
  本文：16px
  補足：14px gray

間隔：
  カード padding：24px
  質問間：24px
  選択肢間：8px
```

---

## 完了後の確認

```
npm run dev で起動後、以下を確認してください：

1. トップ画面
   - 「営業同行モードで始める」ボタンのみ表示
   - 右下に「管理者ログイン」リンク

2. 管理者ログイン
   - パスワード「1111」で管理画面に入れる
   - 間違えるとエラー表示

3. アンケート
   - Step1〜13が順番に表示される
   - 各ステップに「戻る」「次へ」ボタン
   - 「他社」選択時に会社名入力欄が表示される

4. 完了画面
   - 紙吹雪・ギフトコード表示
   - 「IT環境サマリーを見る」ボタン

5. ホワイトスペースマップ
   - 全画面表示（モーダルではない）
   - ランク・スコア非表示
   - ポジティブなメッセージのみ表示

完了したらスクリーンショットを共有してください。
```
