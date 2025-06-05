
import React, { useState } from 'react';
import { Calendar, Plus, Clock, User, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewAppointmentModal } from './NewAppointmentModal';
import { EditAppointmentModal } from './EditAppointmentModal';
import { useToast } from '@/hooks/use-toast';

export const SchedulingView: React.FC = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const appointments = [
    { id: 1, time: '09:00', duration: 60, patient: 'Maria Silva', type: 'Limpeza', doctor: 'Dr. João' },
    { id: 2, time: '10:30', duration: 90, patient: 'João Santos', type: 'Tratamento Canal', doctor: 'Dr. João' },
    { id: 3, time: '14:00', duration: 45, patient: 'Ana Costa', type: 'Ortodontia', doctor: 'Dra. Maria' },
    { id: 4, time: '15:30', duration: 30, patient: 'Pedro Lima', type: 'Consulta', doctor: 'Dr. João' },
  ];

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    console.log('Data selecionada:', date);
    toast({
      title: "Data selecionada",
      description: `Agenda para ${date.toLocaleDateString('pt-BR')}`,
    });
  };

  const handleEditAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowEditModal(true);
  };

  const handleConfirmAppointment = (appointment: any) => {
    console.log('Consulta confirmada:', appointment);
    toast({
      title: "Consulta confirmada!",
      description: `Consulta de ${appointment.patient} às ${appointment.time} foi confirmada`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agendamento</h1>
          <p className="text-gray-600 mt-1">Gerencie consultas e horários</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white rounded-lg border shadow-sm">
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 rounded-l-lg transition-colors ${
                viewMode === 'day' ? 'bg-dental-gold text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Dia
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-r-lg transition-colors ${
                viewMode === 'week' ? 'bg-dental-gold text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Semana
            </button>
          </div>
          <Button 
            onClick={() => setShowNewModal(true)}
            className="bg-dental-gold hover:bg-dental-gold-dark text-white"
          >
            <Plus size={16} className="mr-2" />
            Nova Consulta
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={18} />
              Calendário
            </h3>
            <div className="space-y-2">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const isToday = i === 0;
                const isSelected = date.toDateString() === selectedDate.toDateString();
                return (
                  <button
                    key={i}
                    onClick={() => handleDateClick(date)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-dental-gold text-white' 
                        : isToday 
                        ? 'bg-dental-gold/70 text-white' 
                        : 'hover:bg-dental-cream text-gray-700'
                    }`}
                  >
                    <div className="font-medium">
                      {date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()}
                    </div>
                    <div className="text-sm opacity-75">
                      {date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Clock size={18} />
                Consultas - {viewMode === 'day' ? 'Hoje' : 'Esta Semana'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {selectedDate.toLocaleDateString('pt-BR', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-dental-cream/30 transition-colors">
                    <div className="text-center min-w-[80px]">
                      <div className="font-semibold text-dental-gold-dark">{appointment.time}</div>
                      <div className="text-xs text-gray-500">{appointment.duration}min</div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-900">{appointment.patient}</span>
                      </div>
                      <div className="text-sm text-gray-600">{appointment.type}</div>
                      <div className="text-xs text-dental-gold font-medium">{appointment.doctor}</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditAppointment(appointment)}
                        className="text-dental-gold border-dental-gold hover:bg-dental-gold hover:text-white"
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleConfirmAppointment(appointment)}
                        className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                      >
                        <Check size={14} className="mr-1" />
                        Confirmar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {appointments.length === 0 && (
                <div className="text-center py-12">
                  <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Nenhuma consulta agendada para hoje</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <NewAppointmentModal 
        isOpen={showNewModal} 
        onClose={() => setShowNewModal(false)}
        selectedDate={selectedDate}
      />
      
      <EditAppointmentModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        appointment={selectedAppointment}
      />
    </div>
  );
};
