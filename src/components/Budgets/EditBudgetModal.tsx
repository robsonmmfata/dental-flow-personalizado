
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, CreditCard, Smartphone, Banknote, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { budgetStore, Budget } from '@/stores/budgetStore';

interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: Budget | null;
}

export const EditBudgetModal: React.FC<EditBudgetModalProps> = ({ isOpen, onClose, budget }) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [status, setStatus] = useState('');
  const [dueDate, setDueDate] = useState('');

  const paymentMethods = [
    { id: 'pix', name: 'PIX', icon: Smartphone },
    { id: 'credit', name: 'Cartão de Crédito', icon: CreditCard },
    { id: 'debit', name: 'Cartão de Débito', icon: CreditCard },
    { id: 'cash', name: 'Dinheiro', icon: Banknote },
    { id: 'boleto', name: 'Boleto', icon: Receipt }
  ];

  useEffect(() => {
    if (budget) {
      const methodId = paymentMethods.find(pm => pm.name === budget.paymentMethod)?.id || 'pix';
      setPaymentMethod(methodId);
      setStatus(budget.status);
      setDueDate(budget.dueDate);
    }
  }, [budget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (budget) {
      const selectedPaymentMethod = paymentMethods.find(pm => pm.id === paymentMethod)?.name || paymentMethod;
      
      budgetStore.updateBudget(budget.id, { 
        paymentMethod: selectedPaymentMethod, 
        status: status as 'pendente' | 'pago' | 'vencido', 
        dueDate 
      });
      
      toast({
        title: "Orçamento atualizado!",
        description: `Orçamento #${budget.id} foi atualizado com sucesso.`,
      });
      onClose();
    }
  };

  if (!budget) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText size={20} className="text-dental-gold" />
            Editar Orçamento #{budget.id} - {budget.patientName}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-dental-cream/30 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Detalhes do Orçamento</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Paciente: <span className="font-medium">{budget.patientName}</span></div>
              <div>Valor Total: <span className="font-medium text-dental-gold">R$ {budget.totalValue.toFixed(2)}</span></div>
              <div className="col-span-2">
                Procedimentos: <span className="font-medium">{budget.procedures.join(', ')}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Status do Orçamento</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'pendente', label: 'Pendente', color: 'border-yellow-500 text-yellow-700' },
                { value: 'pago', label: 'Pago', color: 'border-green-500 text-green-700' },
                { value: 'vencido', label: 'Vencido', color: 'border-red-500 text-red-700' }
              ].map((statusOption) => (
                <button
                  key={statusOption.value}
                  type="button"
                  onClick={() => setStatus(statusOption.value)}
                  className={`p-3 border-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    status === statusOption.value
                      ? `${statusOption.color} bg-opacity-10`
                      : 'border-gray-200 hover:border-dental-gold/50'
                  }`}
                >
                  <span className="font-medium">{statusOption.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Método de Pagamento</label>
            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === method.id
                        ? 'border-dental-gold bg-dental-gold/10 text-dental-gold'
                        : 'border-gray-200 hover:border-dental-gold/50'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-xs font-medium">{method.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
              Data de Vencimento
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              required
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-dental-gold hover:bg-dental-gold-dark text-white">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
