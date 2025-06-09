
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { appointmentStore } from '@/stores/appointmentStore';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientName: '',
    dentist: 'Dr. Silva',
    date: new Date().toISOString().split('T')[0],
    time: '',
    service: '',
    notes: ''
  });

  const services = [
    'Consulta',
    'Limpeza',
    'Restauração',
    'Canal',
    'Extração',
    'Implante',
    'Ortodontia',
    'Clareamento',
    'Prótese',
    'Cirurgia'
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientName || !formData.time || !formData.service) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newAppointment = appointmentStore.addAppointment({
      patientName: formData.patientName,
      dentist: formData.dentist,
      date: formData.date,
      time: formData.time,
      service: formData.service,
      status: 'agendado',
      notes: formData.notes
    });
    
    console.log('Novo agendamento criado:', newAppointment);
    
    toast({
      title: "Agendamento criado!",
      description: `Consulta de ${formData.patientName} agendada para ${new Date(formData.date).toLocaleDateString('pt-BR')} às ${formData.time}.`,
    });
    
    // Reset form
    setFormData({
      patientName: '',
      dentist: 'Dr. Silva',
      date: new Date().toISOString().split('T')[0],
      time: '',
      service: '',
      notes: ''
    });

    if (onSave) onSave();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus size={20} className="text-dental-gold" />
            Novo Agendamento
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Paciente *</label>
            <input
              type="text"
              value={formData.patientName}
              onChange={(e) => setFormData({...formData, patientName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              placeholder="Nome do paciente"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dentista</label>
            <select
              value={formData.dentist}
              onChange={(e) => setFormData({...formData, dentist: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
            >
              <option value="Dr. Silva">Dr. Silva</option>
              <option value="Dra. Costa">Dra. Costa</option>
              <option value="Dr. Santos">Dr. Santos</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
              <select
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
                required
              >
                <option value="">Selecione</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Serviço *</label>
            <select
              value={formData.service}
              onChange={(e) => setFormData({...formData, service: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              required
            >
              <option value="">Selecione o serviço</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              rows={3}
              placeholder="Observações sobre o agendamento..."
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-dental-gold hover:bg-dental-gold-dark text-white">
              Agendar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
