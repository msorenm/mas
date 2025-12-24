
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { getTodayJalali, toPersianDigits } from '../utils/jalali';

const MaterialEntryForm: React.FC = () => {
  const { materials, drivers, suppliers, projects, addEntry, addMaterial, addDriver, addSupplier, addProject } = useApp();
  
  const [formData, setFormData] = useState({
    materialId: '',
    driverId: '',
    plateNumber: '',
    supplierId: '',
    projectId: '',
    tonnage: '',
    quantity: '1',
    unit: 'کیلوگرم',
    entryDate: getTodayJalali()
  });

  const [newInputs, setNewInputs] = useState({
    material: '',
    driver: '',
    supplier: '',
    project: ''
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (formData.driverId) {
      const driver = drivers.find(d => d.id === formData.driverId);
      if (driver) {
        setFormData(prev => ({ ...prev, plateNumber: driver.defaultPlate }));
      }
    }
  }, [formData.driverId, drivers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let materialId = formData.materialId;
    let driverId = formData.driverId;
    let supplierId = formData.supplierId;
    let projectId = formData.projectId;

    try {
      if (formData.materialId === 'other' && newInputs.material) {
        const newMat = await addMaterial(newInputs.material);
        materialId = newMat.id;
      }
      if (formData.driverId === 'other' && newInputs.driver) {
        const newDriver = await addDriver(newInputs.driver, formData.plateNumber);
        driverId = newDriver.id;
      }
      if (formData.supplierId === 'other' && newInputs.supplier) {
        const newSupplier = await addSupplier(newInputs.supplier);
        supplierId = newSupplier.id;
      }
      if (formData.projectId === 'other' && newInputs.project) {
        const newProject = await addProject(newInputs.project);
        projectId = newProject.id;
      }

      if (!materialId || !driverId || !supplierId || !projectId || !formData.tonnage) {
        setMessage({ type: 'error', text: 'لطفاً تمامی فیلدهای ستاره‌دار را تکمیل نمایید.' });
        return;
      }

      await addEntry({
        materialId,
        driverId,
        supplierId,
        projectId,
        plateNumber: formData.plateNumber,
        tonnage: parseFloat(formData.tonnage),
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        entryDate: formData.entryDate
      });

      setMessage({ type: 'success', text: 'حواله با موفقیت در سامانه ثبت شد.' });
      setFormData({
        materialId: '',
        driverId: '',
        plateNumber: '',
        supplierId: '',
        projectId: '',
        tonnage: '',
        quantity: '1',
        unit: 'کیلوگرم',
        entryDate: getTodayJalali()
      });
      setNewInputs({ material: '', driver: '', supplier: '', project: '' });
      
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'خطا در ثبت اطلاعات.' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn" dir="rtl">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-10 py-8">
          <h2 className="text-2xl font-black text-white">ثبت حواله جدید مصالح</h2>
          <p className="text-blue-100 text-sm mt-2 font-medium">اطلاعات بارنامه و توزین را با دقت وارد کنید.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {message && (
            <div className={`p-5 rounded-2xl flex items-center font-bold animate-bounce ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={message.type === 'success' ? 'M5 13l4 4L19 7' : 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'}></path></svg>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Material */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 underline decoration-blue-200 underline-offset-4">نوع مصالح *</label>
              <select
                value={formData.materialId}
                onChange={(e) => setFormData({ ...formData, materialId: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
              >
                <option value="">انتخاب کنید</option>
                {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                <option value="other" className="text-blue-600 font-bold">+ تعریف مصالح جدید</option>
              </select>
              {formData.materialId === 'other' && (
                <input
                  type="text"
                  placeholder="نام مصالح جدید..."
                  value={newInputs.material}
                  onChange={(e) => setNewInputs({ ...newInputs, material: e.target.value })}
                  className="mt-3 w-full px-5 py-3 bg-blue-50 border border-blue-200 rounded-2xl outline-none focus:bg-white"
                />
              )}
            </div>

            {/* Project */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 underline decoration-emerald-200 underline-offset-4">پروژه مقصد *</label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
              >
                <option value="">انتخاب کنید</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                <option value="other" className="text-emerald-600 font-bold">+ تعریف پروژه جدید</option>
              </select>
              {formData.projectId === 'other' && (
                <input
                  type="text"
                  placeholder="نام پروژه جدید..."
                  value={newInputs.project}
                  onChange={(e) => setNewInputs({ ...newInputs, project: e.target.value })}
                  className="mt-3 w-full px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl outline-none focus:bg-white"
                />
              )}
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">تأمین‌کننده *</label>
              <select
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
              >
                <option value="">انتخاب کنید</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                <option value="other" className="text-slate-600 font-bold">+ تعریف تأمین‌کننده</option>
              </select>
              {formData.supplierId === 'other' && (
                <input
                  type="text"
                  placeholder="نام شرکت تأمین‌کننده..."
                  value={newInputs.supplier}
                  onChange={(e) => setNewInputs({ ...newInputs, supplier: e.target.value })}
                  className="mt-3 w-full px-5 py-3 bg-slate-100 border border-slate-300 rounded-2xl outline-none"
                />
              )}
            </div>

            {/* Driver */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 underline decoration-amber-200 underline-offset-4">راننده *</label>
              <select
                value={formData.driverId}
                onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
              >
                <option value="">انتخاب کنید</option>
                {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                <option value="other" className="text-amber-600 font-bold">+ افزودن راننده جدید</option>
              </select>
              {formData.driverId === 'other' && (
                <input
                  type="text"
                  placeholder="نام کامل راننده..."
                  value={newInputs.driver}
                  onChange={(e) => setNewInputs({ ...newInputs, driver: e.target.value })}
                  className="mt-3 w-full px-5 py-3 bg-amber-50 border border-amber-200 rounded-2xl outline-none focus:bg-white"
                />
              )}
            </div>

            {/* Plate */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">پلاک خودرو *</label>
              <input
                type="text"
                placeholder="مثال: ۲۴ب۸۵۶ - ایران ۹۹"
                value={formData.plateNumber}
                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">تاریخ ورود (شمسی) *</label>
              <input
                type="text"
                value={formData.entryDate}
                onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-black text-center"
              />
            </div>

            {/* Weight */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 text-center">وزن خالص (تن)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.tonnage}
                  onChange={(e) => setFormData({ ...formData, tonnage: e.target.value })}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-black text-blue-700 text-center"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 text-center">واحد</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-center"
                >
                  <option value="کیلوگرم">کیلوگرم</option>
                  <option value="تن">تن متریک</option>
                  <option value="شاخه">شاخه</option>
                  <option value="متر">متر</option>
                </select>
              </div>
            </div>

            {/* Qty */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">تعداد / مقدار</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-center font-bold"
              />
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-14 py-4 bg-blue-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.03] active:scale-95 transition-all"
            >
              ثبت نهایی و صدور حواله
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialEntryForm;
