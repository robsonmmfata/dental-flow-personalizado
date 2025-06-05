import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Trash2, CreditCard, Smartphone, Banknote, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OdontogramComponent } from './OdontogramComponent';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

interface Procedure {
  id: number;
  name: string;
  teeth: number[];
  price: number;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose, patient }) => {
  const { toast } = useToast();
  const [procedures, setProcedures] = useState<Procedure[]>([
    { id: 1, name: '', teeth: [], price: 0 }
  ]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [selectedTeethForProcedure, setSelectedTeethForProcedure] = useState<number>(1);

  const procedureTypes = [
    'Consulta',
    'Limpeza',
    'Restauração',
    'Canal',
    'Extração',
    'Implante',
    'Ortodontia',
    'Clareamento',
    'Prótese',
    'Cirurgia',
    'Periodontia'
  ];

  const paymentMethods = [
    { id: 'pix', name: 'PIX', icon: Smartphone },
    { id: 'credit', name: 'Cartão de Crédito', icon: CreditCard },
    { id: 'debit', name: 'Cartão de Débito', icon: CreditCard },
    { id: 'cash', name: 'Dinheiro', icon: Banknote },
    { id: 'boleto', name: 'Boleto', icon: Receipt }
  ];

  const addProcedure = () => {
    setProcedures([...procedures, { id: Date.now(), name: '', teeth: [], price: 0 }]);
  };

  const removeProcedure = (id: number) => {
    setProcedures(procedures.filter(p => p.id !== id));
  };

  const updateProcedure = (id: number, field: string, value: any) => {
    setProcedures(procedures.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleToothSelect = (toothId: number) => {
    const currentProcedure = procedures.find(p => p.id === selectedTeethForProcedure);
    if (currentProcedure) {
      const updatedTeeth = currentProcedure.teeth.includes(toothId)
        ? currentProcedure.teeth.filter(t => t !== toothId)
        : [...currentProcedure.teeth, toothId];
      
      updateProcedure(selectedTeethForProcedure, 'teeth', updatedTeeth);
    }
  };

  const totalPrice = procedures.reduce((sum, p) => sum + (p.price || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um método de pagamento.",
        variant: "destructive"
      });
      return;
    }

    const budgetData = { 
      patient, 
      procedures, 
      total: totalPrice, 
      paymentMethod,
      createdAt: new Date().toISOString(),
      status: 'pendente'
    };
    
    console.log('Orçamento criado:', budgetData);
    
    // Simular adição à lista de transações financeiras
    const transaction = {
      id: Date.now(),
      date: new Date().toISOString(),
      description: `Orçamento - ${patient?.name}`,
      type: 'receita',
      value: totalPrice,
      category: 'Orçamentos',
      status: 'pendente'
    };
    
    console.log('Transação criada:', transaction);
    
    toast({
      title: "Orçamento criado!",
      description: `Orçamento para ${patient?.name} no valor de R$ ${totalPrice.toFixed(2)} foi criado e adicionado às transações.`,
    });
    onClose();
  };

  const generatePDF = () => {
    toast({
      title: "PDF Gerado",
      description: "O orçamento foi exportado para PDF com sucesso!",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText size={20} className="text-dental-gold" />
            Novo Orçamento - {patient?.name}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-dental-cream/30 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Informações do Paciente</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Nome: <span className="font-medium">{patient?.name}</span></div>
              <div>Telefone: <span className="font-medium">{patient?.phone}</span></div>
            </div>
          </div>

          <OdontogramComponent 
            selectedTeeth={procedures.find(p => p.id === selectedTeethForProcedure)?.teeth || []}
            onToothSelect={handleToothSelect}
          />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Procedimentos</h4>
              <Button type="button" onClick={addProcedure} variant="outline" size="sm">
                <Plus size={16} className="mr-1" />
                Adicionar
              </Button>
            </div>
            
            <div className="space-y-3">
              {procedures.map((procedure, index) => (
                <div key={procedure.id} className="grid grid-cols-12 gap-3 items-center p-3 border border-gray-200 rounded-lg">
                  <div className="col-span-1 text-sm font-medium text-gray-500">
                    {index + 1}
                  </div>
                  
                  <div className="col-span-4">
                    <select
                      value={procedure.name}
                      onChange={(e) => updateProcedure(procedure.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-dental-gold"
                      required
                    >
                      <option value="">Selecione o procedimento</option>
                      {procedureTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-span-3">
                    <div className="text-sm">
                      <button
                        type="button"
                        onClick={() => setSelectedTeethForProcedure(procedure.id)}
                        className={`px-2 py-1 rounded text-xs ${
                          selectedTeethForProcedure === procedure.id 
                            ? 'bg-dental-gold text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {procedure.teeth.length > 0 
                          ? `Dentes: ${procedure.teeth.join(', ')}` 
                          : 'Selecionar dentes'
                        }
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={procedure.price}
                      onChange={(e) => updateProcedure(procedure.id, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="Valor"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-dental-gold"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div className="col-span-1">
                    {procedures.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeProcedure(procedure.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Método de Pagamento</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
          
          <div className="bg-dental-gold/10 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total do Orçamento:</span>
              <span className="text-2xl font-bold text-dental-gold">
                R$ {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="button" onClick={generatePDF} variant="outline" className="flex-1">
              Exportar PDF
            </Button>
            <Button type="submit" className="flex-1 bg-dental-gold hover:bg-dental-gold-dark text-white">
              Criar Orçamento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
