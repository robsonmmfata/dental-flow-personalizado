import { supabase } from '@/integrations/supabase/client';

export interface Appointment {
  id: number;
  patientName: string;
  patientId: number;
  doctorName: string;
  doctorId: number;
  dentist: string;
  date: string;
  time: string;
  service: string;
  status: 'agendado' | 'confirmado' | 'concluido' | 'cancelado';
  notes?: string;
  createdAt: string;
}

class AppointmentStore {
  async addAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .insert([{ ...appointmentData, createdat: new Date().toISOString() }])
      .select('*')
      .single();
    if (error) {
      throw error;
    }
    return data;
  }

  async getAllAppointments(): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*');
    if (error) {
      throw error;
    }
    return data || [];
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', date);
    if (error) {
      throw error;
    }
    return data || [];
  }

  async updateAppointment(id: number, updates: Partial<Appointment>): Promise<Appointment | null> {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
    if (error) {
      throw error;
    }
    return data;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    if (error) {
      throw error;
    }
    return true;
  }
}

export const appointmentStore = new AppointmentStore();
