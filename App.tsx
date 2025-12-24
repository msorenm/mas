
import React, { useState } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MaterialEntryForm from './components/MaterialEntry';
import MaterialRecords from './components/MaterialRecords';
import InvoiceView from './components/InvoiceView';
import UserManagement from './components/UserManagement';
import Settings from './components/Settings';

const AuthScreen: React.FC = () => {
  const { users, setCurrentUser, isLoading, error } = useApp();
  const [username, setUsername] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (users.length === 0) {
        setLoginError('اتصال به سرور برقرار نشد. لطفاً مطمئن شوید فایل server.js در حال اجرا است.');
        return;
    }
    const user = users.find(u => u.username === username);
    if (user) {
      setCurrentUser(user);
    } else {
      setLoginError('نام کاربری نامعتبر است. (کاربر پیش‌فرض: admin)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-6" dir="rtl">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4 shadow-sm">سامانه جامع کـانستراکت</h1>
          <p className="text-blue-400 font-bold text-lg">مدیریت هوشمند ورود و خروج مصالح (نسخه Local Server)</p>
        </div>
        <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border-t-8 border-blue-600 relative">
          
          <h2 className="text-2xl font-black text-slate-800 mb-8 text-center">ورود به پنل مدیریتی</h2>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-slate-500">در حال دریافت اطلاعات از سرور...</p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-8">
                <div>
                <label className="block text-sm font-black text-slate-700 mb-3 pr-2 underline decoration-blue-500 decoration-2 underline-offset-8">نام کاربری</label>
                <input
                    type="text"
                    placeholder="نام کاربری..."
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-lg font-bold"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    dir="ltr"
                />
                </div>
                {(loginError || error) && (
                    <p className="text-sm text-red-600 font-black text-center bg-red-50 py-3 rounded-xl border border-red-100">
                        {loginError || error}
                    </p>
                )}
                <button
                type="submit"
                className="w-full py-5 bg-blue-600 text-white font-black text-xl rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all active:scale-95"
                >
                ورود امن به سامانه
                </button>
            </form>
          )}

          <div className="mt-12 text-center text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black leading-relaxed">
            SANG-BANA ARIYA ENTERPRISE SECURITY
          </div>
        </div>
      </div>
    </div>
  );
};

const MainApp: React.FC = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!currentUser) return <AuthScreen />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'entry': return <MaterialEntryForm />;
      case 'records': return <MaterialRecords />;
      case 'invoicing': return <InvoiceView />;
      case 'users': return <UserManagement />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;
