import { supabase } from '@/integrations/supabase/client';

export interface ExamFile {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
  patientId?: number;
}

export const uploadExamFile = async (
  file: File, 
  patientId?: number
): Promise<ExamFile> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `exams/${fileName}`;

  // Upload do arquivo para o Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('exam-files')
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(`Erro no upload: ${uploadError.message}`);
  }

  // Gerar URL pública do arquivo
  const { data: urlData } = supabase.storage
    .from('exam-files')
    .getPublicUrl(filePath);

  const examFile: ExamFile = {
    id: fileName,
    name: file.name,
    url: urlData.publicUrl,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    patientId
  };

  return examFile;
};

export const deleteExamFile = async (filePath: string): Promise<boolean> => {
  const { error } = await supabase.storage
    .from('exam-files')
    .remove([filePath]);

  if (error) {
    throw new Error(`Erro ao deletar arquivo: ${error.message}`);
  }

  return true;
};

export const getExamFileUrl = (filePath: string): string => {
  const { data } = supabase.storage
    .from('exam-files')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
