
interface Transaction {
  id: number;
  date: string;
  description: string;
  type: 'receita' | 'despesa';
  value: number;
  category: string;
  status: 'confirmado' | 'pendente';
  patientId?: number;
  appointmentId?: number;
  createdAt: string;
}

class FinancialStore {
  private transactions: Transaction[] = [
    { 
      id: 1, 
      date: new Date().toISOString().split('T')[0], 
      description: 'Consulta - Maria Silva', 
      type: 'receita', 
      value: 150, 
      category: 'Consultas', 
      status: 'confirmado',
      patientId: 1,
      createdAt: new Date().toISOString()
    },
    { 
      id: 2, 
      date: new Date().toISOString().split('T')[0], 
      description: 'Orçamento - João Santos', 
      type: 'receita', 
      value: 800, 
      category: 'Orçamentos', 
      status: 'pendente',
      patientId: 2,
      createdAt: new Date().toISOString()
    },
    { 
      id: 3, 
      date: new Date().toISOString().split('T')[0], 
      description: 'Material Odontológico', 
      type: 'despesa', 
      value: 320, 
      category: 'Materiais', 
      status: 'confirmado',
      createdAt: new Date().toISOString()
    }
  ];

  private listeners: (() => void)[] = [];

  addTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Math.max(...this.transactions.map(t => t.id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    
    this.transactions.push(newTransaction);
    this.notifyListeners();
    return newTransaction;
  }

  addAppointmentTransaction(patientName: string, service: string, value: number, patientId?: number, appointmentId?: number): Transaction {
    return this.addTransaction({
      date: new Date().toISOString().split('T')[0],
      description: `${service} - ${patientName}`,
      type: 'receita',
      value,
      category: 'Consultas',
      status: 'confirmado',
      patientId,
      appointmentId
    });
  }

  getAllTransactions(): Transaction[] {
    return [...this.transactions];
  }

  getTransactionsByDate(date: string): Transaction[] {
    return this.transactions.filter(t => t.date === date);
  }

  getRevenueByDate(date: string): number {
    return this.transactions
      .filter(t => t.date === date && t.type === 'receita' && t.status === 'confirmado')
      .reduce((sum, t) => sum + t.value, 0);
  }

  getExpensesByDate(date: string): number {
    return this.transactions
      .filter(t => t.date === date && t.type === 'despesa' && t.status === 'confirmado')
      .reduce((sum, t) => sum + t.value, 0);
  }

  getDailyProfit(date: string): number {
    return this.getRevenueByDate(date) - this.getExpensesByDate(date);
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  updateTransaction(id: number, updates: Partial<Transaction>): Transaction | null {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transactions[index] = { ...this.transactions[index], ...updates };
      this.notifyListeners();
      return this.transactions[index];
    }
    return null;
  }

  deleteTransaction(id: number): boolean {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transactions.splice(index, 1);
      this.notifyListeners();
      return true;
    }
    return false;
  }
}

export const financialStore = new FinancialStore();
export type { Transaction };
