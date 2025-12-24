
import React, { useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toPersianDigits, getTodayJalali } from '../utils/jalali';

const Dashboard: React.FC = () => {
  const { entries, materials, projects, announcements, currentUser } = useApp();

  const stats = useMemo(() => {
    const totalTonnage = entries.reduce((sum, e) => sum + Number(e.tonnage), 0);
    const totalDeliveries = entries.length;
    const projectCount = projects.length;
    const materialTypes = materials.length;

    return [
      { label: 'کل تناژ ورودی', value: `${toPersianDigits(totalTonnage.toLocaleString())} تن`, color: 'bg-blue-600', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
      { label: 'تعداد حواله‌ها', value: toPersianDigits(totalDeliveries), color: 'bg-emerald-600', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 011 1v2a1 1 0 01-1 1h-1m-4-14h5a1 1 0 011 1v9a1 1 0 01-1 1h-1m-5 0h5' },
      { label: 'پروژه‌های فعال', value: toPersianDigits(projectCount), color: 'bg-amber-600', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
      { label: 'انواع مصالح', value: toPersianDigits(materialTypes), color: 'bg-purple-600', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    ];
  }, [entries, materials, projects]);

  const tonnageByMaterial = useMemo(() => {
    const data: any[] = [];
    materials.forEach(m => {
      const tonnage = entries.filter(e => e.materialId === m.id).reduce((sum, e) => sum + Number(e.tonnage), 0);
      if (tonnage > 0) data.push({ name: m.name, tonnage });
    });
    return data;
  }, [entries, materials]);

  const visibleAnnouncements = announcements.filter(a => a.targetRoles.includes(currentUser?.role as any));

  return (
    <div className="space-y-10 animate-fadeIn" dir="rtl">
      {/* هدر اطلاعات سریع */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">خوش آمدید، {currentUser?.name}</h2>
          <p className="text-slate-500 font-medium mt-1">
             امروز: <span className="font-bold text-slate-800">{toPersianDigits(getTodayJalali())}</span> - وضعیت سامانه: <span className="text-emerald-600 font-bold">پایدار</span>
          </p>
        </div>
      </div>

      {/* Announcements Section - Redesigned */}
      {visibleAnnouncements.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {visibleAnnouncements.map(a => (
            <div key={a.id} className="bg-white border-r-[6px] border-blue-500 p-6 rounded-3xl shadow-sm flex items-start group hover:shadow-md transition-all">
              <div className="bg-blue-50 p-3 rounded-2xl ml-5 text-blue-600 shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-black text-slate-800 text-lg">{a.title}</h4>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">{toPersianDigits(a.date)}</span>
                </div>
                <p className="text-sm text-slate-600 leading-7 font-medium text-justify">{a.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-6 space-x-reverse transition-all hover:shadow-lg hover:-translate-y-1">
            <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon}></path></svg>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-bold mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-800 mb-8 border-r-4 border-blue-600 pr-4">نمودار توزیع وزنی مصالح (تن)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tonnageByMaterial}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} orientation="right" />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', textAlign: 'right'}}
                />
                <Bar dataKey="tonnage" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-800 mb-8 border-r-4 border-emerald-600 pr-4">آخرین حواله‌های ثبت شده</h3>
          <div className="space-y-4">
            {entries.slice(0, 5).map((e) => (
              <div key={e.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center ml-4 text-blue-600 font-bold">
                    {materials.find(m => m.id === e.materialId)?.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-sm">{materials.find(m => m.id === e.materialId)?.name}</p>
                    <p className="text-[10px] text-slate-400">{toPersianDigits(e.entryDate)} | {e.plateNumber}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-base font-black text-blue-700">{toPersianDigits(e.tonnage.toString())} <span className="text-[10px] font-normal">تن</span></p>
                </div>
              </div>
            ))}
            {entries.length === 0 && (
                <div className="py-12 text-center text-slate-400 font-medium italic">هیچ موردی ثبت نشده است.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
