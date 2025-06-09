
import React, { useState } from 'react';
import { X, Calendar, Clock, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { appointmentStore } from '@/stores/appointmentStore';
import { doctorStore } from '@/stores/doctorStore';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ 
  isOpen, 
  onClose,
  selectedDate 
}) => {
  const { toast } = useToast();
  const activeDoctors = doctorStore.getActiveDoctors();
  
  const [formData, setFormData] = useState({
    patientName: '',
    dentist: activeDoctors.length > 0 ? activeDoctors[0].name : '',
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    time: '09:00',
    service: 'Consulta',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do paciente é obrigatório",
        variant: "destructive"
      });
      return;
    }

    if (!formData.dentist) {
      toast({
        title: "Erro",
        description: "Selecione um dentista",
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

    toast({
      title: "Agendamento criado!",
      description: `Consulta agendada para ${formData.patientName}`,
    });

    console.log('Novo agendamento:', newAppointment);
    onClose();
    setFormData({
      patientName: '',
      dentist: activeDoctors.length > 0 ? activeDoctors[0].name : '',
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      time: '09:00',
      service: 'Consulta',
      notes: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar size={20} />
            Novo Agendamento
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User size={16} className="inline mr-1" />
              Paciente
            </label>
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
            {activeDoctors.length > 0 ? (
              <select
                value={formData.dentist}
                onChange={(e) => setFormData({...formData, dentist: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
                required
              >
                {activeDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.name}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </select>
            ) : (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500">
                Nenhum doutor ativo cadastrado. Cadastre doutores na seção "Doutores" primeiro.
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar size={16} className="inline mr-1" />
                Data
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock size={16} className="inline mr-1" />
                Horário
              </label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              >
                <option value="08:00">08:00</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
            <select
              value={formData.service}
              onChange={(e) => setFormData({...formData, service: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
            >
              <option value="Consulta">Consulta</option>
              <option value="Limpeza">Limpeza</option>
              <option value="Restauração">Restauração</option>
              <option value="Extração">Extração</option>
              <option value="Canal">Canal</option>
              <option value="Ortodontia">Ortodontia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FileText size={16} className="inline mr-1" />
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              rows={3}
              placeholder="Observações sobre o agendamento"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-dental-gold hover:bg-dental-gold-dark text-white"
              disabled={activeDoctors.length === 0}
            >
              Agendar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
