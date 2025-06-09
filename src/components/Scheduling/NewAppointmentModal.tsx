
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { appointmentStore } from '@/stores/appointmentStore';
import { doctorStore, Doctor } from '@/stores/doctorStore';
import { patientStore, Patient } from '@/stores/patientStore';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  selectedPatient?: Patient | null;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedDate,
  selectedPatient 
}) => {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  
  const [formData, setFormData] = useState({
    patientName: selectedPatient?.name || '',
    patientId: selectedPatient?.id || 0,
    doctorId: 0,
    date: selectedDate.toISOString().split('T')[0],
    time: '',
    service: '',
    notes: ''
  });

  useEffect(() => {
    setDoctors(doctorStore.getActiveDoctors());
    setPatients(patientStore.getActivePatients());
    
    if (selectedPatient) {
      setFormData(prev => ({
        ...prev,
        patientName: selectedPatient.name,
        patientId: selectedPatient.id
      }));
    }
  }, [selectedPatient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.doctorId) {
      toast({
        title: "Erro",
        description: "Selecione um paciente e um doutor",
        variant: "destructive"
      });
      return;
    }

    const selectedDoctor = doctors.find(d => d.id === formData.doctorId);
    const selectedPatientData = patients.find(p => p.id === formData.patientId);
    
    const newAppointment = appointmentStore.addAppointment({
      patientName: selectedPatientData?.name || formData.patientName,
      patientId: formData.patientId,
      doctorName: selectedDoctor?.name || '',
      doctorId: formData.doctorId,
      dentist: selectedDoctor?.name || '',
      date: formData.date,
      time: formData.time,
      service: formData.service,
      notes: formData.notes,
      status: 'agendado'
    });

    console.log('Nova consulta agendada:', newAppointment);
    
    toast({
      title: "Consulta agendada!",
      description: `Consulta para ${formData.patientName} foi agendada com sucesso`,
    });
    
    onClose();
    setFormData({
      patientName: '', patientId: 0, doctorId: 0,
      date: selectedDate.toISOString().split('T')[0],
      time: '', service: '', notes: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar size={20} className="text-dental-gold" />
            Nova Consulta
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paciente *</label>
            <select
              value={formData.patientId}
              onChange={(e) => {
                const patientId = Number(e.target.value);
                const patient = patients.find(p => p.id === patientId);
                setFormData({
                  ...formData, 
                  patientId,
                  patientName: patient?.name || ''
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              required
            >
              <option value={0}>Selecione um paciente</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doutor *</label>
            <select
              value={formData.doctorId}
              onChange={(e) => setFormData({...formData, doctorId: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              required
            >
              <option value={0}>Selecione um doutor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horário *</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
            <input
              type="text"
              value={formData.service}
              onChange={(e) => setFormData({...formData, service: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              placeholder="Ex: Limpeza, Consulta, etc."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              rows={2}
              placeholder="Observações adicionais..."
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-dental-gold hover:bg-dental-gold-dark text-white">
              Agendar Consulta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
