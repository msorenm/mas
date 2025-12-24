
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { UserRole } from '../types';
import { getTodayJalali, toPersianDigits } from '../utils/jalali';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { currentUser, logout, settings } = useApp();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  if (!currentUser) return <>{children}</>;

  const menuItems = [
    { id: 'dashboard', label: 'پیشخوان', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR, UserRole.VIEWER] },
    { id: 'entry', label: 'ثبت مصالح ورودی', icon: 'M12 4v16m8-8H4', roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATOR] },
    { id: 'records', label: 'سوابق و جستجو', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR, UserRole.VIEWER] },
    { id: 'invoicing', label: 'صدور فاکتور پروژه', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER] },
    { id: 'users', label: 'مدیریت کاربران', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] },
    { id: 'settings', label: 'تنظیمات سامانه', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', roles: [UserRole.SUPER_ADMIN] },
  ];

  const roleLabels: Record<string, string> = {
    [UserRole.SUPER_ADMIN]: 'مدیر ارشد',
    [UserRole.ADMIN]: 'مدیر',
    [UserRole.MANAGER]: 'سرپرست',
    [UserRole.OPERATOR]: 'اپراتور',
    [UserRole.VIEWER]: 'مشاهده‌گر',
  };

  return (
    <div className="min-h-screen flex bg-slate-50 overflow-hidden" dir="rtl">
      {/* Sidebar */}
      <aside className={`no-print fixed inset-y-0 right-0 z-50 w-72 bg-slate-900 text-white transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 shrink-0 shadow-2xl`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-20 bg-slate-800 px-6 border-b border-slate-700">
            <div className="flex items-center">
              <img src={settings.logoUrl} alt="Logo" className="w-10 h-10 rounded-lg ml-3 shadow-md" />
              <span className="text-xl font-bold truncate leading-none">{settings.companyName}</span>
            </div>
          </div>
          
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {menuItems.filter(item => item.roles.includes(currentUser.role)).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full px-5 py-3.5 text-base font-medium rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <svg className="w-6 h-6 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                </svg>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-6 bg-slate-800/50 m-4 rounded-2xl border border-slate-700">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-xl shadow-inner ml-4">
                {currentUser.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-base font-bold truncate">{currentUser.name}</p>
                <p className="text-xs text-blue-400 font-medium">{roleLabels[currentUser.role]}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center px-4 py-2.5 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white text-sm font-bold rounded-xl transition-all border border-red-500/20"
            >
              خروج از سامانه
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="no-print h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0 sticky top-0 z-40">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 ml-3">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <h1 className="text-2xl font-black text-slate-800">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center space-x-6 space-x-reverse">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-xs font-bold text-slate-400 uppercase">تاریخ امروز</p>
              <p className="text-base font-black text-slate-800">{toPersianDigits(getTodayJalali())}</p>
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <div className="flex space-x-2 space-x-reverse">
                <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                </button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6 lg:p-10 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
