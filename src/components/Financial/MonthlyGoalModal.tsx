
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MonthlyGoalModalProps {
  isOpen: boolean;
  initialGoal: number;
  onClose: () => void;
  onSave: (goal: number) => void;
}

export const MonthlyGoalModal: React.FC<MonthlyGoalModalProps> = ({
  isOpen,
  initialGoal,
  onClose,
  onSave,
}) => {
  const [goalInput, setGoalInput] = useState(initialGoal.toFixed(2));

  const handleSave = () => {
    const cleanValue = parseFloat(goalInput.replace(',', '.'));
    if (!isNaN(cleanValue) && cleanValue > 0) {
      onSave(cleanValue);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Definir Meta Mensal de Receita</DialogTitle>
        </DialogHeader>
        <div>
          <label htmlFor="monthly-goal" className="block mb-2 text-sm">
            Valor da meta mensal (R$)
          </label>
          <Input
            id="monthly-goal"
            type="number"
            min={0}
            value={goalInput}
            onChange={e => setGoalInput(e.target.value)}
            autoFocus
            className="mb-2"
            step="0.01"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="bg-dental-gold text-white" onClick={handleSave}>
            Salvar meta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
