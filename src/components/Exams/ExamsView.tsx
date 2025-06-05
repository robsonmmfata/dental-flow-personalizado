
import React, { useState } from 'react';
import { FileImage, Plus, Upload, Eye, Download, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UploadExamModal } from './UploadExamModal';
import { ViewExamModal } from './ViewExamModal';
import { useToast } from '@/hooks/use-toast';

export const ExamsView: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);

  const exams = [
    {
      id: 1,
      patient: 'Maria Silva',
      type: 'Raio-X',
      description: 'Raio-X Panorâmico',
      date: '2024-01-15',
      doctor: 'Dr. João Silva',
      fileName: 'rx_panoramico_maria.jpg',
      fileSize: '2.3 MB'
    },
    {
      id: 2,
      patient: 'João Santos',
      type: 'Foto Intraoral',
      description: 'Fotos de acompanhamento ortodôntico',
      date: '2024-01-14',
      doctor: 'Dra. Maria Santos',
      fileName: 'fotos_joao.zip',
      fileSize: '5.1 MB'
    },
    {
      id: 3,
      patient: 'Ana Costa',
      type: 'Tomografia',
      description: 'Tomografia para implante',
      date: '2024-01-10',
      doctor: 'Dr. João Silva',
      fileName: 'tomo_ana.dcm',
      fileSize: '15.8 MB'
    }
  ];

  const examTypes = ['Raio-X', 'Tomografia', 'Foto Intraoral', 'Foto Extraoral', 'Moldagem', 'Outros'];

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || exam.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleViewExam = (exam: any) => {
    setSelectedExam(exam);
    setShowViewModal(true);
  };

  const handleDownloadExam = (exam: any) => {
    console.log('Baixando exame:', exam.fileName);
    toast({
      title: "Download iniciado!",
      description: `Fazendo download de ${exam.fileName}`,
    });
  };

  const handleDeleteExam = (exam: any) => {
    console.log('Excluindo exame:', exam.id);
    toast({
      title: "Exame excluído!",
      description: `${exam.fileName} foi removido`,
      variant: "destructive"
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exames</h1>
          <p className="text-gray-600 mt-1">Gerencie exames e imagens dos pacientes</p>
        </div>
        <Button 
          onClick={() => setShowUploadModal(true)}
          className="bg-dental-gold hover:bg-dental-gold-dark text-white"
        >
          <Upload size={16} className="mr-2" />
          Adicionar Exame
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileImage size={18} />
              Lista de Exames
            </h3>
            <div className="flex gap-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              >
                <option value="">Todos os tipos</option>
                {examTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Buscar por paciente ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              />
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {filteredExams.map((exam) => (
              <div key={exam.id} className="border border-gray-200 rounded-lg p-4 hover:bg-dental-cream/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-dental-gold/20 rounded-lg flex items-center justify-center">
                      <FileImage size={20} className="text-dental-gold" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{exam.patient}</div>
                      <div className="text-sm text-gray-600">{exam.description}</div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        <span>Tipo: {exam.type}</span>
                        <span>•</span>
                        <span>{exam.doctor}</span>
                        <span>•</span>
                        <span>{new Date(exam.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Arquivo</div>
                      <div className="font-medium text-gray-900">{exam.fileName}</div>
                      <div className="text-xs text-gray-500">{exam.fileSize}</div>
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDownloadExam(exam)}
                        className="text-dental-gold border-dental-gold hover:bg-dental-gold hover:text-white"
                      >
                        <Download size={14} className="mr-1" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteExam(exam)}
                        className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredExams.length === 0 && (
            <div className="text-center py-12">
              <FileImage size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                {searchTerm || selectedType ? 'Nenhum exame encontrado' : 'Nenhum exame cadastrado'}
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
