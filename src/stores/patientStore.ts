
interface Patient {
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

class PatientStore {
  private patients: Patient[] = [
    { 
      id: 1, 
      name: 'Maria Silva', 
      email: 'maria@email.com', 
      phone: '(11) 99999-9999',
      birthDate: '1985-03-15',
      cpf: '123.456.789-00',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      emergencyContact: 'João Silva',
      emergencyPhone: '(11) 88888-8888',
      allergies: 'Nenhuma',
      medications: 'Nenhum',
      notes: '',
      preferredDoctor: 'Dr. Silva',
      lastVisit: '2024-01-10',
      nextAppointment: '2024-01-20',
      status: 'ativo',
      createdAt: new Date().toISOString()
    },
    { 
      id: 2, 
      name: 'João Santos', 
      email: 'joao@email.com', 
      phone: '(11) 88888-8888',
      birthDate: '1990-07-22',
      cpf: '987.654.321-00',
      address: 'Av. Brasil, 456',
      city: 'São Paulo',
      emergencyContact: 'Ana Santos',
      emergencyPhone: '(11) 77777-7777',
      allergies: 'Penicilina',
      medications: 'Nenhum',
      notes: '',
      preferredDoctor: 'Dra. Santos',
      lastVisit: '2024-01-08',
      nextAppointment: null,
      status: 'ativo',
      createdAt: new Date().toISOString()
    },
    { 
      id: 3, 
      name: 'Ana Costa', 
      email: 'ana@email.com', 
      phone: '(11) 77777-7777',
      birthDate: '1988-12-10',
      cpf: '456.789.123-00',
      address: 'Rua da Paz, 789',
      city: 'São Paulo',
      emergencyContact: 'Carlos Costa',
      emergencyPhone: '(11) 66666-6666',
      allergies: 'Nenhuma',
      medications: 'Vitamina D',
      notes: 'Paciente com histórico de bruxismo',
      preferredDoctor: 'Dr. Costa',
      lastVisit: '2023-12-15',
      nextAppointment: '2024-01-25',
      status: 'inativo',
      createdAt: new Date().toISOString()
    },
  ];

  addPatient(patientData: Omit<Patient, 'id' | 'createdAt' | 'lastVisit' | 'nextAppointment'>): Patient {
    const newPatient: Patient = {
      ...patientData,
      id: Math.max(...this.patients.map(p => p.id), 0) + 1,
      createdAt: new Date().toISOString(),
      lastVisit: '',
      nextAppointment: null
    };
    
    this.patients.push(newPatient);
    return newPatient;
  }

  getAllPatients(): Patient[] {
    return [...this.patients];
  }

  getActivePatients(): Patient[] {
    return this.patients.filter(patient => patient.status === 'ativo');
  }

  updatePatient(id: number, updates: Partial<Patient>): Patient | null {
    const index = this.patients.findIndex(p => p.id === id);
    if (index !== -1) {
      this.patients[index] = { ...this.patients[index], ...updates };
      return this.patients[index];
    }
    return null;
  }

  deletePatient(id: number): boolean {
    const index = this.patients.findIndex(p => p.id === id);
    if (index !== -1) {
      this.patients.splice(index, 1);
      return true;
    }
    return false;
  }

  getPatientById(id: number): Patient | null {
    return this.patients.find(p => p.id === id) || null;
  }
}

export const patientStore = new PatientStore();
export type { Patient };
