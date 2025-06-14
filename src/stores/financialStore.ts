import { supabase } from '../lib/supabaseClient';

export interface Transaction {
  id: number;
  date: string;
  description: string;
  type: 'receita' | 'despesa';
  value: number;
  category: string;
  status: 'confirmado' | 'pendente';
  patientId?: number;
  appointmentmtr?: number;
  createdat: string; // ALTERADO: Renomeado de 'createdAt' para 'createdat' (minúsculo)
}

class FinancialStore {
  async addTransaction(transactionData: Omit<Transaction, 'id' | 'createdat'>): Promise<Transaction> {
    const { data, error } = await supabase
      .from<Transaction>('transactions')
      .insert([{ ...transactionData, createdat: new Date().toISOString() }])
      .select()
      .single();
    if (error) {
      console.error('Erro ao adicionar transação:', error); // Adicionei um log de erro aqui para depuração
      throw error;
    }
    return data;
  }

  async addAppointmentTransaction(patientName: string, service: string, value: number, patientId?: number, appointmentmtr?: number): Promise<Transaction> {
    return this.addTransaction({
      date: new Date().toISOString().split('T')[0],
      description: `${service} - ${patientName}`,
      type: 'receita',
      value,
      category: 'Consultas',
      status: 'confirmado',
      patientId,
      appointmentmtr
    });
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from<Transaction>('transactions')
      .select('*');
    if (error) {
      console.error('Erro ao buscar todas as transações:', error); // Adicionei um log de erro
      throw error;
    }
    return data || [];
  }

  async getTransactionsByDate(date: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from<Transaction>('transactions')
      .select('*')
      .eq('date', date);
    if (error) {
      console.error(`Erro ao buscar transações pela data ${date}:`, error); // Adicionei um log de erro
      throw error;
    }
    return data || [];
  }

  async getRevenueByDate(date: string): Promise<number> {
    const { data, error } = await supabase
      .from<Transaction>('transactions')
      .select('value')
      .eq('date', date)
      .eq('type', 'receita')
      .eq('status', 'confirmado');
    if (error) {
      console.error(`Erro ao buscar receita pela data ${date}:`, error); // Adicionei um log de erro
      throw error;
    }
    return data?.reduce((sum, t) => sum + t.value, 0) || 0;
  }

  async getExpensesByDate(date: string): Promise<number> {
    const { data, error } = await supabase
      .from<Transaction>('transactions')
      .select('value')
      .eq('date', date)
      .eq('type', 'despesa')
      .eq('status', 'confirmado');
    if (error) {
      console.error(`Erro ao buscar despesas pela data ${date}:`, error); // Adicionei um log de erro
      throw error;
    }
    return data?.reduce((sum, t) => sum + t.value, 0) || 0;
  }

  async getDailyProfit(date: string): Promise<number> {
    const revenue = await this.getRevenueByDate(date);
    const expenses = await this.getExpensesByDate(date);
    return revenue - expenses;
  }

  subscribe(listener: () => void): () => void {
    // React Query or other mechanism should be used instead of listeners
    // This method can be deprecated or adapted as needed
    return () => {};
  }

  private notifyListeners(): void {
    // Deprecated with React Query
  }

  async updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from<Transaction>('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error(`Erro ao atualizar transação ${id}:`, error); // Adicionei um log de erro
      throw error;
    }
    return data;
  }

  async deleteTransaction(id: number): Promise<boolean> {
    const { error } = await supabase
      .from<Transaction>('transactions')
      .delete()
      .eq('id', id);
    if (error) {
      console.error(`Erro ao deletar transação ${id}:`, error); // Adicionei um log de erro
      throw error;
    }
    return true;
  }
}

export const financialStore = new FinancialStore();
export type { Transaction };