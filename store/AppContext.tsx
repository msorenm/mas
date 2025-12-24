
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, User, UserRole, SystemSettings, Material, Driver, Supplier, Project, MaterialEntry, Announcement } from '../types';
import { getTodayJalali } from '../utils/jalali';
import { db } from '../services/db';
import { isDbConfigured } from '../lib/supabase';

interface AppContextType extends AppState {
  isLoading: boolean;
  error: string | null;
  setCurrentUser: (user: User | null) => void;
  addEntry: (entry: Omit<MaterialEntry, 'id' | 'timestamp'>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  addMaterial: (name: string) => Promise<Material>;
  addDriver: (name: string, plate: string) => Promise<Driver>;
  addSupplier: (name: string) => Promise<Supplier>;
  addProject: (name: string) => Promise<Project>;
  updateSettings: (settings: SystemSettings) => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'date'>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  logout: () => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_SETTINGS: SystemSettings = {
  companyName: 'بارگذاری...',
  logoUrl: '',
  invoicePrimaryColor: '#1e40af',
  headerText: '',
  footerText: '',
  contactInfo: '',
  currency: 'تومان'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    users: [],
    materials: [],
    drivers: [],
    suppliers: [],
    projects: [],
    entries: [],
    announcements: [],
    settings: DEFAULT_SETTINGS,
    currentUser: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    if (!isDbConfigured()) return;
    
    setIsLoading(true);
    try {
      const [entries, metadata] = await Promise.all([
        db.getEntries(),
        db.getMetadata()
      ]);
      
      setState(prev => ({
        ...prev,
        entries,
        materials: metadata.materials,
        drivers: metadata.drivers,
        suppliers: metadata.suppliers,
        projects: metadata.projects,
        users: metadata.users,
        announcements: metadata.announcements,
        settings: metadata.settings || DEFAULT_SETTINGS
      }));
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError('خطا در دریافت اطلاعات از دیتابیس. لطفاً اتصال اینترنت را بررسی کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isDbConfigured()) {
      refreshData();
    }
  }, []);

  // --- Actions ---

  const setCurrentUser = (user: User | null) => setState(prev => ({ ...prev, currentUser: user }));

  const addEntry = async (entry: Omit<MaterialEntry, 'id' | 'timestamp'>) => {
    await db.addEntry(entry);
    await refreshData();
  };

  const deleteEntry = async (id: string) => {
    await db.deleteEntry(id);
    await refreshData();
  };

  const addMaterial = async (name: string): Promise<Material> => {
    const existing = state.materials.find(m => m.name === name);
    if (existing) return existing;
    const newMat = await db.addMaterial(name);
    if (newMat) await refreshData();
    return newMat || { id: 'temp', name };
  };

  const addDriver = async (name: string, plate: string): Promise<Driver> => {
    const existing = state.drivers.find(d => d.name === name);
    if (existing) return existing;
    const newDriver = await db.addDriver(name, plate);
    if (newDriver) await refreshData();
    return newDriver || { id: 'temp', name, defaultPlate: plate };
  };

  const addSupplier = async (name: string): Promise<Supplier> => {
    const existing = state.suppliers.find(s => s.name === name);
    if (existing) return existing;
    const newSup = await db.addSupplier(name);
    if (newSup) await refreshData();
    return newSup || { id: 'temp', name };
  };

  const addProject = async (name: string): Promise<Project> => {
    const existing = state.projects.find(p => p.name === name);
    if (existing) return existing;
    const newProj = await db.addProject(name);
    if (newProj) await refreshData();
    return newProj || { id: 'temp', name };
  };

  const updateSettings = async (settings: SystemSettings) => {
    await db.updateSettings(settings);
    await refreshData();
  };

  const addUser = async (user: Omit<User, 'id'>) => {
    await db.addUser(user);
    await refreshData();
  };

  const deleteUser = async (id: string) => {
    await db.deleteUser(id);
    await refreshData();
  };

  const addAnnouncement = async (ann: Omit<Announcement, 'id' | 'date'>) => {
    await db.addAnnouncement({ ...ann, date: getTodayJalali() });
    await refreshData();
  };

  const deleteAnnouncement = async (id: string) => {
    // Implement delete logic in db.ts if needed, for now just UI update or ignore
    // await db.deleteAnnouncement(id); 
    console.warn('Delete announcement not implemented in DB service yet');
  };

  const logout = () => setCurrentUser(null);

  return (
    <AppContext.Provider value={{
      ...state,
      isLoading,
      error,
      setCurrentUser,
      addEntry,
      deleteEntry,
      addMaterial,
      addDriver,
      addSupplier,
      addProject,
      updateSettings,
      addUser,
      deleteUser,
      addAnnouncement,
      deleteAnnouncement,
      logout,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
