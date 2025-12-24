
import React, { useState, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { toPersianDigits, getTodayJalali, compareJalaliDates } from '../utils/jalali';

const InvoiceView: React.FC = () => {
  const { entries, materials, projects, suppliers, drivers, settings } = useApp();
  const [showPreview, setShowPreview] = useState(false);
  
  // States for advanced filtering
  const [filters, setFilters] = useState({
    projectId: '',
    driverId: '',
    materialId: '',
    supplierId: '',
    plateNumber: '',
    fromDate: '',
    toDate: ''
  });

  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      const matchProject = !filters.projectId || e.projectId === filters.projectId;
      const matchDriver = !filters.driverId || e.driverId === filters.driverId;
      const matchMaterial = !filters.materialId || e.materialId === filters.materialId;
      const matchSupplier = !filters.supplierId || e.supplierId === filters.supplierId;
      const matchPlate = !filters.plateNumber || e.plateNumber.includes(filters.plateNumber);
      
      let matchDate = true;
      if (filters.fromDate && compareJalaliDates(e.entryDate, filters.fromDate) < 0) matchDate = false;
      if (filters.toDate && compareJalaliDates(e.entryDate, filters.toDate) > 0) matchDate = false;

      return matchProject && matchDriver && matchMaterial && matchSupplier && matchPlate && matchDate;
    });
  }, [entries, filters]);

  const totalTonnage = filteredEntries.reduce((sum, e) => sum + e.tonnage, 0);

  const handlePrint = () => {
    window.print();
  };

  const resetFilters = () => {
    setFilters({
      projectId: '',
      driverId: '',
      materialId: '',
      supplierId: '',
      plateNumber: '',
      fromDate: '',
      toDate: ''
    });
  };

  if (showPreview) {
    return (
      <div className="animate-fadeIn" dir="rtl">
        <div className="no-print mb-10 flex items-center justify-between sticky top-0 bg-slate-50 z-50 py-4 border-b border-slate-200">
          <button 
            onClick={() => setShowPreview(false)}
            className="flex items-center text-slate-600 hover:text-blue-600 font-black transition-colors"
          >
            <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            بازگشت به فیلترها
          </button>
          <button 
            onClick={handlePrint}
            className="px-8 py-3 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 transition-all flex items-center"
          >
            <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            چاپ نهایی فاکتور
          </button>
        </div>

        {/* قالب چاپ A4 */}
        <div className="bg-white max-w-[210mm] mx-auto p-[15mm] shadow-2xl border border-slate-200 min-h-[297mm] flex flex-col print:shadow-none print:border-none print:p-0">
          <div className="flex justify-between items-start border-b-[6px] pb-8 mb-8" style={{ borderColor: settings.invoicePrimaryColor }}>
            <div className="flex items-center">
              <img src={settings.logoUrl} alt="Logo" className="h-20 w-auto ml-6 grayscale brightness-50" />
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{settings.companyName}</h1>
                <p className="text-slate-500 font-bold max-w-sm leading-6 text-sm">{settings.contactInfo}</p>
              </div>
            </div>
            <div className="text-left flex flex-col items-end">
              <h2 className="text-5xl font-black text-slate-100 uppercase tracking-widest mb-4">صورت‌وضعیت</h2>
              <div className="space-y-1 text-right">
                <p className="text-sm font-black text-slate-800">شماره: <span className="font-mono">RPT-{toPersianDigits(Date.now().toString().slice(-6))}</span></p>
                <p className="text-sm text-slate-500 font-bold">تاریخ گزارش: {toPersianDigits(getTodayJalali())}</p>
                {filters.fromDate && <p className="text-xs text-slate-500 mt-1">از تاریخ: {toPersianDigits(filters.fromDate)}</p>}
                {filters.toDate && <p className="text-xs text-slate-500">تا تاریخ: {toPersianDigits(filters.toDate)}</p>}
              </div>
            </div>
          </div>

          <div className="flex-1">
             {/* خلاصه فیلترها در چاپ */}
             {(filters.projectId || filters.driverId || filters.materialId) && (
                <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs flex flex-wrap gap-4 print:bg-transparent print:border-slate-200 print:p-2">
                    {filters.projectId && <div><span className="text-slate-400">پروژه:</span> <span className="font-bold">{projects.find(p => p.id === filters.projectId)?.name}</span></div>}
                    {filters.driverId && <div><span className="text-slate-400">راننده:</span> <span className="font-bold">{drivers.find(d => d.id === filters.driverId)?.name}</span></div>}
                    {filters.materialId && <div><span className="text-slate-400">مصالح:</span> <span className="font-bold">{materials.find(m => m.id === filters.materialId)?.name}</span></div>}
                </div>
             )}

            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] uppercase font-black print:bg-slate-800 print:text-white">
                  <th className="p-3 border border-slate-900 text-center w-12">ردیف</th>
                  <th className="p-3 border border-slate-900">تاریخ ورود</th>
                  <th className="p-3 border border-slate-900">نوع مصالح</th>
                  <th className="p-3 border border-slate-900">پروژه / تأمین‌کننده</th>
                  <th className="p-3 border border-slate-900">راننده و پلاک</th>
                  <th className="p-3 border border-slate-900 text-left">وزن (تن)</th>
                </tr>
              </thead>
              <tbody className="text-[11px]">
                {filteredEntries.map((e, idx) => (
                  <tr key={e.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50 print:bg-slate-100'}>
                    <td className="p-3 border border-slate-200 text-center font-bold">{toPersianDigits(idx + 1)}</td>
                    <td className="p-3 border border-slate-200">{toPersianDigits(e.entryDate)}</td>
                    <td className="p-3 border border-slate-200 font-black">{materials.find(m => m.id === e.materialId)?.name}</td>
                    <td className="p-3 border border-slate-200">
                      <div className="font-bold">{projects.find(p => p.id === e.projectId)?.name}</div>
                      <div className="text-[9px] text-slate-400 print:text-slate-600">{suppliers.find(s => s.id === e.supplierId)?.name}</div>
                    </td>
                    <td className="p-3 border border-slate-200">{drivers.find(d => d.id === e.driverId)?.name} <span dir="ltr" className="font-mono text-[10px]">({e.plateNumber})</span></td>
                    <td className="p-3 border border-slate-200 text-left font-black">{toPersianDigits(e.tonnage.toFixed(2))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 pt-6 border-t-4 border-slate-900 flex justify-between break-inside-avoid">
            <div className="w-1/2">
              <p className="text-xs font-black text-slate-800 uppercase mb-4 underline underline-offset-4">توضیحات</p>
              <p className="text-[10px] text-slate-500 leading-6 font-medium text-justify ml-8">{settings.footerText}</p>
              <div className="mt-12 flex space-x-12 space-x-reverse">
                <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 mb-8">مهر و امضای صادرکننده</p>
                    <div className="w-24 border-b-2 border-slate-200"></div>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 mb-8">تأییدیه دریافت‌کننده</p>
                    <div className="w-24 border-b-2 border-slate-200"></div>
                </div>
              </div>
            </div>
            <div className="w-2/5">
              <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-200 print:bg-white print:border-2">
                <div className="flex justify-between text-slate-600">
                  <span className="font-bold">تعداد کل موارد:</span>
                  <span className="font-black text-lg">{toPersianDigits(filteredEntries.length)}</span>
                </div>
                <div className="flex justify-between pt-5 border-t-2 border-slate-900 text-2xl font-black text-slate-900">
                  <span>جمع کل وزن:</span>
                  <span>{toPersianDigits(totalTonnage.toLocaleString())} تن</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn space-y-8" dir="rtl">
      {/* فیلترهای پیشرفته */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center ml-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">صدور صورت‌وضعیت و فاکتور</h2>
              <p className="text-slate-500 font-medium text-sm mt-1">فیلترهای زیر را برای یافتن سوابق مورد نظر تنظیم کنید.</p>
            </div>
          </div>
          <button onClick={resetFilters} className="text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition-all text-sm flex items-center">
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            پاکسازی فیلترها
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase mr-1">پروژه</label>
            <select
              value={filters.projectId}
              onChange={(e) => setFilters({...filters, projectId: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-sm text-slate-700"
            >
              <option value="">همه پروژه‌ها</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase mr-1">راننده</label>
            <select
              value={filters.driverId}
              onChange={(e) => setFilters({...filters, driverId: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-sm text-slate-700"
            >
              <option value="">همه رانندگان</option>
              {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase mr-1">نوع مصالح</label>
            <select
              value={filters.materialId}
              onChange={(e) => setFilters({...filters, materialId: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-sm text-slate-700"
            >
              <option value="">همه مصالح</option>
              {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase mr-1">شماره پلاک</label>
            <input
              type="text"
              placeholder="جستجوی پلاک..."
              value={filters.plateNumber}
              onChange={(e) => setFilters({...filters, plateNumber: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-sm text-slate-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase mr-1">از تاریخ (شمسی)</label>
            <input
              type="text"
              placeholder="۱۴۰۳/۰۱/۰۱"
              value={filters.fromDate}
              onChange={(e) => setFilters({...filters, fromDate: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-sm text-center ltr-placeholder"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase mr-1">تا تاریخ (شمسی)</label>
            <input
              type="text"
              placeholder="۱۴۰۳/۱۲/۲۹"
              value={filters.toDate}
              onChange={(e) => setFilters({...filters, toDate: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-sm text-center"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase mr-1">تأمین‌کننده</label>
            <select
              value={filters.supplierId}
              onChange={(e) => setFilters({...filters, supplierId: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-sm text-slate-700"
            >
              <option value="">همه تأمین‌کنندگان</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* لیست پیش‌نمایش حواله‌ها */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50/50 px-8 py-5 flex items-center justify-between border-b border-slate-100">
          <h3 className="text-lg font-black text-slate-800 flex items-center">
            <span className="w-2 h-2 bg-blue-600 rounded-full ml-3 animate-pulse"></span>
            لیست اقلام فاکتور
          </h3>
          <div className="flex space-x-6 space-x-reverse bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
            <div className="text-sm">تعداد: <span className="font-black text-slate-800">{toPersianDigits(filteredEntries.length)}</span></div>
            <div className="w-px h-5 bg-slate-200"></div>
            <div className="text-sm">وزن کل: <span className="font-black text-blue-600">{toPersianDigits(totalTonnage.toLocaleString())} تن</span></div>
          </div>
        </div>
        
        {filteredEntries.length > 0 ? (
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-right border-collapse relative">
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr className="text-xs font-black text-slate-400 border-b border-slate-100">
                <th className="px-8 py-4 bg-slate-50/80 backdrop-blur-sm">تاریخ</th>
                <th className="px-8 py-4 bg-slate-50/80 backdrop-blur-sm">مصالح</th>
                <th className="px-8 py-4 bg-slate-50/80 backdrop-blur-sm">راننده</th>
                <th className="px-8 py-4 bg-slate-50/80 backdrop-blur-sm">پروژه</th>
                <th className="px-8 py-4 bg-slate-50/80 backdrop-blur-sm text-left">وزن (تن)</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map(e => (
                <tr key={e.id} className="hover:bg-blue-50/30 transition-colors border-b border-slate-50 last:border-0">
                  <td className="px-8 py-4 text-xs font-bold text-slate-600">{toPersianDigits(e.entryDate)}</td>
                  <td className="px-8 py-4 text-sm font-black text-slate-800">{materials.find(m => m.id === e.materialId)?.name}</td>
                  <td className="px-8 py-4 text-sm font-medium text-slate-600">{drivers.find(d => d.id === e.driverId)?.name}</td>
                  <td className="px-8 py-4 text-sm font-medium text-slate-600">{projects.find(p => p.id === e.projectId)?.name}</td>
                  <td className="px-8 py-4 text-left text-blue-600 font-black text-base">{toPersianDigits(e.tonnage.toString())}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        ) : (
            <div className="py-24 text-center flex flex-col items-center justify-center text-slate-300">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <p className="font-black text-lg">هیچ رکوردی با فیلترهای انتخاب شده یافت نشد</p>
            </div>
        )}

        <div className="p-8 bg-slate-50 flex justify-center border-t border-slate-100">
          <button
            disabled={filteredEntries.length === 0}
            onClick={() => setShowPreview(true)}
            className="px-12 py-4 bg-slate-900 text-white font-black text-lg rounded-2xl shadow-xl hover:bg-black disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 flex items-center"
          >
            <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            تولید و چاپ فاکتور ({toPersianDigits(filteredEntries.length)} قلم)
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
