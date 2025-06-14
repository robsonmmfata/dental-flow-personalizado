
import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCard } from '../Dashboard/StatsCard';
import { TransactionModal } from './TransactionModal';
import { FilterModal } from './FilterModal';
import { financialStore } from '@/stores/financialStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const FinancialView: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'month'>('day');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [monthlyGoal, setMonthlyGoal] = useState<number>(15000); // valor inicial, pode ser alterado pelo usuário

  const today = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-indexado
  const currentMonthStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;

  // Transações
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => financialStore.getAllTransactions(),
  });

  // Estatísticas do dia
  const { data: todayStats } = useQuery({
    queryKey: ['financialStats', today],
    queryFn: async () => {
      const revenue = await financialStore.getRevenueByDate(today);
      const expenses = await financialStore.getExpensesByDate(today);
      const profit = await financialStore.getDailyProfit(today);
      return { revenue, expenses, profit };
    },
  });

  // Estatísticas do mês
  const { data: monthStats } = useQuery({
    queryKey: ['financialStatsMonth', currentMonthStr],
    queryFn: async () => {
      // Somar receitas/despesas de todas as transações do mês
      const monthTransactions = transactions.filter((t) =>
        t.date.startsWith(currentMonthStr)
      );
      const revenue = monthTransactions.filter(t => t.type === 'receita' && t.status === 'confirmado').reduce((s, t) => s + t.value, 0);
      const expenses = monthTransactions.filter(t => t.type === 'despesa' && t.status === 'confirmado').reduce((s, t) => s + t.value, 0);
      const profit = revenue - expenses;
      return { revenue, expenses, profit };
    },
    enabled: selectedPeriod === 'month' && transactions.length > 0,
  });

  const handleTransactionSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['financialStats', today] });
    setShowTransactionModal(false);
  };

  // Abrir um prompt para definir meta mensal (pode ser substituído por modal customizado depois)
  const handleSetMonthlyGoal = () => {
    const goalStr = window.prompt('Defina o valor da meta mensal (R$):', monthlyGoal?.toString() || '15000');
    if (!goalStr) return;
    const valueNum = parseFloat(goalStr.replace(',', '.'));
    if (!isNaN(valueNum) && valueNum > 0) {
      setMonthlyGoal(valueNum);
    }
  };

  // Get progress
  const currentStats = selectedPeriod === 'day' ? todayStats : monthStats;
  const goal = selectedPeriod === 'day' ? 650 : monthlyGoal;
  const goalLabel = selectedPeriod === 'day' ? 'Meta de receita diária' : 'Meta de receita mensal';
  const progress = ((currentStats?.revenue || 0) / goal) * 100;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Controle Financeiro</h1>
          <p className="text-gray-600 mt-1">Gerencie receitas, despesas e relatórios</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedPeriod('day')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedPeriod === 'day'
                  ? 'bg-dental-gold text-white'
                  : 'text-gray-600 hover:text-dental-gold'
              }`}
              data-testid="toggle-dia"
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
              data-testid="toggle-mes"
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
          <Button
            variant="outline"
            onClick={handleSetMonthlyGoal}
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
            data-testid="botao-meta-mensal"
          >
            Definir Meta Mensal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title={selectedPeriod === 'day' ? 'Receita do Dia' : 'Receita do Mês'}
          value={`R$ ${currentStats?.revenue?.toFixed(2) || '0.00'}`}
          icon={TrendingUp}
          trend={{
            value: selectedPeriod === 'day' ? 12.5 : 5.2,
            isPositive: true
          }}
          color="sage"
        />
        <StatsCard
          title={selectedPeriod === 'day' ? 'Despesa do Dia' : 'Despesa do Mês'}
          value={`R$ ${currentStats?.expenses?.toFixed(2) || '0.00'}`}
          icon={TrendingDown}
          trend={{
            value: selectedPeriod === 'day' ? 5.2 : 2.4,
            isPositive: false
          }}
          color="nude"
        />
        <StatsCard
          title={selectedPeriod === 'day' ? 'Lucro Líquido Diário' : 'Lucro Líquido Mensal'}
          value={`R$ ${currentStats?.profit?.toFixed(2) || '0.00'}`}
          icon={DollarSign}
          trend={{
            value: selectedPeriod === 'day' ? 18.3 : 7.8,
            isPositive: (currentStats?.profit || 0) > 0
          }}
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                {selectedPeriod === 'day' ? 'Meta Diária' : 'Meta Mensal'}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-dental-gold">R$ {goal}</div>
                <div className="text-sm text-gray-600">{goalLabel}</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-dental-gold h-3 rounded-full"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {(currentStats?.revenue || 0) >= goal
                    ? selectedPeriod === 'day'
                      ? 'Meta diária atingida!'
                      : 'Meta mensal atingida!'
                    : selectedPeriod === 'day'
                    ? 'Continue trabalhando para atingir a meta diária'
                    : 'Continue trabalhando para atingir a meta mensal'}
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
        onSuccess={handleTransactionSuccess}
      />
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
      />
    </div>
  );
};
