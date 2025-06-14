
import { supabase } from '@/integrations/supabase/client';

export interface Transaction {
  id: number;
  date: string;
  description: string;
  type: 'receita' | 'despesa';
  value: number;
  category: string;
  status: 'confirmado' | 'pendente';
  patientId?: number;
  appointmentmtr: number;
  createdat: string;
}

function mapDbToTransaction(row: any): Transaction {
  return {
    id: row.id,
    date: row.date,
    description: row.description,
    type: row.type,
    value: row.value,
    category: row.category,
    status: row.status,
    patientId: row.patientId,
    appointmentmtr: row.appointmentmtr,
    createdat: row.createdat,
  }
}

class FinancialStore {
  async addTransaction(transactionData: Omit<Transaction, 'id' | 'createdat'>): Promise<Transaction> {
    // appointmentmtr is required (use 0 if not provided)
    const dataToInsert: any = { ...transactionData, createdat: new Date().toISOString() };
    if (typeof dataToInsert.appointmentmtr !== 'number') dataToInsert.appointmentmtr = 0;
    const { data, error } = await supabase
      .from('transactions')
      .insert([dataToInsert])
      .select()
      .single();
    if (error) {
      console.error('Erro ao adicionar transação:', error);
      throw error;
    }
    return mapDbToTransaction(data);
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
      appointmentmtr: appointmentmtr ?? 0
    });
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*');
    if (error) {
      console.error('Erro ao buscar todas as transações:', error);
      throw error;
    }
    return (data || []).map(mapDbToTransaction);
  }

  async getTransactionsByDate(date: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('date', date);
    if (error) {
      console.error(`Erro ao buscar transações pela data ${date}:`, error);
      throw error;
    }
    return (data || []).map(mapDbToTransaction);
  }

  async getRevenueByDate(date: string): Promise<number> {
    const { data, error } = await supabase
      .from('transactions')
      .select('value')
      .eq('date', date)
      .eq('type', 'receita')
      .eq('status', 'confirmado');
    if (error) {
      console.error(`Erro ao buscar receita pela data ${date}:`, error);
      throw error;
    }
    return data?.reduce((sum, t) => sum + t.value, 0) || 0;
  }

  async getExpensesByDate(date: string): Promise<number> {
    const { data, error } = await supabase
      .from('transactions')
      .select('value')
      .eq('date', date)
      .eq('type', 'despesa')
      .eq('status', 'confirmado');
    if (error) {
      console.error(`Erro ao buscar despesas pela data ${date}:`, error);
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
    return () => {};
  }

  private notifyListeners(): void {
  }

  async updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction | null> {
    const updateObj: any = { ...updates };
    if (updateObj.appointmentmtr === undefined) updateObj.appointmentmtr = 0;
    const { data, error } = await supabase
      .from('transactions')
      .update(updateObj)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error(`Erro ao atualizar transação ${id}:`, error);
      throw error;
    }
    return data ? mapDbToTransaction(data) : null;
  }

  async deleteTransaction(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    if (error) {
      console.error(`Erro ao deletar transação ${id}:`, error);
      throw error;
    }
    return true;
  }
}

export const financialStore = new FinancialStore();

