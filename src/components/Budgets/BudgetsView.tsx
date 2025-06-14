import React, { useState } from 'react';
import { FileText, Edit, Check, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { EditBudgetModal } from './EditBudgetModal';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Budget = Tables<"budgets">;

export const BudgetsView: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  // Helper: convert camelCase budget to snake_case for Supabase update
  const toSupabaseBudget = (budget: Partial<Budget>) => ({
    ...(budget.patientName !== undefined && { patientname: budget.patientName }),
    ...(budget.procedures !== undefined && { procedures: budget.procedures }),
    ...(budget.totalValue !== undefined && { totalvalue: budget.totalValue }),
    ...(budget.paymentMethod !== undefined && { paymentmethod: budget.paymentMethod }),
    ...(budget.status !== undefined && { status: budget.status }),
    ...(budget.createdAt !== undefined && { createdat: budget.createdAt }),
    ...(budget.dueDate !== undefined && { duedate: budget.dueDate }),
  });

  // Query budgets from Supabase, mapping to camelCase
  const { data: budgets = [], isLoading } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('createdat', { ascending: false });
      if (error) throw error;
      // Map each record to camelCase to match Budget type
      return (data ?? []).map((budget) => ({
        id: budget.id,
        patientName: budget.patientname,
        procedures: budget.procedures,
        totalValue: budget.totalvalue,
        paymentMethod: budget.paymentmethod,
        status: budget.status,
        createdAt: budget.createdat,
        dueDate: budget.duedate,
      }));
    }
  });

  // Update budget status
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Budget> }) => {
      // Convert any updates to supabase format
      const updatesForSupabase = toSupabaseBudget(updates);
      const { data, error } = await supabase
        .from('budgets')
        .update(updatesForSupabase)
        .eq('id', id)
        .select()
        .maybeSingle();
      if (error) throw error;
      // Map result back to camelCase if needed
      return data
        ? {
            id: data.id,
            patientName: data.patientname,
            procedures: data.procedures,
            totalValue: data.totalvalue,
            paymentMethod: data.paymentmethod,
            status: data.status,
            createdAt: data.createdat,
            dueDate: data.duedate,
          }
        : null;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['budgets'] })
  });

  const filteredBudgets = budgets.filter(budget => 
    selectedStatus === 'todos' || budget.status === selectedStatus
  );

  const handleConfirmPayment = async (budgetId: number) => {
    try {
      await updateMutation.mutateAsync({ id: budgetId, updates: { status: 'pago' } });
      toast({
        title: "Pagamento confirmado!",
        description: "O orçamento foi marcado como pago e adicionado às transações.",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao confirmar pagamento",
        description: err.message || "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditBudget = (budget: Budget) => {
    setSelectedBudget(budget);
    setShowEditModal(true);
  };

  const handleEditComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['budgets'] });
    setShowEditModal(false);
    setSelectedBudget(null);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'pago': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'vencido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string | null) => {
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
                R$ {budgets.filter(b => b.status === 'pendente').reduce((sum, b) => sum + (b.totalValue||0), 0).toFixed(2)}
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
          {isLoading && (
            <div className="text-center text-gray-500">Carregando orçamentos...</div>
          )}
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
                        Criado em: {budget.createdAt && (new Date(budget.createdAt).toLocaleDateString('pt-BR'))} • 
                        Vencimento: {budget.dueDate && (new Date(budget.dueDate).toLocaleDateString('pt-BR'))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Valor Total</div>
                      <div className="font-bold text-dental-gold text-lg">
                        R$ {(budget.totalValue || 0).toFixed(2)}
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
                          disabled={updateMutation.isPending}
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
          
          {filteredBudgets.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Nenhum orçamento encontrado</p>
            </div>
          )}
        </div>
      </div>

      <EditBudgetModal 
        isOpen={showEditModal} 
        onClose={handleEditComplete}
        budget={selectedBudget}
      />
    </div>
  );
};
