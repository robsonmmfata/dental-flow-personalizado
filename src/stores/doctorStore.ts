
import { supabase } from '../lib/supabaseClient';

export interface Doctor {
  id: number;
  name: string;
  cro: string;
  specialty: string;
  email: string;
  phone: string;
  status: 'ativo' | 'inativo';
  createdAt: string;
}

class DoctorStore {
  async getAllDoctors(): Promise<Doctor[]> {
    const { data, error } = await supabase
      .from('doctors')
      .select('*');
    if (error) {
      throw error;
    }
    return (data || []).map(this.mapDbToDoctor);
  }

  async getActiveDoctors(): Promise<Doctor[]> {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('status', 'ativo');
    if (error) {
      throw error;
    }
    return (data || []).map(this.mapDbToDoctor);
  }

  async addDoctor(doctorData: Omit<Doctor, 'id' | 'createdAt'>): Promise<Doctor> {
    const { data, error } = await supabase
      .from('doctors')
      .insert([{ ...doctorData, createdat: new Date().toISOString() }])
      .select()
      .single();
    if (error) {
      throw error;
    }
    return this.mapDbToDoctor(data);
  }

  async updateDoctor(id: number, updates: Partial<Doctor>): Promise<Doctor | null> {
    const { data, error } = await supabase
      .from('doctors')
      .update(updates)
      .eq('id', id)
      .select('id, name, cro, specialty, email, phone, status, createdat')
      .single();
    if (error) {
      throw error;
    }
    return this.mapDbToDoctor(data);
  }

  async deleteDoctor(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('doctors')
      .delete()
      .eq('id', id);
    if (error) {
      throw error;
    }
    return true;
  }

  async getDoctorById(id: number): Promise<Doctor | null> {
    const { data, error } = await supabase
      .from('doctors')
      .select('id, name, cro, specialty, email, phone, status, createdat')
      .eq('id', id)
      .single();
    if (error) {
      throw error;
    }
    return this.mapDbToDoctor(data);
  }

  private mapDbToDoctor(dbRow: any): Doctor {
    return {
      id: dbRow.id,
      name: dbRow.name,
      cro: dbRow.cro,
      specialty: dbRow.specialty,
      email: dbRow.email,
      phone: dbRow.phone,
      status: dbRow.status,
      createdAt: dbRow.createdat,
    };
  }
}

export const doctorStore = new DoctorStore();
