
import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, User, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewAppointmentModal } from './NewAppointmentModal';
import { EditAppointmentModal } from './EditAppointmentModal';
import { useToast } from '@/hooks/use-toast';
import { appointmentStore, Appointment } from '@/stores/appointmentStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const SchedulingView: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const selectedDateString = selectedDate.toISOString().split('T')[0];

  // Buscar consultas para a data selecionada
  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ['appointments', selectedDateString],
    queryFn: () => appointmentStore.getAppointmentsByDate(selectedDateString),
  });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    console.log('Data selecionada:', date);
    toast({
      title: "Data selecionada",
      description: `Agenda para ${date.toLocaleDateString('pt-BR')}`,
    });
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowEditModal(true);
  };

  const handleConfirmAppointment = async (appointment: Appointment) => {
    try {
      await appointmentStore.updateAppointment(appointment.id, { status: 'confirmado' });
      console.log('Consulta confirmada:', appointment);
      toast({
        title: "Consulta confirmada!",
        description: `Consulta de ${appointment.patientName} às ${appointment.time} foi confirmada`,
      });
      
      // Atualizar dados em tempo real
      queryClient.invalidateQueries({ queryKey: ['appointments', selectedDateString] });
    } catch (error) {
      console.error('Erro ao confirmar consulta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível confirmar a consulta",
        variant: "destructive"
      });
    }
  };

  const handleNewAppointmentSuccess = () => {
    // Atualizar dados após criar nova consulta
    queryClient.invalidateQueries({ queryKey: ['appointments', selectedDateString] });
    setShowNewModal(false);
  };

  const handleEditAppointmentSuccess = () => {
    // Atualizar dados após editar consulta
    queryClient.invalidateQueries({ queryKey: ['appointments', selectedDateString] });
    setShowEditModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'text-green-600 bg-green-50';
      case 'agendado':
        return 'text-dental-gold bg-dental-cream';
      case 'concluido':
        return 'text-blue-600 bg-blue-50';
      case 'cancelado':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (error) {
    console.error('Erro ao carregar consultas:', error);
  }

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
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dental-gold mx-auto"></div>
                  <p className="text-gray-500 mt-4">Carregando consultas...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-dental-cream/30 transition-colors">
                      <div className="text-center min-w-[80px]">
                        <div className="font-semibold text-dental-gold-dark">{appointment.time}</div>
                        <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User size={16} className="text-gray-400" />
                          <span className="font-medium text-gray-900">{appointment.patientName}</span>
                        </div>
                        <div className="text-sm text-gray-600">{appointment.service}</div>
                        <div className="text-xs text-dental-gold font-medium">{appointment.doctorName}</div>
                        {appointment.notes && (
                          <div className="text-xs text-gray-500 mt-1">{appointment.notes}</div>
                        )}
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
                        {appointment.status === 'agendado' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleConfirmAppointment(appointment)}
                            className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                          >
                            <Check size={14} className="mr-1" />
                            Confirmar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {appointments.length === 0 && (
                    <div className="text-center py-12">
                      <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">Nenhuma consulta agendada para esta data</p>
                      <Button 
                        onClick={() => setShowNewModal(true)}
                        className="mt-4 bg-dental-gold hover:bg-dental-gold-dark text-white"
                      >
                        <Plus size={16} className="mr-2" />
                        Agendar Primeira Consulta
                      </Button>
                    </div>
                  )}
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
        onSuccess={handleNewAppointmentSuccess}
      />
      
      <EditAppointmentModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        appointment={selectedAppointment}
        onSuccess={handleEditAppointmentSuccess}
      />
    </div>
  );
};
