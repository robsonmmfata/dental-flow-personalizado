
import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Plus, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCard } from '../Dashboard/StatsCard';
import { TransactionModal } from './TransactionModal';
import { FilterModal } from './FilterModal';

export const FinancialView: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  const transactions = [
    { id: 1, date: '2024-01-15', description: 'Consulta - Maria Silva', type: 'receita', value: 150, category: 'Consultas' },
    { id: 2, date: '2024-01-15', description: 'Tratamento Canal - João Santos', type: 'receita', value: 800, category: 'Tratamentos' },
    { id: 3, date: '2024-01-15', description: 'Material Odontológico', type: 'despesa', value: -320, category: 'Materiais' },
    { id: 4, date: '2024-01-14', description: 'Energia Elétrica', type: 'despesa', value: -180, category: 'Fixos' },
    { id: 5, date: '2024-01-13', description: 'Limpeza - Ana Costa', type: 'receita', value: 120, category: 'Consultas' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Controle Financeiro</h1>
          <p className="text-gray-600 mt-1">Gerencie receitas, despesas e relatórios</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedPeriod('day')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedPeriod === 'day' 
                  ? 'bg-dental-gold text-white' 
                  : 'text-gray-600 hover:text-dental-gold'
              }`}
            >
              Dia
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedPeriod === 'month' 
                  ? 'bg-dental-gold text-white' 
                  : 'text-gray-600 hover:text-dental-gold'
              }`}
            >
              Mês
            </button>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilterModal(true)}
            className="border-dental-gold text-dental-gold hover:bg-dental-gold hover:text-white"
          >
            <Filter size={16} className="mr-2" />
            Filtros
          </Button>
          <Button 
            onClick={() => setShowTransactionModal(true)}
            className="bg-dental-gold hover:bg-dental-gold-dark text-white"
          >
            <Plus size={16} className="mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      {selectedPeriod === 'day' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Receitas do Dia"
            value="R$ 1.200"
            icon={TrendingUp}
            trend={{ value: 12.5, isPositive: true }}
            color="sage"
          />
          <StatsCard
            title="Despesas do Dia"
            value="R$ 320"
            icon={TrendingDown}
            trend={{ value: 5.2, isPositive: false }}
            color="nude"
          />
          <StatsCard
            title="Lucro do Dia"
            value="R$ 880"
            icon={DollarSign}
            trend={{ value: 18.3, isPositive: true }}
            color="gold"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Receitas do Mês"
            value="R$ 18.500"
            icon={TrendingUp}
            trend={{ value: 15.3, isPositive: true }}
            color="sage"
          />
          <StatsCard
            title="Despesas do Mês"
            value="R$ 7.200"
            icon={TrendingDown}
            trend={{ value: 8.1, isPositive: false }}
            color="nude"
          />
          <StatsCard
            title="Lucro Líquido"
            value="R$ 11.300"
            icon={DollarSign}
            trend={{ value: 22.5, isPositive: true }}
            color="gold"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign size={18} />
                Transações Recentes
                <span className="text-sm text-gray-500 ml-2">
                  ({selectedPeriod === 'day' ? 'Hoje' : 'Este mês'})
                </span>
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-dental-cream/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        transaction.type === 'receita' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <div className="font-medium text-gray-900">{transaction.description}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleDateString('pt-BR')} • {transaction.category}
                        </div>
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'receita' ? '+' : ''}R$ {Math.abs(transaction.value).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Meta {selectedPeriod === 'day' ? 'Diária' : 'Mensal'}
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-dental-gold">
                  R$ {selectedPeriod === 'day' ? '650' : '20.000'}
                </div>
                <div className="text-sm text-gray-600">
                  Meta de receita {selectedPeriod === 'day' ? 'diária' : 'mensal'}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>{selectedPeriod === 'day' ? '184.6%' : '92.5%'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-dental-gold h-3 rounded-full" 
                    style={{ width: selectedPeriod === 'day' ? '100%' : '92.5%' }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {selectedPeriod === 'day' 
                    ? 'Meta diária superada!' 
                    : 'Faltam R$ 1.500 para atingir a meta'
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Categorias</h3>
            <div className="space-y-3">
              {[
                { name: 'Consultas', amount: selectedPeriod === 'day' ? 850 : 8500, color: 'bg-blue-500' },
                { name: 'Tratamentos', amount: selectedPeriod === 'day' ? 800 : 10000, color: 'bg-green-500' },
                { name: 'Materiais', amount: selectedPeriod === 'day' ? -200 : -3200, color: 'bg-red-500' },
                { name: 'Fixos', amount: selectedPeriod === 'day' ? -120 : -4000, color: 'bg-yellow-500' },
              ].map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </div>
                  <span className={`text-sm font-medium ${
                    category.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    R$ {Math.abs(category.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TransactionModal 
        isOpen={showTransactionModal} 
        onClose={() => setShowTransactionModal(false)} 
      />
      
      <FilterModal 
        isOpen={showFilterModal} 
        onClose={() => setShowFilterModal(false)} 
      />
    </div>
  );
};
