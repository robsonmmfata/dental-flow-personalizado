
import React, { useState } from 'react';
import { FileText, Edit, Check, Clock, DollarSign, Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { EditBudgetModal } from './EditBudgetModal';

interface Budget {
  id: number;
  patientName: string;
  procedures: string[];
  totalValue: number;
  paymentMethod: string;
  status: 'pendente' | 'pago' | 'vencido';
  createdAt: string;
  dueDate: string;
}

export const BudgetsView: React.FC = () => {
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  const budgets: Budget[] = [
    {
      id: 1,
      patientName: 'Maria Silva',
      procedures: ['Limpeza', 'Restauração'],
      totalValue: 450.00,
      paymentMethod: 'PIX',
      status: 'pendente',
      createdAt: '2024-01-15',
      dueDate: '2024-01-25'
    },
    {
      id: 2,
      patientName: 'João Santos',
      procedures: ['Canal', 'Coroa'],
      totalValue: 1200.00,
      paymentMethod: 'Cartão de Crédito',
      status: 'pago',
      createdAt: '2024-01-10',
      dueDate: '2024-01-20'
    },
    {
      id: 3,
      patientName: 'Ana Costa',
      procedures: ['Implante'],
      totalValue: 2500.00,
      paymentMethod: 'Boleto',
      status: 'vencido',
      createdAt: '2024-01-05',
      dueDate: '2024-01-15'
    }
  ];

  const filteredBudgets = budgets.filter(budget => 
    selectedStatus === 'todos' || budget.status === selectedStatus
  );

  const handleConfirmPayment = (budgetId: number) => {
    toast({
      title: "Pagamento confirmado!",
      description: "O orçamento foi marcado como pago e adicionado às transações.",
    });
    console.log('Confirmando pagamento do orçamento:', budgetId);
  };

  const handleEditBudget = (budget: Budget) => {
    setSelectedBudget(budget);
    setShowEditModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'vencido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pago': return <Check size={16} className="text-green-600" />;
      case 'pendente': return <Clock size={16} className="text-yellow-600" />;
      case 'vencido': return <Clock size={16} className="text-red-600" />;
      default: return <Clock size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orçamentos</h1>
          <p className="text-gray-600 mt-1">Gerencie e acompanhe orçamentos de pacientes</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedStatus('todos')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedStatus === 'todos' 
                  ? 'bg-dental-gold text-white' 
                  : 'text-gray-600 hover:text-dental-gold'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedStatus('pendente')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedStatus === 'pendente' 
                  ? 'bg-dental-gold text-white' 
                  : 'text-gray-600 hover:text-dental-gold'
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setSelectedStatus('pago')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedStatus === 'pago' 
                  ? 'bg-dental-gold text-white' 
                  : 'text-gray-600 hover:text-dental-gold'
              }`}
            >
              Pagos
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Orçamentos Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {budgets.filter(b => b.status === 'pendente').length}
              </p>
            </div>
            <Clock size={24} className="text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Valor Total Pendente</p>
              <p className="text-2xl font-bold text-dental-gold">
                R$ {budgets.filter(b => b.status === 'pendente').reduce((sum, b) => sum + b.totalValue, 0).toFixed(2)}
              </p>
            </div>
            <DollarSign size={24} className="text-dental-gold" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pagos Este Mês</p>
              <p className="text-2xl font-bold text-green-600">
                {budgets.filter(b => b.status === 'pago').length}
              </p>
            </div>
            <Check size={24} className="text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText size={18} />
            Lista de Orçamentos
          </h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {filteredBudgets.map((budget) => (
              <div key={budget.id} className="border border-gray-200 rounded-lg p-4 hover:bg-dental-cream/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-dental-gold/20 rounded-full flex items-center justify-center">
                      <FileText size={20} className="text-dental-gold" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">#{budget.id} - {budget.patientName}</div>
                      <div className="text-sm text-gray-600">
                        Procedimentos: {budget.procedures.join(', ')}
                      </div>
                      <div className="text-sm text-gray-600">
                        Criado em: {new Date(budget.createdAt).toLocaleDateString('pt-BR')} • 
                        Vencimento: {new Date(budget.dueDate).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Valor Total</div>
                      <div className="font-bold text-dental-gold text-lg">
                        R$ {budget.totalValue.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Pagamento</div>
                      <div className="font-medium text-gray-900">
                        {budget.paymentMethod}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(budget.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(budget.status)}`}>
                        {budget.status}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditBudget(budget)}
                        className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                      >
                        <Edit size={14} className="mr-1" />
                        Editar
                      </Button>
                      {budget.status === 'pendente' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleConfirmPayment(budget.id)}
                          className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                        >
                          <Check size={14} className="mr-1" />
                          Confirmar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredBudgets.length === 0 && (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Nenhum orçamento encontrado</p>
            </div>
          )}
        </div>
      </div>

      <EditBudgetModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        budget={selectedBudget}
      />
    </div>
  );
};
