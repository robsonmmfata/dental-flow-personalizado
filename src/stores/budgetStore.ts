
// Store global para orçamentos (simulando um estado global)
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

class BudgetStore {
  private budgets: Budget[] = [
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

  getAllBudgets(): Budget[] {
    return this.budgets;
  }

  addBudget(budget: Omit<Budget, 'id'>): Budget {
    const newBudget = {
      ...budget,
      id: Math.max(...this.budgets.map(b => b.id), 0) + 1
    };
    this.budgets.push(newBudget);
    return newBudget;
  }

  updateBudget(id: number, updates: Partial<Budget>): Budget | null {
    const index = this.budgets.findIndex(b => b.id === id);
    if (index === -1) return null;
    
    this.budgets[index] = { ...this.budgets[index], ...updates };
    return this.budgets[index];
  }

  getBudgetById(id: number): Budget | undefined {
    return this.budgets.find(b => b.id === id);
  }
}

export const budgetStore = new BudgetStore();
export type { Budget };
