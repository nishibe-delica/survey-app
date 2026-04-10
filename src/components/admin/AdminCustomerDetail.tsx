import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { calcWhitespace } from '../../utils/whitespace';
import type { WhitespaceItem } from '../../types/survey';

interface AdminCustomerDetailProps {
  customerId: string;
  onBack: () => void;
}

type TabType = 'answers' | 'whitespace' | 'proposals';

export default function AdminCustomerDetail({ customerId, onBack }: AdminCustomerDetailProps) {
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<TabType>('answers');
  const [customer, setCustomer] = useState<any>(null);
  const [whitespace, setWhitespace] = useState<WhitespaceItem[]>([]);

  useEffect(() => {
    fetchCustomerDetail();
  }, [customerId]);

  async function fetchCustomerDetail() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('id', customerId)
        .single();

      if (error) throw error;

      setCustomer(data);

      // ホワイトスペース計算
      const answers = data.answers || {};
      const ws = calcWhitespace(answers);
      setWhitespace(ws);

    } catch (error) {
      console.error('データ取得エラー:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }

  function getStatusBadge(status: string) {
    const styles = {
      suiteq: 'bg-green-100 text-green-700',
      competitor: 'bg-orange-100 text-orange-700',
      considering: 'bg-yellow-100 text-yellow-700',
      none: 'bg-gray-100 text-gray-700',
      unknown: 'bg-gray-50 text-gray-500',
    };

    const labels = {
      suiteq: 'スイテック取引中',
      competitor: '競合導入',
      considering: '検討中',
      none: '未導入',
      unknown: '情報なし',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  }

  function getUrgencyBadge(urgency?: string) {
    if (!urgency || urgency === 'none') return null;

    const styles = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-blue-100 text-blue-700',
    };

    const labels = {
      high: '優先度: 高',
      medium: '優先度: 中',
      low: '優先度: 低',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[urgency as keyof typeof styles]}`}>
        {labels[urgency as keyof typeof labels]}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>お客様情報が見つかりませんでした</p>
        <button
          onClick={onBack}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          一覧に戻る
        </button>
      </div>
    );
  }

  const answers = customer.answers || {};

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          ← 一覧に戻る
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{customer.company_name}</h1>
        <div className="text-sm text-gray-600">
          担当: {customer.sales_name} | 回答日時: {formatDate(customer.created_at)}
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="bg-white rounded-xl shadow-sm p-2 flex gap-2">
        <button
          onClick={() => setCurrentTab('answers')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${currentTab === 'answers'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          📝 回答内容
        </button>
        <button
          onClick={() => setCurrentTab('whitespace')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${currentTab === 'whitespace'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          🗺️ ホワイトスペース
        </button>
        <button
          onClick={() => setCurrentTab('proposals')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${currentTab === 'proposals'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          💡 ご提案
        </button>
      </div>

      {/* タブコンテンツ */}
      {currentTab === 'answers' && (
        <div className="space-y-4">
          {/* 基本情報 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🏢</span>
              <span>基本情報</span>
            </h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-600 mb-1">業種</dt>
                <dd className="font-medium text-gray-800">{answers.industry || '未回答'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600 mb-1">従業員規模</dt>
                <dd className="font-medium text-gray-800">{answers.employeeSize || '未回答'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600 mb-1">担当者名</dt>
                <dd className="font-medium text-gray-800">{answers.contactName || '未回答'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600 mb-1">メールアドレス</dt>
                <dd className="font-medium text-gray-800">{answers.email || '未回答'}</dd>
              </div>
            </dl>
          </div>

          {/* PC・端末 */}
          {answers.pcVendor && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>💻</span>
                <span>PC・端末</span>
              </h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-gray-600 mb-1">購入先</dt>
                  <dd className="font-medium text-gray-800">
                    {answers.pcVendor === 'suiteq' && 'スイテック'}
                    {answers.pcVendor === 'other' && `他社（${answers.pcVendorOther || '記載なし'}）`}
                    {answers.pcVendor === 'maker' && 'メーカー直販'}
                    {answers.pcVendor === 'retail' && '量販店'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600 mb-1">台数</dt>
                  <dd className="font-medium text-gray-800">{answers.pcCount || '未回答'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600 mb-1">契約形態</dt>
                  <dd className="font-medium text-gray-800">{answers.pcContract || '未回答'}</dd>
                </div>
              </dl>
            </div>
          )}

          {/* サーバー・クラウド */}
          {answers.serverVendor && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🖥️</span>
                <span>サーバー・クラウド</span>
              </h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-gray-600 mb-1">環境</dt>
                  <dd className="font-medium text-gray-800">
                    {Array.isArray(answers.serverEnv) ? answers.serverEnv.join(', ') : '未回答'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600 mb-1">購入先</dt>
                  <dd className="font-medium text-gray-800">
                    {answers.serverVendor === 'suiteq' && 'スイテック'}
                    {answers.serverVendor === 'other' && `他社（${answers.serverVendorOther || '記載なし'}）`}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {/* 基幹システム */}
          {answers.coreSystemStatus && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📊</span>
                <span>基幹システム</span>
              </h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-gray-600 mb-1">導入状況</dt>
                  <dd className="font-medium text-gray-800">{answers.coreSystemStatus}</dd>
                </div>
                {answers.coreSystemName && (
                  <div>
                    <dt className="text-sm text-gray-600 mb-1">システム名</dt>
                    <dd className="font-medium text-gray-800">{answers.coreSystemName}</dd>
                  </div>
                )}
                {answers.coreSystemVendor && (
                  <div>
                    <dt className="text-sm text-gray-600 mb-1">購入先</dt>
                    <dd className="font-medium text-gray-800">
                      {answers.coreSystemVendor === 'suiteq' && 'スイテック'}
                      {answers.coreSystemVendor === 'other' && `他社（${answers.coreSystemVendorOther || '記載なし'}）`}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* IT課題 */}
          {answers.issues && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>⚠️</span>
                <span>現在のIT課題</span>
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{answers.issues}</p>
            </div>
          )}

          {/* 期待すること */}
          {answers.expectations && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>✨</span>
                <span>スイテックに期待すること</span>
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{answers.expectations}</p>
            </div>
          )}
        </div>
      )}

      {currentTab === 'whitespace' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">🗺️ ホワイトスペースマップ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {whitespace.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="font-bold text-gray-800">{item.category}</h3>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                {item.competitorName && (
                  <div className="text-sm text-gray-600 mb-2">
                    現在: {item.competitorName}
                  </div>
                )}

                <p className="text-sm text-gray-700 mb-3">{item.proposalMessage}</p>

                {getUrgencyBadge(item.urgency)}
              </div>
            ))}
          </div>
        </div>
      )}

      {currentTab === 'proposals' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">💡 ご提案内容</h2>
          <div className="space-y-4">
            {whitespace
              .filter(w => w.status !== 'suiteq')
              .sort((a, b) => {
                const urgencyOrder = { high: 0, medium: 1, low: 2, none: 3 };
                return (urgencyOrder[a.urgency || 'none'] || 3) - (urgencyOrder[b.urgency || 'none'] || 3);
              })
              .map((item, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-600 bg-blue-50 rounded-r-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{item.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-2">{item.category}</h3>
                      <p className="text-gray-700 mb-3">{item.proposalMessage}</p>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(item.status)}
                        {getUrgencyBadge(item.urgency)}
                      </div>
                      {item.competitorName && (
                        <div className="mt-2 text-sm text-gray-600">
                          現在の取引先: {item.competitorName}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            {whitespace.filter(w => w.status !== 'suiteq').length === 0 && (
              <div className="text-center py-8 text-gray-500">
                現在、ご提案可能な項目はありません
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
