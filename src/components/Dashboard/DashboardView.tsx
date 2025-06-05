
import React from 'react';
import { Calendar, DollarSign, Users, FileImage, TrendingDown } from 'lucide-react';
import { StatsCard } from './StatsCard';

export const DashboardView: React.FC = () => {
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
          value={12}
          icon={Calendar}
          trend={{ value: 8.2, isPositive: true }}
          color="gold"
        />
        <StatsCard
          title="Receita do Dia"
          value="R$ 1.200"
          icon={DollarSign}
          trend={{ value: 15.3, isPositive: true }}
          color="sage"
        />
        <StatsCard
          title="Despesa do Dia"
          value="R$ 320"
          icon={TrendingDown}
          trend={{ value: 5.2, isPositive: false }}
          color="nude"
        />
        <StatsCard
          title="Pacientes Ativos"
          value={248}
          icon={Users}
          trend={{ value: 3.1, isPositive: true }}
          color="sage"
        />
        <StatsCard
          title="Exames Pendentes"
          value={5}
          icon={FileImage}
          color="gold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Consultas</h3>
          <div className="space-y-4">
            {[
              { time: '09:00', patient: 'Maria Silva', type: 'Limpeza', status: 'confirmado' },
              { time: '10:30', patient: 'João Santos', type: 'Tratamento Canal', status: 'pendente' },
              { time: '14:00', patient: 'Ana Costa', type: 'Ortodontia', status: 'confirmado' },
              { time: '15:30', patient: 'Pedro Lima', type: 'Consulta', status: 'novo' },
            ].map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-dental-gold"></div>
                  <div>
                    <p className="font-medium text-gray-900">{appointment.time} - {appointment.patient}</p>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
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
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro Diário</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Receitas do Dia</span>
              <span className="font-semibold text-green-600">R$ 1.200,00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Despesas do Dia</span>
              <span className="font-semibold text-red-600">R$ 320,00</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Lucro do Dia</span>
              <span className="font-bold text-dental-gold text-lg">R$ 880,00</span>
            </div>
            
            <div className="mt-4 p-4 bg-dental-cream rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Resumo Mensal</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Receita Mensal</span>
                  <span className="font-medium text-green-600">R$ 18.500</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Despesa Mensal</span>
                  <span className="font-medium text-red-600">R$ 7.200</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>Lucro Mensal</span>
                  <span className="text-dental-gold">R$ 11.300</span>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">Meta Mensal: R$ 20.000</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-dental-gold h-2 rounded-full" style={{ width: '92.5%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">92.5% da meta alcançada</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
