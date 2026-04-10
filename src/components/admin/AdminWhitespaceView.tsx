import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { calcWhitespace } from '../../utils/whitespace';
import type { WhitespaceItem } from '../../types/survey';

interface CustomerWhitespace {
  id: string;
  companyName: string;
  salesName: string;
  salesEmail: string;
  whitespace: WhitespaceItem[];
}

interface SalesGroup {
  salesName: string;
  salesEmail: string;
  customers: CustomerWhitespace[];
}

interface AdminWhitespaceViewProps {
  onSelectCustomer: (customerId: string) => void;
}

type ViewMode = 'customer' | 'sales';

export default function AdminWhitespaceView({ onSelectCustomer }: AdminWhitespaceViewProps) {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('customer');
  const [customers, setCustomers] = useState<CustomerWhitespace[]>([]);
  const [salesGroups, setSalesGroups] = useState<SalesGroup[]>([]);
  const [expandedSales, setExpandedSales] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);

      const { data: responses, error } = await supabase
        .from('survey_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!responses || responses.length === 0) {
        setLoading(false);
        return;
      }

      // お客様データを整形
      const customerList: CustomerWhitespace[] = responses.map(response => {
        const answers = response.answers || {};
        const whitespace = calcWhitespace(answers);

        return {
          id: response.id,
          companyName: response.company_name || '（会社名未記入）',
          salesName: response.sales_name,
          salesEmail: response.sales_email,
          whitespace: whitespace,
        };
      });

      setCustomers(customerList);

      // 担当営業別にグループ化
      const salesMap = new Map<string, SalesGroup>();

      customerList.forEach(customer => {
        const key = customer.salesEmail;

        if (!salesMap.has(key)) {
          salesMap.set(key, {
            salesName: customer.salesName,
            salesEmail: customer.salesEmail,
            customers: [],
          });
        }

        salesMap.get(key)!.customers.push(customer);
      });

      const groups = Array.from(salesMap.values())
        .sort((a, b) => b.customers.length - a.customers.length);

      setSalesGroups(groups);

      // デフォルトで全営業を展開
      setExpandedSales(new Set(groups.map(g => g.salesEmail)));

    } catch (error) {
      console.error('データ取得エラー:', error);
    } finally {
      setLoading(false);
    }
  }

  function toggleSalesExpand(salesEmail: string) {
    const newExpanded = new Set(expandedSales);
    if (newExpanded.has(salesEmail)) {
      newExpanded.delete(salesEmail);
    } else {
      newExpanded.add(salesEmail);
    }
    setExpandedSales(newExpanded);
  }

  function getStatusColor(status: string): string {
    const colors = {
      suiteq: 'bg-green-500',
      competitor: 'bg-orange-500',
      considering: 'bg-yellow-500',
      none: 'bg-gray-400',
      unknown: 'bg-gray-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-200';
  }

  function getStatusLabel(status: string): string {
    const labels = {
      suiteq: '✓',
      competitor: '競',
      considering: '検',
      none: '未',
      unknown: '-',
    };
    return labels[status as keyof typeof labels] || '-';
  }

  function renderCustomerCard(customer: CustomerWhitespace, showSalesName: boolean = false) {
    const displayCategories = customer.whitespace.slice(0, 5);
    const remainingCount = customer.whitespace.length - 5;

    return (
      <div
        key={customer.id}
        onClick={() => onSelectCustomer(customer.id)}
        className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 text-lg truncate">{customer.companyName}</h3>
            {showSalesName && (
              <p className="text-sm text-gray-600">担当: {customer.salesName}</p>
            )}
          </div>
        </div>

        {/* PC表示：全カテゴリ表示 */}
        <div className="hidden md:flex items-center gap-2 flex-wrap">
          {customer.whitespace.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50"
              title={`${item.category}: ${item.status}`}
            >
              <span className="text-sm">{item.icon}</span>
              <span
                className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`}
                title={item.category}
              />
              <span className="text-xs font-medium text-gray-700">
                {getStatusLabel(item.status)}
              </span>
            </div>
          ))}
        </div>

        {/* スマホ表示：5個まで表示 */}
        <div className="md:hidden flex items-center gap-2 flex-wrap">
          {displayCategories.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-50"
            >
              <span className="text-sm">{item.icon}</span>
              <span className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} />
            </div>
          ))}
          {remainingCount > 0 && (
            <div className="px-2 py-1 rounded-lg bg-gray-100 text-xs text-gray-600 font-medium">
              +{remainingCount}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">まだ回答がありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 切り替えボタン */}
      <div className="bg-white rounded-xl shadow-sm p-2 flex gap-2">
        <button
          onClick={() => setViewMode('customer')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${viewMode === 'customer'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          <span>👤</span>
          <span>お客様別</span>
        </button>
        <button
          onClick={() => setViewMode('sales')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${viewMode === 'sales'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          <span>👥</span>
          <span>担当営業別</span>
        </button>
      </div>

      {/* 凡例 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-bold text-gray-800 mb-3">ステータス凡例</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-700">スイテック取引中</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-gray-700">競合導入</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-gray-700">検討中</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-400" />
            <span className="text-gray-700">未導入</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-200" />
            <span className="text-gray-700">情報なし</span>
          </div>
        </div>
      </div>

      {/* お客様別ビュー */}
      {viewMode === 'customer' && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-1">お客様一覧</h2>
            <p className="text-sm text-gray-600">全 {customers.length} 社</p>
          </div>
          {customers.map(customer => renderCustomerCard(customer, true))}
        </div>
      )}

      {/* 担当営業別ビュー */}
      {viewMode === 'sales' && (
        <div className="space-y-4">
          {salesGroups.map(group => {
            const isExpanded = expandedSales.has(group.salesEmail);

            return (
              <div key={group.salesEmail} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* 営業名ヘッダー */}
                <button
                  onClick={() => toggleSalesExpand(group.salesEmail)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👤</span>
                    <div className="text-left">
                      <h3 className="font-bold text-gray-800 text-lg">{group.salesName}</h3>
                      <p className="text-sm text-gray-600">{group.salesEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm">
                      {group.customers.length}社
                    </span>
                    <span className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </button>

                {/* お客様一覧 */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    {group.customers.map(customer => renderCustomerCard(customer, false))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
