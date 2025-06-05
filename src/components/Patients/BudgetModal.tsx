
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose, patient }) => {
  const { toast } = useToast();
  const [procedures, setProcedures] = useState([
    { id: 1, name: '', tooth: '', price: 0 }
  ]);

  const procedureTypes = [
    'Consulta',
    'Limpeza',
    'Restauração',
    'Canal',
    'Extração',
    'Implante',
    'Ortodontia',
    'Clareamento',
    'Prótese'
  ];

  const addProcedure = () => {
    setProcedures([...procedures, { id: Date.now(), name: '', tooth: '', price: 0 }]);
  };

  const removeProcedure = (id: number) => {
    setProcedures(procedures.filter(p => p.id !== id));
  };

  const updateProcedure = (id: number, field: string, value: any) => {
    setProcedures(procedures.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const totalPrice = procedures.reduce((sum, p) => sum + (p.price || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Orçamento criado:', { patient, procedures, total: totalPrice });
    toast({
      title: "Orçamento criado!",
      description: `Orçamento para ${patient?.name} no valor de R$ ${totalPrice.toFixed(2)}`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
                  
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={procedure.tooth}
                      onChange={(e) => updateProcedure(procedure.id, 'tooth', e.target.value)}
                      placeholder="Dente"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-dental-gold"
                    />
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
                  
                  <div className="col-span-2">
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
            <Button type="submit" className="flex-1 bg-dental-gold hover:bg-dental-gold-dark text-white">
              Criar Orçamento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
