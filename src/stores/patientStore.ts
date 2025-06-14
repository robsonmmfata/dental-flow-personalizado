
import { supabase } from '../lib/supabaseClient';

export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  cpf: string;
  address: string;
  city: string;
  emergencyContact: string;
  emergencyPhone: string;
  allergies: string;
  medications: string;
  notes: string;
  preferredDoctor: string;
  status: 'ativo' | 'inativo';
  lastVisit: string;
  nextAppointment: string | null;
  createdAt: string;
}

function mapDbToPatient(dbRow: any): Patient {
  return {
    id: dbRow.id,
    name: dbRow.name,
    email: dbRow.email,
    phone: dbRow.phone,
    birthDate: dbRow.birthdate,
    cpf: dbRow.cpf,
    address: dbRow.address,
    city: dbRow.city,
    emergencyContact: dbRow.emergencycontact,
    emergencyPhone: dbRow.emergencyphone,
    allergies: dbRow.allergies,
    medications: dbRow.medications,
    notes: dbRow.notes,
    preferredDoctor: dbRow.preferreddoctor,
    status: dbRow.status,
    lastVisit: dbRow.lastvisit,
    nextAppointment: dbRow.nextappointment,
    createdAt: dbRow.createdat,
  };
}

class PatientStore {
  async getAllPatients(): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*');
    if (error) {
      throw error;
    }
    return (data || []).map(mapDbToPatient);
  }

  async getActivePatients(): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('status', 'ativo');
    if (error) {
      throw error;
    }
    return (data || []).map(mapDbToPatient);
  }

  async addPatient(patientData: Omit<Patient, 'id' | 'createdAt' | 'lastVisit' | 'nextAppointment'>): Promise<Patient> {
    const { data, error } = await supabase
      .from('patients')
      .insert([{
        name: patientData.name,
        email: patientData.email,
        phone: patientData.phone,
        birthdate: patientData.birthDate,
        cpf: patientData.cpf,
        address: patientData.address,
        city: patientData.city,
        emergencycontact: patientData.emergencyContact,
        emergencyphone: patientData.emergencyPhone,
        allergies: patientData.allergies,
        medications: patientData.medications,
        notes: patientData.notes,
        preferreddoctor: patientData.preferredDoctor,
        status: patientData.status,
        lastvisit: null,
        nextappointment: null,
        createdat: new Date().toISOString(),
      }])
      .select('id, name, email, phone, birthdate, cpf, address, city, emergencycontact, emergencyphone, allergies, medications, notes, preferreddoctor, status, lastvisit, nextappointment, createdat')
      .single();
    if (error) {
      throw error;
    }
    return mapDbToPatient(data);
  }

  async updatePatient(id: number, updates: Partial<Patient>): Promise<Patient | null> {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.birthDate !== undefined) dbUpdates.birthdate = updates.birthDate;
    if (updates.cpf !== undefined) dbUpdates.cpf = updates.cpf;
    if (updates.address !== undefined) dbUpdates.address = updates.address;
    if (updates.city !== undefined) dbUpdates.city = updates.city;
    if (updates.emergencyContact !== undefined) dbUpdates.emergencycontact = updates.emergencyContact;
    if (updates.emergencyPhone !== undefined) dbUpdates.emergencyphone = updates.emergencyPhone;
    if (updates.allergies !== undefined) dbUpdates.allergies = updates.allergies;
    if (updates.medications !== undefined) dbUpdates.medications = updates.medications;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.preferredDoctor !== undefined) dbUpdates.preferreddoctor = updates.preferredDoctor;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.lastVisit !== undefined) dbUpdates.lastvisit = updates.lastVisit;
    if (updates.nextAppointment !== undefined) dbUpdates.nextappointment = updates.nextAppointment;
    if (updates.createdAt !== undefined) dbUpdates.createdat = updates.createdAt;

    const { data, error } = await supabase
      .from('patients')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return data ? mapDbToPatient(data) : null;
  }

  async deletePatient(id: number): Promise<boolean> {
    const { error } = await supabase
      .from<Patient>('patients')
      .delete()
      .eq('id', id);
    if (error) {
      throw error;
    }
    return true;
  }

  async getPatientById(id: number): Promise<Patient | null> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      throw error;
    }
    return data ? mapDbToPatient(data) : null;
  }
}

export const patientStore = new PatientStore();
