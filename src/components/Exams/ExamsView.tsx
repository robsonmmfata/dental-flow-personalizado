import React, { useState } from 'react';
import { FileImage, Plus, Eye, Download, Upload, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UploadExamModal } from './UploadExamModal';
import { ViewExamModal } from './ViewExamModal';
import { useToast } from '@/hooks/use-toast';
import { useExams } from '@/hooks/useExams';

interface Exam {
  id: number;
  patientName: string;
  examType: string;
  date: string;
  status: 'pendente' | 'concluido';
  files: string[];
  observations?: string;
}

export const ExamsView: React.FC = () => {
  const { toast } = useToast();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Pega os exames do Supabase usando o hook
  const { data: exams = [], isLoading, isError, error } = useExams();

  const filteredExams = (exams || []).filter(exam =>
    (exam?.patientName ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exam?.examType ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewExam = (exam: Exam) => {
    setSelectedExam(exam);
    setShowViewModal(true);
  };

  const handleDownloadExam = (examId: number) => {
    toast({
      title: "Download iniciado",
      description: "O arquivo do exame está sendo baixado.",
    });
    console.log('Baixando exame:', examId);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exames</h1>
          <p className="text-gray-600 mt-1">Gerencie exames e resultados dos pacientes</p>
        </div>
        <Button 
          onClick={() => setShowUploadModal(true)}
          className="bg-dental-gold hover:bg-dental-gold-dark text-white"
        >
          <Plus size={16} className="mr-2" />
          Adicionar Exame
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Exames</p>
              <p className="text-2xl font-bold text-dental-gold">{exams.length}</p>
            </div>
            <FileImage size={24} className="text-dental-gold" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Exames Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {exams.filter(exam => exam.status === 'pendente').length}
              </p>
            </div>
            <Calendar size={24} className="text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Exames Concluídos</p>
              <p className="text-2xl font-bold text-green-600">
                {exams.filter(exam => exam.status === 'concluido').length}
              </p>
            </div>
            <Eye size={24} className="text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileImage size={18} />
              Lista de Exames
            </h3>
            <input
              type="text"
              placeholder="Buscar exame..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
            />
          </div>
        </div>
        
        <div className="p-6">
          {isLoading && (
            <div className="text-center py-12 text-gray-500">Carregando exames...</div>
          )}
          {isError && (
            <div className="text-center py-12 text-red-500">
              Erro ao carregar exames: {error?.message || 'desconhecido'}
            </div>
          )}
          {!isLoading && !isError && (
            <div className="space-y-4">
              {filteredExams.map((exam) => (
                <div key={exam.id} className="border border-gray-200 rounded-lg p-4 hover:bg-dental-cream/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-dental-gold/20 rounded-full flex items-center justify-center">
                        <FileImage size={20} className="text-dental-gold" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{exam.examType}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <User size={14} />
                          {exam.patientName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(exam.date).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          exam.status === 'concluido' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {exam.status === 'concluido' ? 'Concluído' : 'Pendente'}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewExam(exam)}
                          className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                        >
                          <Eye size={14} className="mr-1" />
                          Visualizar
                        </Button>
                        {exam.status === 'concluido' && exam.files.length > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDownloadExam(exam.id)}
                            className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                          >
                            <Download size={14} className="mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!isLoading && !isError && filteredExams.length === 0 && (
            <div className="text-center py-12">
              <FileImage size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'Nenhum exame encontrado' : 'Nenhum exame cadastrado'}
              </p>
            </div>
          )}
        </div>
      </div>

      <UploadExamModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
      />
      
      <ViewExamModal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)}
        exam={selectedExam}
      />
    </div>
  );
};
