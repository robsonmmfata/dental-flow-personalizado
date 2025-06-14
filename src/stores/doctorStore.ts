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
      .from<Doctor, Doctor>('doctors')
      .select('*');
    if (error) {
      throw error;
    }
    return data || [];
  }

  async getActiveDoctors(): Promise<Doctor[]> {
    const { data, error } = await supabase
      .from<Doctor, Doctor>('doctors')
      .select('*')
      .eq('status', 'ativo');
    if (error) {
      throw error;
    }
    return data || [];
  }

  async addDoctor(doctorData: Omit<Doctor, 'id' | 'createdAt'>): Promise<Doctor> {
    const { data, error } = await supabase
      .from<Doctor, Doctor>('doctors')
      .insert([{ ...doctorData, createdat: new Date().toISOString() }])
      .select()
      .single();
    if (error) {
      throw error;
    }
    return data;
  }

  async updateDoctor(id: number, updates: Partial<Doctor>): Promise<Doctor | null> {
    const { data, error } = await supabase
      .from<Doctor, Doctor>('doctors')
      .update(updates)
      .eq('id', id)
      .select('id, name, cro, specialty, email, phone, status, createdat')
      .single();
    if (error) {
      throw error;
    }
    return data;
  }

  async deleteDoctor(id: number): Promise<boolean> {
    const { error } = await supabase
      .from<Doctor, Doctor>('doctors')
      .delete()
      .eq('id', id);
    if (error) {
      throw error;
    }
    return true;
  }

  async getDoctorById(id: number): Promise<Doctor | null> {
    const { data, error } = await supabase
      .from<Doctor, Doctor>('doctors')
      .select('id, name, cro, specialty, email, phone, status, createdat')
      .eq('id', id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  }
}

export const doctorStore = new DoctorStore();
