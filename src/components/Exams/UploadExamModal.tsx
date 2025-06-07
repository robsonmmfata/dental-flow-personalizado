
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileImage } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadExamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadExamModal: React.FC<UploadExamModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientName: '',
    examType: '',
    date: new Date().toISOString().split('T')[0],
    observations: '',
    files: [] as File[]
  });

  const examTypes = [
    'Radiografia Panorâmica',
    'Radiografia Periapical',
    'Tomografia',
    'Documentação Ortodôntica',
    'Fotografias Clínicas',
    'Exame Periodontal',
    'Moldagem',
    'Outros'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({...formData, files});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Novo exame adicionado:', {
      ...formData,
      id: Date.now(),
      status: 'concluido',
      files: formData.files.map(f => f.name)
    });
    
    toast({
      title: "Exame adicionado!",
      description: `Exame de ${formData.patientName} foi adicionado com sucesso.`,
    });
    
    // Reset form
    setFormData({
      patientName: '',
      examType: '',
      date: new Date().toISOString().split('T')[0],
      observations: '',
      files: []
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload size={20} className="text-dental-gold" />
            Adicionar Novo Exame
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Paciente</label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Exame</label>
              <select
                value={formData.examType}
                onChange={(e) => setFormData({...formData, examType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
                required
              >
                <option value="">Selecione o tipo</option>
                {examTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data do Exame</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Arquivos do Exame</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-dental-gold transition-colors">
              <FileImage size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Arraste arquivos aqui ou clique para selecionar</p>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="w-full opacity-0 absolute inset-0 cursor-pointer"
              />
              <Button type="button" variant="outline" className="relative">
                Selecionar Arquivos
              </Button>
            </div>
            {formData.files.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Arquivos selecionados:</p>
                <ul className="text-sm text-dental-gold">
                  {formData.files.map((file, index) => (
                    <li key={index}>• {file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea
              value={formData.observations}
              onChange={(e) => setFormData({...formData, observations: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              rows={4}
              placeholder="Observações sobre o exame..."
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-dental-gold hover:bg-dental-gold-dark text-white">
              Adicionar Exame
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
