
import React, { useState, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { toPersianDigits } from '../utils/jalali';

const MaterialRecords: React.FC = () => {
  const { entries, materials, projects, drivers, suppliers, deleteEntry } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    materialId: '',
    projectId: ''
  });

  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      const material = materials.find(m => m.id === e.materialId)?.name || '';
      const driver = drivers.find(d => d.id === e.driverId)?.name || '';
      const plate = e.plateNumber;
      const project = projects.find(p => p.id === e.projectId)?.name || '';
      const supplier = suppliers.find(s => s.id === e.supplierId)?.name || '';
      
      const matchesSearch = 
        material.includes(searchTerm) || 
        driver.includes(searchTerm) ||
        plate.includes(searchTerm) ||
        project.includes(searchTerm) ||
        supplier.includes(searchTerm);

      const matchesMaterial = !filters.materialId || e.materialId === filters.materialId;
      const matchesProject = !filters.projectId || e.projectId === filters.projectId;

      return matchesSearch && matchesMaterial && matchesProject;
    });
  }, [entries, searchTerm, filters, materials, drivers, projects, suppliers]);

  return (
    <div className="space-y-8 animate-fadeIn" dir="rtl">
      {/* Search & Filter */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap gap-6 items-end">
        <div className="flex-1 min-w-[300px]">
          <label className="block text-xs font-black text-slate-400 uppercase mb-3 pr-2">جستجو در سوابق</label>
          <div className="relative">
            <svg className="w-5 h-5 absolute right-4 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input
              type="text"
              placeholder="جستجوی متنی (مصالح، راننده، پلاک...)"
              className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase mb-3 pr-2">فیلتر مصالح</label>
          <select 
            className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold text-slate-700"
            value={filters.materialId}
            onChange={(e) => setFilters({...filters, materialId: e.target.value})}
          >
            <option value="">همه موارد</option>
            {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase mb-3 pr-2">فیلتر پروژه</label>
          <select 
            className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold text-slate-700"
            value={filters.projectId}
            onChange={(e) => setFilters({...filters, projectId: e.target.value})}
          >
            <option value="">همه پروژه‌ها</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <button 
          onClick={() => { setSearchTerm(''); setFilters({ materialId: '', projectId: '' }); }}
          className="px-8 py-3 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
        >
          حذف فیلترها
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 bg-slate-50/70">
                <th className="px-8 py-5">تاریخ</th>
                <th className="px-8 py-5">نوع مصالح</th>
                <th className="px-8 py-5">راننده و پلاک</th>
                <th className="px-8 py-5">تأمین‌کننده</th>
                <th className="px-8 py-5">پروژه مقصد</th>
                <th className="px-8 py-5 text-left">وزن خالص (تن)</th>
                <th className="px-8 py-5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntries.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5 text-sm font-black text-slate-600">{toPersianDigits(e.entryDate)}</td>
                  <td className="px-8 py-5">
                    <span className="text-base font-black text-slate-900">{materials.find(m => m.id === e.materialId)?.name}</span>
                    <p className="text-xs text-slate-400 mt-0.5">{toPersianDigits(e.quantity)} {e.unit}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-slate-700">{drivers.find(d => d.id === e.driverId)?.name}</p>
                    <span className="inline-block mt-1 text-[11px] bg-slate-100 text-slate-600 px-3 py-1 rounded-lg font-black border border-slate-200">{e.plateNumber}</span>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-600">{suppliers.find(s => s.id === e.supplierId)?.name}</td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-600">{projects.find(p => p.id === e.projectId)?.name}</td>
                  <td className="px-8 py-5 text-left text-lg font-black text-blue-700">{toPersianDigits(e.tonnage.toLocaleString())}</td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center space-x-3 space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      </button>
                      <button 
                        onClick={() => { if(window.confirm('آیا از حذف این رکورد اطمینان دارید؟')) deleteEntry(e.id); }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      </div>
                      <p className="text-slate-400 text-lg font-bold italic">هیچ موردی با این مشخصات یافت نشد.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 text-sm font-bold text-slate-500 flex justify-between">
          <span>تعداد کل رکوردها: {toPersianDigits(entries.length)}</span>
          <span>نمایش داده شده: {toPersianDigits(filteredEntries.length)}</span>
        </div>
      </div>
    </div>
  );
};

export default MaterialRecords;
