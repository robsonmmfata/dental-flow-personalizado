
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, DollarSign, Users, FileImage, TrendingDown } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { appointmentStore } from '@/stores/appointmentStore';
import { financialStore } from '@/stores/financialStore';
import { patientStore } from '@/stores/patientStore';

export const DashboardView: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];

  // Consultas de hoje
  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments', today],
    queryFn: () => appointmentStore.getAppointmentsByDate(today),
  });

  // Transações do dia
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', today],
    queryFn: () => financialStore.getTransactionsByDate(today),
  });

  // Pacientes ativos
  const { data: patients = [] } = useQuery({
    queryKey: ['patients', 'all'],
    queryFn: () => patientStore.getAllPatients(),
  });

  // Receitas e despesas do dia
  const dailyRevenue = transactions
    .filter(t => t.type === 'receita' && t.status === 'confirmado')
    .reduce((sum, t) => sum + t.value, 0);

  const dailyExpenses = transactions
    .filter(t => t.type === 'despesa' && t.status === 'confirmado')
    .reduce((sum, t) => sum + t.value, 0);

  const dailyProfit = dailyRevenue - dailyExpenses;

  // Tendências simples para o exemplo — podem ser adaptadas para mais informações reais
  const consultasTrend = { value: 0, isPositive: true };
  const receitaTrend = { value: 0, isPositive: true };
  const despesaTrend = { value: 0, isPositive: false };
  const pacientesTrend = { value: 0, isPositive: true };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral da clínica</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Hoje</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard
          title="Consultas Hoje"
          value={appointments.length}
          icon={Calendar}
          trend={consultasTrend}
          color="gold"
        />
        <StatsCard
          title="Receita do Dia"
          value={`R$ ${dailyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          trend={receitaTrend}
          color="sage"
        />
        <StatsCard
          title="Despesa do Dia"
          value={`R$ ${dailyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={TrendingDown}
          trend={despesaTrend}
          color="nude"
        />
        <StatsCard
          title="Pacientes Ativos"
          value={patients.filter(p => p.status === 'ativo').length}
          icon={Users}
          trend={pacientesTrend}
          color="sage"
        />
        <StatsCard
          title="Exames Pendentes"
          value={5} // Aqui você pode adicionar lógica real para exames se existir store
          icon={FileImage}
          color="gold"
        />
      </div>

      {/* Mantido o restante do layout exemplo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Consultas</h3>
          <div className="space-y-4">
            {appointments.slice(0, 4).map((appointment, index) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-dental-gold"></div>
                  <div>
                    <p className="font-medium text-gray-900">{appointment.time} - {appointment.patientName}</p>
                    <p className="text-sm text-gray-600">{appointment.service}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  appointment.status === 'confirmado' ? 'bg-green-100 text-green-800' :
                  appointment.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {appointment.status}
                </span>
              </div>
            ))}
            {appointments.length === 0 && (
              <div className="text-gray-500 text-center py-8">Nenhuma consulta marcada para hoje</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro Diário</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Receitas do Dia</span>
              <span className="font-semibold text-green-600">R$ {dailyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Despesas do Dia</span>
              <span className="font-semibold text-red-600">R$ {dailyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Lucro do Dia</span>
              <span className="font-bold text-dental-gold text-lg">R$ {dailyProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            {/* O restante do resumo mensal pode ser implementado buscando de transações por mês */}
          </div>
        </div>
      </div>
    </div>
  );
};
