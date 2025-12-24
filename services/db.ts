
import { MaterialEntry, Material, Driver, Supplier, Project, User, Announcement, SystemSettings, UserRole } from '../types';

const API_URL = 'http://localhost:3001/api';

// --- Services ---

export const db = {
  // Entries
  async getEntries(): Promise<MaterialEntry[]> {
    const res = await fetch(`${API_URL}/entries`);
    if (!res.ok) throw new Error('Failed to fetch entries');
    const data = await res.json();
    
    return data.map((d: any) => ({
      id: d.id,
      materialId: d.material_id,
      driverId: d.driver_id,
      plateNumber: d.plate_number,
      supplierId: d.supplier_id,
      projectId: d.project_id,
      tonnage: parseFloat(d.tonnage),
      quantity: parseFloat(d.quantity),
      unit: d.unit,
      entryDate: d.entry_date,
      timestamp: new Date(d.created_at).getTime()
    }));
  },

  async addEntry(entry: Omit<MaterialEntry, 'id' | 'timestamp'>) {
    await fetch(`${API_URL}/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
  },

  async deleteEntry(id: string) {
    await fetch(`${API_URL}/entries/${id}`, { method: 'DELETE' });
  },

  // Metadata (Materials, Drivers, etc.)
  async getMetadata() {
    try {
        const res = await fetch(`${API_URL}/metadata`);
        if (!res.ok) throw new Error('Server not ready');
        const data = await res.json();

        return {
        materials: data.materials || [],
        drivers: data.drivers.map((d: any) => ({ ...d, defaultPlate: d.default_plate })) || [],
        suppliers: data.suppliers || [],
        projects: data.projects || [],
        users: data.users || [],
        announcements: data.announcements.map((a: any) => ({
            id: a.id,
            title: a.title,
            content: a.content,
            date: a.date,
            targetRoles: a.target_roles || []
        })) || [],
        settings: data.settings ? {
            companyName: data.settings.company_name,
            logoUrl: data.settings.logo_url,
            invoicePrimaryColor: data.settings.invoice_primary_color,
            headerText: data.settings.header_text,
            footerText: data.settings.footer_text,
            contactInfo: data.settings.contact_info,
            currency: 'تومان'
        } as SystemSettings : null
        };
    } catch (e) {
        console.error("Connection Error:", e);
        return { materials: [], drivers: [], suppliers: [], projects: [], users: [], announcements: [], settings: null };
    }
  },

  // Basic CRUD for metadata
  async addMaterial(name: string) {
    const res = await fetch(`${API_URL}/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    return await res.json();
  },

  async addDriver(name: string, defaultPlate: string) {
    const res = await fetch(`${API_URL}/drivers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, defaultPlate })
    });
    return await res.json();
  },

  async addSupplier(name: string) {
    const res = await fetch(`${API_URL}/suppliers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    return await res.json();
  },

  async addProject(name: string) {
    const res = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    return await res.json();
  },

  async addUser(user: Omit<User, 'id'>) {
    await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
  },

  async deleteUser(id: string) {
    await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
  },

  async addAnnouncement(ann: Omit<Announcement, 'id'>) {
    await fetch(`${API_URL}/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ann)
    });
  },

  async updateSettings(settings: SystemSettings) {
    await fetch(`${API_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
    });
  }
};
