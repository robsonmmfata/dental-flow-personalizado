
interface Appointment {
  id: number;
  patientName: string;
  dentist: string;
  date: string;
  time: string;
  service: string;
  status: 'agendado' | 'confirmado' | 'concluido' | 'cancelado';
  notes?: string;
  createdAt: string;
}

class AppointmentStore {
  private appointments: Appointment[] = [
    {
      id: 1,
      patientName: 'João Silva',
      dentist: 'Dr. Silva',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      service: 'Consulta',
      status: 'agendado',
      notes: 'Primeira consulta',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      patientName: 'Maria Santos',
      dentist: 'Dr. Silva',
      date: new Date().toISOString().split('T')[0],
      time: '10:30',
      service: 'Limpeza',
      status: 'confirmado',
      notes: 'Limpeza de rotina',
      createdAt: new Date().toISOString()
    }
  ];

  addAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt'>): Appointment {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Math.max(...this.appointments.map(a => a.id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    
    this.appointments.push(newAppointment);
    return newAppointment;
  }

  getAllAppointments(): Appointment[] {
    return [...this.appointments];
  }

  getAppointmentsByDate(date: string): Appointment[] {
    return this.appointments.filter(appointment => appointment.date === date);
  }

  updateAppointment(id: number, updates: Partial<Appointment>): Appointment | null {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.appointments[index] = { ...this.appointments[index], ...updates };
      return this.appointments[index];
    }
    return null;
  }

  deleteAppointment(id: number): boolean {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.appointments.splice(index, 1);
      return true;
    }
    return false;
  }
}

export const appointmentStore = new AppointmentStore();
export type { Appointment };
