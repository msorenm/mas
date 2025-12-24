
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';

const Settings: React.FC = () => {
  const { settings, updateSettings, addAnnouncement, currentUser } = useApp();
  const [formData, setFormData] = useState(settings);
  const [saveMessage, setSaveMessage] = useState(false);
  
  // Announcement form
  const [newAnn, setNewAnn] = useState({ title: '', content: '', targetRoles: [] as any[] });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveMessage(true);
    setTimeout(() => setSaveMessage(false), 3000);
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnn.title) return;
    addAnnouncement({
        title: newAnn.title,
        content: newAnn.content,
        targetRoles: newAnn.targetRoles.length > 0 ? newAnn.targetRoles : ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'OPERATOR', 'VIEWER'] as any
    });
    setNewAnn({ title: '', content: '', targetRoles: [] });
    alert('اعلان با موفقیت منتشر شد.');
  };

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn space-y-10" dir="rtl">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-3xl font-black text-slate-800">پیکربندی هویت سازمان</h2>
          <p className="text-slate-500 font-medium mt-1">نام سازمان، لوگو و تنظیمات فاکتور را مدیریت کنید.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          {saveMessage && (
            <div className="bg-emerald-50 text-emerald-700 p-5 rounded-2xl border border-emerald-100 flex items-center font-bold">
              <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              تغییرات با موفقیت ذخیره شد.
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest border-r-4 border-blue-600 pr-4">مشخصات عمومی</h3>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">نام فارسی سازمان</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">آدرس لوگوی سیستم (URL)</label>
                <div className="flex items-center space-x-6 space-x-reverse">
                  <div className="w-16 h-16 rounded-2xl border-2 border-slate-200 p-1 bg-white shrink-0 overflow-hidden shadow-sm">
                    <img src={formData.logoUrl} className="w-full h-full object-contain" alt="Preview" />
                  </div>
                  <input
                    type="text"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                    className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">اطلاعات تماس و آدرس</label>
                <textarea
                  rows={4}
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-medium leading-7"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-black text-amber-600 uppercase tracking-widest border-r-4 border-amber-600 pr-4">سفارشی‌سازی فاکتور</h3>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">رنگ اصلی برند در خروجی</label>
                <div className="flex items-center space-x-6 space-x-reverse">
                  <input
                    type="color"
                    value={formData.invoicePrimaryColor}
                    onChange={(e) => setFormData({...formData, invoicePrimaryColor: e.target.value})}
                    className="w-16 h-16 rounded-2xl border-0 p-0 cursor-pointer overflow-hidden shadow-md"
                  />
                  <input
                    type="text"
                    value={formData.invoicePrimaryColor}
                    readOnly
                    className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 font-mono text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">سرتیتر فاکتور</label>
                <input
                  type="text"
                  value={formData.headerText}
                  onChange={(e) => setFormData({...formData, headerText: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">پانویس و شرایط حقوقی</label>
                <textarea
                  rows={4}
                  value={formData.footerText}
                  onChange={(e) => setFormData({...formData, footerText: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-medium leading-7"
                />
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-12 py-4 bg-slate-900 text-white font-black text-lg rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95"
            >
              ذخیره تنظیمات سامانه
            </button>
          </div>
        </form>
      </div>

      {/* Announcements Manager */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-100 bg-blue-50/30">
          <h2 className="text-2xl font-black text-slate-800">مدیریت اعلان‌های عمومی</h2>
          <p className="text-slate-500 font-medium mt-1">اطلاعیه‌های مهم را برای نقش‌های مختلف ارسال کنید.</p>
        </div>
        <form onSubmit={handlePostAnnouncement} className="p-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">عنوان اعلان</label>
                    <input 
                        type="text" 
                        value={newAnn.title}
                        onChange={(e) => setNewAnn({...newAnn, title: e.target.value})}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">متن اعلان</label>
                    <input 
                        type="text" 
                        value={newAnn.content}
                        onChange={(e) => setNewAnn({...newAnn, content: e.target.value})}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                    />
                </div>
            </div>
            <button type="submit" className="px-8 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all">انتشار فوری اعلان</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
