import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Plus, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCard } from '../Dashboard/StatsCard';
import { TransactionModal } from './TransactionModal';
import { FilterModal } from './FilterModal';
import { financialStore, Transaction } from '@/stores/financialStore';

export const FinancialView: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('day');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [todayStats, setTodayStats] = useState<{
    revenue: number | null;
    expenses: number | null;
    profit: number | null;
  }>({
    revenue: null,
    expenses: null,
    profit: null
  });
  
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    async function updateData() {
      const allTransactions = await financialStore.getAllTransactions();
      setTransactions(allTransactions);
      
      const revenue = await financialStore.getRevenueByDate(today);
      const expenses = await financialStore.getExpensesByDate(today);
      const profit = await financialStore.getDailyProfit(today);
      
      setTodayStats({ revenue, expenses, profit });
      console.log('Financeiro atualizado:', { revenue, expenses, profit });
    }

    updateData();
    const unsubscribe = financialStore.subscribe(updateData);
    
    return unsubscribe;
  }, [today]);

  const handleTransactionAdded = () => {
    // Os dados serão atualizados automaticamente através do subscription
  };

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Receita do Dia"
          value={`R$ ${todayStats.revenue !== null ? todayStats.revenue.toFixed(2) : '0.00'}`}
          icon={TrendingUp}
          trend={{ value: 12.5, isPositive: true }}
          color="sage"
        />
        <StatsCard
          title="Despesa do Dia"
          value={`R$ ${todayStats.expenses !== null ? todayStats.expenses.toFixed(2) : '0.00'}`}
          icon={TrendingDown}
          trend={{ value: 5.2, isPositive: false }}
          color="nude"
        />
        <StatsCard
          title="Lucro Líquido Diário"
          value={`R$ ${todayStats.profit !== null ? todayStats.profit.toFixed(2) : '0.00'}`}
          icon={DollarSign}
          trend={{ value: 18.3, isPositive: todayStats.profit !== null && todayStats.profit > 0 }}
          color="gold"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign size={18} />
                Transações Recentes
                <span className="text-sm text-gray-500 ml-2">
                  (Atualizadas em tempo real)
                </span>
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {transactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-dental-cream/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        transaction.type === 'receita' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <div className="font-medium text-gray-900">{transaction.description}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleDateString('pt-BR')} • {transaction.category}
                          {transaction.status === 'pendente' && (
                            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                              Pendente
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'receita' ? '+' : '-'}R$ {transaction.value.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              {transactions.length === 0 && (
                <div className="text-center py-12">
                  <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Nenhuma transação encontrada</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Meta Diária</h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-dental-gold">R$ 650</div>
                <div className="text-sm text-gray-600">Meta de receita diária</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>{((todayStats.revenue / 650) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-dental-gold h-3 rounded-full" 
                    style={{ width: `${Math.min((todayStats.revenue / 650) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {todayStats.revenue >= 650 ? 'Meta diária atingida!' : 'Continue trabalhando para atingir a meta'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Resumo por Categoria</h3>
            <div className="space-y-3">
              {[
                { name: 'Consultas', amount: transactions.filter(t => t.category === 'Consultas' && t.type === 'receita').reduce((sum, t) => sum + t.value, 0), color: 'bg-blue-500' },
                { name: 'Orçamentos', amount: transactions.filter(t => t.category === 'Orçamentos' && t.type === 'receita').reduce((sum, t) => sum + t.value, 0), color: 'bg-purple-500' },
                { name: 'Materiais', amount: transactions.filter(t => t.category === 'Materiais' && t.type === 'despesa').reduce((sum, t) => sum + t.value, 0), color: 'bg-red-500' },
                { name: 'Fixos', amount: transactions.filter(t => t.category === 'Fixos' && t.type === 'despesa').reduce((sum, t) => sum + t.value, 0), color: 'bg-yellow-500' },
              ].map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </div>
                  <span className={`text-sm font-medium ${
                    category.amount > 0 ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    R$ {category.amount.toFixed(2)}
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
        onTransactionAdded={handleTransactionAdded}
      />
      
      <FilterModal 
        isOpen={showFilterModal} 
        onClose={() => setShowFilterModal(false)} 
      />
    </div>
  );
};
