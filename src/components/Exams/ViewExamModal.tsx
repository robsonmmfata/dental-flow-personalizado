
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Download, User, Calendar, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ViewExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: any;
}

export const ViewExamModal: React.FC<ViewExamModalProps> = ({ isOpen, onClose, exam }) => {
  const { toast } = useToast();

  const handleDownload = () => {
    console.log('Baixando exame:', exam?.fileName);
    toast({
      title: "Download iniciado!",
      description: `Fazendo download de ${exam?.fileName}`,
    });
  };

  if (!exam) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye size={20} className="text-dental-gold" />
            Visualizar Exame
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-dental-cream/30 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User size={16} />
                  Informações do Paciente
                </h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Nome:</span> {exam.patient}</div>
                  <div><span className="font-medium">Tipo de Exame:</span> {exam.type}</div>
                  <div><span className="font-medium">Descrição:</span> {exam.description}</div>
                </div>
              </div>
              
              <div className="bg-dental-gold/10 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar size={16} />
                  Detalhes do Exame
                </h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Data:</span> {new Date(exam.date).toLocaleDateString('pt-BR')}</div>
                  <div><span className="font-medium">Profissional:</span> {exam.doctor}</div>
                  <div><span className="font-medium">Arquivo:</span> {exam.fileName}</div>
                  <div><span className="font-medium">Tamanho:</span> {exam.fileSize}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Visualização do arquivo</p>
                <p className="text-sm text-gray-500 mb-4">{exam.fileName}</p>
                <p className="text-xs text-gray-400">
                  {exam.type === 'Raio-X' && 'Imagem radiográfica'}
                  {exam.type === 'Tomografia' && 'Arquivo DICOM'}
                  {exam.type === 'Foto Intraoral' && 'Fotografia intraoral'}
                  {exam.type === 'Foto Extraoral' && 'Fotografia extraoral'}
                  {exam.type === 'Moldagem' && 'Arquivo 3D'}
                  {exam.type === 'Outros' && 'Arquivo anexo'}
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={handleDownload}
                  className="flex-1 bg-dental-gold hover:bg-dental-gold-dark text-white"
                >
                  <Download size={16} className="mr-2" />
                  Baixar Arquivo
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Observações</h4>
            <p className="text-gray-600 text-sm">
              {exam.notes || 'Nenhuma observação adicional registrada para este exame.'}
            </p>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
