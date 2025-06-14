
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GoalModalProps {
  isOpen: boolean;
  initialGoal: number;
  onClose: () => void;
  onSave: (goal: number) => void;
  title: string;
  label: string;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  initialGoal,
  onClose,
  onSave,
  title,
  label,
}) => {
  const [goalInput, setGoalInput] = useState(initialGoal.toFixed(2));

  // Atualiza valor do input ao abrir com novo initialGoal
  useEffect(() => {
    setGoalInput(initialGoal.toFixed(2));
  }, [initialGoal, isOpen]);

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
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div>
          <label htmlFor="goal-value" className="block mb-2 text-sm">
            {label}
          </label>
          <Input
            id="goal-value"
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
