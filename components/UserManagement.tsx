
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { UserRole } from '../types';

const UserManagement: React.FC = () => {
  const { users, addUser, deleteUser, currentUser } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', username: '', role: UserRole.OPERATOR });

  const roleLabels: Record<string, string> = {
    [UserRole.SUPER_ADMIN]: 'مدیر ارشد',
    [UserRole.ADMIN]: 'مدیر سیستم',
    [UserRole.MANAGER]: 'سرپرست پروژه',
    [UserRole.OPERATOR]: 'اپراتور انبار',
    [UserRole.VIEWER]: 'مشاهده‌گر',
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.username) return;
    addUser(newUser);
    setNewUser({ name: '', username: '', role: UserRole.OPERATOR });
    setShowAdd(false);
  };

  return (
    <div className="space-y-10 animate-fadeIn" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">کنترل دسترسی کاربران</h2>
          <p className="text-slate-500 font-medium mt-1">پرسنل اداری و عملیاتی را مدیریت کنید.</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className={`px-8 py-3.5 font-black rounded-2xl shadow-xl transition-all active:scale-95 ${showAdd ? 'bg-slate-200 text-slate-600' : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'}`}
        >
          {showAdd ? 'بستن فرم' : 'تعریف کاربر جدید +'}
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-blue-100 max-w-3xl animate-slideDown">
          <h3 className="text-xl font-black text-slate-800 mb-8 border-r-4 border-blue-600 pr-4">ایجاد حساب کاربری جدید</h3>
          <form onSubmit={handleAddUser} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">نام و نام خانوادگی</label>
                <input
                  type="text"
                  placeholder="مثال: علی رضایی"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">نام کاربری (انگلیسی)</label>
                <input
                  type="text"
                  placeholder="e.g. arezaei"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  className="w-full px-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-mono text-left"
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">نقش و سطح دسترسی</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                className="w-full px-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-black text-slate-800"
              >
                {Object.entries(roleLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full py-4 bg-slate-900 text-white font-black text-lg rounded-2xl shadow-lg hover:bg-black transition-all">تأیید و ثبت کاربر</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map(user => (
          <div key={user.id} className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 flex items-start justify-between group transition-all hover:shadow-lg">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center font-black text-blue-600 text-2xl shadow-inner ml-5">
                {user.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-lg">{user.name}</h4>
                <p className="text-sm text-slate-400 font-mono mt-1" dir="ltr">@{user.username}</p>
                <span className={`mt-3 inline-block px-4 py-1.5 rounded-xl text-xs font-black shadow-sm ${
                  user.role === UserRole.SUPER_ADMIN ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                  user.role === UserRole.OPERATOR ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                  'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {roleLabels[user.role]}
                </span>
              </div>
            </div>
            {user.id !== currentUser?.id && (
              <button
                onClick={() => { if(window.confirm(`آیا از حذف دسترسی ${user.name} اطمینان دارید؟`)) deleteUser(user.id); }}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
