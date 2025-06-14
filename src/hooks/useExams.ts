
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Exam {
  id: number;
  patientName: string;
  examType: string;
  date: string;
  status: 'pendente' | 'concluido';
  files: string[];
  observations?: string;
}

const tableName = "exams"; // ajuste o nome conforme necessário

export function useExams() {
  return useQuery({
    queryKey: ['exams'],
    queryFn: async (): Promise<Exam[]> => {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('date', { ascending: false });

      if (error) throw new Error(error.message);

      // Faça adaptação dos dados conforme os campos na sua tabela
      return (data || []).map((exam: any) => ({
        id: exam.id,
        patientName: exam.patient_name || exam.patientName,
        examType: exam.exam_type || exam.examType,
        date: exam.exam_date || exam.date,
        status: exam.status,
        files: exam.files || [],
        observations: exam.observations,
      }));
    },
  });
}
