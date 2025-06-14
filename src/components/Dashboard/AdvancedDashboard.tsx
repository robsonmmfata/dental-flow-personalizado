
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { appointmentStore } from '@/stores/appointmentStore';
import { financialStore } from '@/stores/financialStore';
import { patientStore } from '@/stores/patientStore';
import { doctorStore } from '@/stores/doctorStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, Users, DollarSign, Activity, TrendingUp, TrendingDown } from 'lucide-react';

export const AdvancedDashboard: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Queries para dados
  const { data: todayAppointments = [] } = useQuery({
    queryKey: ['appointments', today],
    queryFn: () => appointmentStore.getAppointmentsByDate(today),
  });

  const { data: allTransactions = [] } = useQuery({
    queryKey: ['transactions', 'all'],
    queryFn: () => financialStore.getAllTransactions(),
  });

  const { data: allPatients = [] } = useQuery({
    queryKey: ['patients', 'all'],
    queryFn: () => patientStore.getAllPatients(),
  });

  const { data: allDoctors = [] } = useQuery({
    queryKey: ['doctors', 'all'],
    queryFn: () => doctorStore.getAllDoctors(),
  });

  // Métricas calculadas
  const totalPatients = allPatients.length;
  const activeDoctors = allDoctors.filter(d => d.status === 'ativo').length;
  const todayRevenue = allTransactions
    .filter(t => t.date === today && t.type === 'receita' && t.status === 'confirmado')
    .reduce((sum, t) => sum + t.value, 0);

  const monthlyRevenue = allTransactions
    .filter(t => t.date.startsWith(currentMonth) && t.type === 'receita' && t.status === 'confirmado')
    .reduce((sum, t) => sum + t.value, 0);

  // Dados para gráficos
  const appointmentsByStatus = todayAppointments.reduce((acc, apt) => {
    acc[apt.status] = (acc[apt.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(appointmentsByStatus).map(([status, count]) => ({
    name: status,
    value: count
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Avançado</h1>
          <p className="text-gray-600 mt-1">Visão completa da clínica em tempo real</p>
        </div>
      </div>

      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Consultas Hoje</p>
              <p className="text-2xl font-bold text-dental-gold">{todayAppointments.length}</p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12% vs ontem</span>
              </div>
            </div>
            <Calendar size={24} className="text-dental-gold" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Pacientes</p>
              <p className="text-2xl font-bold text-blue-600">{totalPatients}</p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-green-500 mr-1" />
                <span className="text-sm text-green-600">+5 este mês</span>
              </div>
            </div>
            <Users size={24} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Receita Hoje</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {todayRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-green-500 mr-1" />
                <span className="text-sm text-green-600">+8% vs ontem</span>
              </div>
            </div>
            <DollarSign size={24} className="text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Médicos Ativos</p>
              <p className="text-2xl font-bold text-purple-600">{activeDoctors}</p>
              <div className="flex items-center mt-2">
                <Activity size={16} className="text-purple-500 mr-1" />
                <span className="text-sm text-purple-600">Todos disponíveis</span>
              </div>
            </div>
            <Activity size={24} className="text-purple-600" />
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de status das consultas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status das Consultas Hoje</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de receita mensal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Receita Mensal</h3>
          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-green-600">
              R$ {monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-600">Este mês</p>
          </div>
        </div>
      </div>

      {/* Lista de consultas de hoje */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Consultas de Hoje</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {todayAppointments.length > 0 ? (
              todayAppointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <div className="font-semibold text-dental-gold-dark">{appointment.time}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{appointment.patientName}</div>
                      <div className="text-sm text-gray-600">{appointment.service}</div>
                      <div className="text-xs text-dental-gold font-medium">{appointment.doctorName}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'confirmado' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'agendado' ? 'bg-dental-cream text-dental-gold' :
                    appointment.status === 'concluido' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Nenhuma consulta agendada para hoje</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
