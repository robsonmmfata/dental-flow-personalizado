
interface Doctor {
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
  private doctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. Silva',
      cro: 'CRO-SP 12345',
      specialty: 'Clínico Geral',
      email: 'dr.silva@espacosorriso.com',
      phone: '(11) 99999-9999',
      status: 'ativo',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Dra. Santos',
      cro: 'CRO-SP 54321',
      specialty: 'Ortodontia',
      email: 'dra.santos@espacosorriso.com',
      phone: '(11) 88888-8888',
      status: 'ativo',
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Dr. Costa',
      cro: 'CRO-SP 67890',
      specialty: 'Endodontia',
      email: 'dr.costa@espacosorriso.com',
      phone: '(11) 77777-7777',
      status: 'ativo',
      createdAt: new Date().toISOString()
    }
  ];

  addDoctor(doctorData: Omit<Doctor, 'id' | 'createdAt'>): Doctor {
    const newDoctor: Doctor = {
      ...doctorData,
      id: Math.max(...this.doctors.map(d => d.id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    
    this.doctors.push(newDoctor);
    return newDoctor;
  }

  getAllDoctors(): Doctor[] {
    return [...this.doctors];
  }

  getActiveDoctors(): Doctor[] {
    return this.doctors.filter(doctor => doctor.status === 'ativo');
  }

  updateDoctor(id: number, updates: Partial<Doctor>): Doctor | null {
    const index = this.doctors.findIndex(d => d.id === id);
    if (index !== -1) {
      this.doctors[index] = { ...this.doctors[index], ...updates };
      return this.doctors[index];
    }
    return null;
  }

  deleteDoctor(id: number): boolean {
    const index = this.doctors.findIndex(d => d.id === id);
    if (index !== -1) {
      this.doctors.splice(index, 1);
      return true;
    }
    return false;
  }

  getDoctorById(id: number): Doctor | null {
    return this.doctors.find(d => d.id === id) || null;
  }
}

export const doctorStore = new DoctorStore();
export type { Doctor };
