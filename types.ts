
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN', // مدیر ارشد
  ADMIN = 'ADMIN',             // مدیر
  MANAGER = 'MANAGER',         // سرپرست
  OPERATOR = 'OPERATOR',       // اپراتور
  VIEWER = 'VIEWER'           // مشاهده‌گر
}

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  password?: string;
}

export interface Material {
  id: string;
  name: string;
}

export interface Driver {
  id: string;
  name: string;
  defaultPlate: string;
}

export interface Supplier {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  targetRoles: UserRole[];
}

export interface MaterialEntry {
  id: string;
  materialId: string;
  driverId: string;
  plateNumber: string;
  supplierId: string;
  projectId: string;
  tonnage: number;
  quantity: number;
  unit: string;
  entryDate: string; // فرمت شمسی YYYY/MM/DD
  timestamp: number;
}

export interface SystemSettings {
  companyName: string;
  logoUrl: string;
  invoicePrimaryColor: string;
  headerText: string;
  footerText: string;
  contactInfo: string;
  currency: string;
}

export interface AppState {
  users: User[];
  materials: Material[];
  drivers: Driver[];
  suppliers: Supplier[];
  projects: Project[];
  entries: MaterialEntry[];
  announcements: Announcement[];
  settings: SystemSettings;
  currentUser: User | null;
}
