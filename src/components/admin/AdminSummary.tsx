import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { calcWhitespace } from '../../utils/whitespace';

interface SalesRepStat {
  name: string;
  email: string;
  totalCount: number;
  rankA: number; // スコア8以上
  rankB: number; // スコア4-7
  rankC: number; // スコア0-3
}

interface AdminSummaryProps {
  onNavigate: (view: string) => void;
}

export default function AdminSummary({ onNavigate }: AdminSummaryProps) {
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [competitorCount, setCompetitorCount] = useState(0);
  const [noneCount, setNoneCount] = useState(0);
  const [salesStats, setSalesStats] = useState<SalesRepStat[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);

      // 全回答データを取得
      const { data: responses, error } = await supabase
        .from('survey_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!responses || responses.length === 0) {
        setLoading(false);
        return;
      }

      // 総回答件数
      setTotalCount(responses.length);

      // 月間の新規回答件数（直近30日間）
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const monthlyResponses = responses.filter(r =>
        new Date(r.created_at) >= thirtyDaysAgo
      );
      setWeeklyCount(monthlyResponses.length);

      // ホワイトスペース分析
      let competitorTotal = 0;
      let noneTotal = 0;
      const salesMap = new Map<string, SalesRepStat>();

      responses.forEach(response => {
        const answers = response.answers || {};
        const whitespace = calcWhitespace(answers);

        // ホワイトスペースステータス集計
        const competitorItems = whitespace.filter(w => w.status === 'competitor');
        const noneItems = whitespace.filter(w => w.status === 'none');
        competitorTotal += competitorItems.length;
        noneTotal += noneItems.length;

        // ホワイトスペーススコア計算（urgencyベース）
        const score = whitespace.reduce((sum, w) => {
          if (w.urgency === 'high') return sum + 3;
          if (w.urgency === 'medium') return sum + 2;
          if (w.urgency === 'low') return sum + 1;
          return sum;
        }, 0);

        // 担当営業別集計
        const salesEmail = response.sales_email;
        const salesName = response.sales_name;

        if (!salesMap.has(salesEmail)) {
          salesMap.set(salesEmail, {
            name: salesName,
            email: salesEmail,
            totalCount: 0,
            rankA: 0,
            rankB: 0,
            rankC: 0,
          });
        }

        const stat = salesMap.get(salesEmail)!;
        stat.totalCount++;

        // ランク分類
        if (score >= 8) stat.rankA++;
        else if (score >= 4) stat.rankB++;
        else stat.rankC++;
      });

      setCompetitorCount(competitorTotal);
      setNoneCount(noneTotal);

      // 担当営業別統計をソート（回答件数降順）
      const sortedStats = Array.from(salesMap.values())
        .sort((a, b) => b.totalCount - a.totalCount);
      setSalesStats(sortedStats);

    } catch (error) {
      console.error('データ取得エラー:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">まだ回答がありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIカード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 総回答件数 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📊</span>
            <span className="text-sm text-gray-600 font-medium">アンケート回答企業数</span>
          </div>
          <div className="text-4xl font-bold text-blue-600">{totalCount}</div>
          <div className="text-xs text-gray-500 mt-1">社</div>
        </div>

        {/* 月間の新規 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🆕</span>
            <span className="text-sm text-gray-600 font-medium">月間の新規・追加（変更）数</span>
          </div>
          <div className="text-4xl font-bold text-green-600">{weeklyCount}</div>
          <div className="text-xs text-gray-500 mt-1">社（過去30日間）</div>
        </div>

        {/* 他社導入数 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🔥</span>
            <span className="text-sm text-gray-600 font-medium">他社導入数</span>
          </div>
          <div className="text-4xl font-bold text-orange-600">{competitorCount}</div>
          <div className="text-xs text-gray-500 mt-1">項目（リプレイス可能）</div>
        </div>

        {/* 未導入件数 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">💡</span>
            <span className="text-sm text-gray-600 font-medium">未導入の製品数</span>
          </div>
          <div className="text-4xl font-bold text-purple-600">{noneCount}</div>
          <div className="text-xs text-gray-500 mt-1">項目（新規提案可能）</div>
        </div>
      </div>

      {/* 担当営業別テーブル */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">👥 担当営業別 分析</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">担当営業</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">回答件数</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Aランク</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Bランク</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Cランク</th>
              </tr>
            </thead>
            <tbody>
              {salesStats.map((stat) => (
                <tr key={stat.email} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-800">{stat.name}</div>
                    <div className="text-xs text-gray-500">{stat.email}</div>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className="font-bold text-blue-600">{stat.totalCount}</span>
                    <span className="text-xs text-gray-500 ml-1">件</span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 font-bold text-sm">
                      {stat.rankA}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 font-bold text-sm">
                      {stat.rankB}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold text-sm">
                      {stat.rankC}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          ※ランク分類: Aランク（スコア8以上）/ Bランク（スコア4-7）/ Cランク（スコア0-3）
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => onNavigate('customerList')}
          className="flex-1 py-4 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <span>📋</span>
          <span>お客様一覧を見る</span>
        </button>
        <button
          onClick={() => onNavigate('whitespaceView')}
          className="flex-1 py-4 px-6 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          <span>🗺️</span>
          <span>ホワイトスペースマップを見る</span>
        </button>
      </div>
    </div>
  );
}
