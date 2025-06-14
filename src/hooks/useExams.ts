
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Exam {
  id: number;
  patientName: string;
  examType: string;
  date: string;
  status: 'pendente' | 'concluido';
  files: string[]; // just urls
  observations?: string;
}

export function useExams() {
  return useQuery({
    queryKey: ['exams'],
    queryFn: async (): Promise<Exam[]> => {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('exam_date', { ascending: false });

      if (error) throw new Error(error.message);

      // Adapting keys for UI
      return (data || []).map((exam: any) => ({
        id: exam.id,
        patientName: exam.patient_name,
        examType: exam.exam_type,
        date: exam.exam_date,
        status: exam.status,
        files: exam.files || [], // just array of strings (urls)
        observations: exam.observations || '',
      }));
    },
  });
}
