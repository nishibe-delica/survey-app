import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { calcWhitespace } from '../../utils/whitespace';

interface CustomerListItem {
  id: string;
  companyName: string;
  industry: string;
  employeeSize: string;
  salesName: string;
  salesEmail: string;
  createdAt: string;
  whitespaceCount: number;
  whitespaceScore: number;
  answers: any;
}

interface AdminCustomerListProps {
  onSelectCustomer: (customerId: string) => void;
}

export default function AdminCustomerList({ onSelectCustomer }: AdminCustomerListProps) {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerListItem[]>([]);

  // 検索・フィルター状態
  const [searchCompany, setSearchCompany] = useState('');
  const [filterSales, setFilterSales] = useState('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // 担当営業リスト（重複なし）
  const [salesList, setSalesList] = useState<string[]>([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [customers, searchCompany, filterSales, sortOrder]);

  async function fetchCustomers() {
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

      // データを整形
      const customerList: CustomerListItem[] = responses.map(response => {
        const answers = response.answers || {};
        const whitespace = calcWhitespace(answers);

        // ホワイトスペース数（スイテック以外）
        const wsCount = whitespace.filter(w => w.status !== 'suiteq').length;

        // ホワイトスペーススコア計算
        const wsScore = whitespace.reduce((sum, w) => {
          if (w.urgency === 'high') return sum + 3;
          if (w.urgency === 'medium') return sum + 2;
          if (w.urgency === 'low') return sum + 1;
          return sum;
        }, 0);

        return {
          id: response.id,
          companyName: response.company_name || '（会社名未記入）',
          industry: response.industry || answers.industry || '未回答',
          employeeSize: response.company_size || answers.employeeSize || '未回答',
          salesName: response.sales_name,
          salesEmail: response.sales_email,
          createdAt: response.created_at,
          whitespaceCount: wsCount,
          whitespaceScore: wsScore,
          answers: answers,
        };
      });

      setCustomers(customerList);

      // 担当営業リストを抽出（重複なし）
      const uniqueSales = Array.from(
        new Set(customerList.map(c => c.salesName))
      ).sort();
      setSalesList(uniqueSales);

    } catch (error) {
      console.error('データ取得エラー:', error);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...customers];

    // 会社名検索
    if (searchCompany.trim()) {
      const query = searchCompany.toLowerCase();
      filtered = filtered.filter(c =>
        c.companyName.toLowerCase().includes(query)
      );
    }

    // 担当営業フィルター
    if (filterSales !== 'all') {
      filtered = filtered.filter(c => c.salesName === filterSales);
    }

    // ソート
    filtered.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? bTime - aTime : aTime - bTime;
    });

    setFilteredCustomers(filtered);
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
      {/* 検索・フィルターエリア */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">🔍 検索・絞り込み</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 会社名検索 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              会社名で検索
            </label>
            <input
              type="text"
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
              placeholder="会社名を入力"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 担当営業フィルター */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              担当営業で絞り込み
            </label>
            <select
              value={filterSales}
              onChange={(e) => setFilterSales(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">すべて</option>
              {salesList.map(sales => (
                <option key={sales} value={sales}>{sales}</option>
              ))}
            </select>
          </div>

          {/* 回答日時ソート */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              回答日時で並び替え
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="desc">新しい順</option>
              <option value="asc">古い順</option>
            </select>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          検索結果: <span className="font-bold text-blue-600">{filteredCustomers.length}</span>件
          {customers.length !== filteredCustomers.length && (
            <span className="text-gray-500"> / 全{customers.length}件</span>
          )}
        </div>
      </div>

      {/* お客様一覧（PC表示：テーブル） */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">会社名</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">業種</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">従業員規模</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">担当営業</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">回答日時</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">WS数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  onClick={() => onSelectCustomer(customer.id)}
                  className="hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-800">{customer.companyName}</div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{customer.industry}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{customer.employeeSize}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{customer.salesName}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{formatDate(customer.createdAt)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-medium text-sm">
                      {customer.whitespaceCount}件
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* お客様一覧（スマホ表示：カード） */}
      <div className="md:hidden space-y-3">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            onClick={() => onSelectCustomer(customer.id)}
            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="font-bold text-gray-800 text-lg mb-1">{customer.companyName}</div>
                <div className="text-sm text-gray-600">
                  {customer.industry} / {customer.employeeSize}
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-medium text-sm whitespace-nowrap ml-2">
                {customer.whitespaceCount}件
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              担当: {customer.salesName} | {formatDate(customer.createdAt)}
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>検索条件に一致するお客様が見つかりませんでした</p>
        </div>
      )}
    </div>
  );
}
