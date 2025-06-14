
import { supabase } from '@/integrations/supabase/client';

export interface Appointment {
  id: number;
  patientName: string;
  patientId: number;
  doctorName: string[];    // Fix: string[]
  doctorId: number;
  dentist: string;
  date: string;
  time: string;
  service: string;
  status: 'agendado' | 'confirmado' | 'concluido' | 'cancelado';
  notes?: string;
  createdAt: string;
}

function mapDbToAppointment(dbRow: any): Appointment {
  return {
    id: dbRow.id,
    patientName: dbRow.patientName,
    patientId: dbRow.patientId,
    doctorName: dbRow.doctorName, // always an array
    doctorId: dbRow.doctorId,
    dentist: dbRow.dentist,
    date: dbRow.date,
    time: dbRow.time,
    service: dbRow.service,
    status: dbRow.status,
    notes: dbRow.notes,
    createdAt: dbRow.createdat,
  }
}

class AppointmentStore {
  async addAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> {
    // Force doctorName to be array
    const { data, error } = await supabase
      .from('appointments')
      .insert([{ ...appointmentData, doctorName: Array.isArray(appointmentData.doctorName) ? appointmentData.doctorName : [appointmentData.doctorName], createdat: new Date().toISOString() }])
      .select('*')
      .single();
    if (error) {
      throw error;
    }
    return mapDbToAppointment(data);
  }

  async getAllAppointments(): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*');
    if (error) {
      throw error;
    }
    return (data || []).map(mapDbToAppointment);
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', date);
    if (error) {
      throw error;
    }
    return (data || []).map(mapDbToAppointment);
  }

  async updateAppointment(id: number, updates: Partial<Appointment>): Promise<Appointment | null> {
    const updateObj: any = { ...updates };
    if (updateObj.doctorName && !Array.isArray(updateObj.doctorName)) {
      updateObj.doctorName = [updateObj.doctorName];
    }
    const { data, error } = await supabase
      .from('appointments')
      .update(updateObj)
      .eq('id', id)
      .select('*')
      .single();
    if (error) {
      throw error;
    }
    return data ? mapDbToAppointment(data) : null;
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
