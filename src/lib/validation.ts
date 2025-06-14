
import { z } from 'zod';

// Schema para pacientes
export const patientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos').max(14, 'CPF inválido'),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  emergencyContact: z.string().min(2, 'Contato de emergência é obrigatório'),
  emergencyPhone: z.string().min(10, 'Telefone de emergência deve ter pelo menos 10 dígitos'),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  notes: z.string().optional(),
  preferredDoctor: z.string().min(1, 'Médico preferido é obrigatório'),
  status: z.enum(['ativo', 'inativo'])
});

// Schema para médicos
export const doctorSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cro: z.string().min(3, 'CRO é obrigatório'),
  specialty: z.string().min(2, 'Especialidade é obrigatória'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  status: z.enum(['ativo', 'inativo'])
});

// Schema para consultas
export const appointmentSchema = z.object({
  patientName: z.string().min(2, 'Nome do paciente é obrigatório'),
  patientId: z.number().min(1, 'Paciente deve ser selecionado'),
  doctorName: z.string().min(2, 'Nome do médico é obrigatório'),
  doctorId: z.number().min(1, 'Médico deve ser selecionado'),
  date: z.string().min(1, 'Data é obrigatória'),
  time: z.string().min(1, 'Horário é obrigatório'),
  service: z.string().min(2, 'Serviço é obrigatório'),
  status: z.enum(['agendado', 'confirmado', 'concluido', 'cancelado']),
  notes: z.string().optional()
});

// Schema para transações financeiras
export const transactionSchema = z.object({
  date: z.string().min(1, 'Data é obrigatória'),
  description: z.string().min(2, 'Descrição deve ter pelo menos 2 caracteres'),
  type: z.enum(['receita', 'despesa']),
  value: z.number().min(0.01, 'Valor deve ser maior que zero'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  status: z.enum(['confirmado', 'pendente']),
  patientId: z.number().optional(),
  appointmentmtr: z.number().optional()
});

// Funções de validação
export const validatePatient = (data: any) => {
  return patientSchema.safeParse(data);
};

export const validateDoctor = (data: any) => {
  return doctorSchema.safeParse(data);
};

export const validateAppointment = (data: any) => {
  return appointmentSchema.safeParse(data);
};

export const validateTransaction = (data: any) => {
  return transactionSchema.safeParse(data);
};

// Utilitários de formatação
export const formatCPF = (cpf: string): string => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatPhone = (phone: string): string => {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
