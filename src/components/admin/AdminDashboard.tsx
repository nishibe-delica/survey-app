import { useState } from 'react';
import type { AuthUser } from '../../types/survey';
import AdminSummary from './AdminSummary';
import AdminCustomerList from './AdminCustomerList';
import AdminCustomerDetail from './AdminCustomerDetail';
import AdminWhitespaceView from './AdminWhitespaceView';

type AdminView = 'summary' | 'customerList' | 'customerDetail' | 'whitespaceView';

interface AdminDashboardProps {
  user: AuthUser;
  onBack: () => void;
  onSignOut: () => void;
}

export default function AdminDashboard({ user, onBack, onSignOut }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>('summary');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  function handleNavigate(view: string) {
    if (view === 'customerList') {
      setCurrentView('customerList');
    } else if (view === 'whitespaceView') {
      setCurrentView('whitespaceView');
    }
  }

  function handleSelectCustomer(customerId: string) {
    setSelectedCustomerId(customerId);
    setCurrentView('customerDetail');
  }

  function handleBackToList() {
    setCurrentView('customerList');
  }

  return (
    <div className="min-h-screen" style={{ background: '#F5F7FA' }}>
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 shadow-md" style={{ background: '#1E4D8C' }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* トップバー */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-white font-bold text-xl">スイテック 管理画面</h1>
              <p className="text-blue-200 text-sm">ITアンケート 回答状況</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-white text-sm font-medium">{user.name}</div>
                <div className="text-blue-200 text-xs">{user.email}</div>
              </div>
              <button
                onClick={onSignOut}
                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white text-sm font-medium transition-colors"
              >
                ログアウト
              </button>
            </div>
          </div>

          {/* タブナビゲーション（お客様詳細以外で表示） */}
          {currentView !== 'customerDetail' && (
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentView('summary')}
                className={`flex-1 sm:flex-none sm:px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${currentView === 'summary'
                    ? 'bg-white text-blue-600'
                    : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`}
              >
                <span className="hidden sm:inline">📊</span>
                <span>サマリー</span>
              </button>
              <button
                onClick={() => setCurrentView('customerList')}
                className={`flex-1 sm:flex-none sm:px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${currentView === 'customerList'
                    ? 'bg-white text-blue-600'
                    : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`}
              >
                <span className="hidden sm:inline">📋</span>
                <span>お客様一覧</span>
              </button>
              <button
                onClick={() => setCurrentView('whitespaceView')}
                className={`flex-1 sm:flex-none sm:px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${currentView === 'whitespaceView'
                    ? 'bg-white text-blue-600'
                    : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`}
              >
                <span className="hidden sm:inline">🗺️</span>
                <span>ホワイトスペース</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {currentView === 'summary' && (
          <AdminSummary onNavigate={handleNavigate} />
        )}

        {currentView === 'customerList' && (
          <AdminCustomerList onSelectCustomer={handleSelectCustomer} />
        )}

        {currentView === 'customerDetail' && selectedCustomerId && (
          <AdminCustomerDetail
            customerId={selectedCustomerId}
            onBack={handleBackToList}
          />
        )}

        {currentView === 'whitespaceView' && (
          <AdminWhitespaceView onSelectCustomer={handleSelectCustomer} />
        )}
      </main>

      {/* フッター */}
      <footer className="max-w-7xl mx-auto px-4 py-6 mt-12">
        <div className="text-center">
          <button
            onClick={onBack}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← ホームに戻る
          </button>
        </div>
      </footer>
    </div>
  );
}
