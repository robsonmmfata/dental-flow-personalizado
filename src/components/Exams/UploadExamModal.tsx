
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileImage, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadExamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadExamModal: React.FC<UploadExamModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patient: '',
    type: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    doctor: 'Dr. João Silva',
    notes: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const examTypes = ['Raio-X', 'Tomografia', 'Foto Intraoral', 'Foto Extraoral', 'Moldagem', 'Outros'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Novo exame:', { ...formData, files: selectedFiles });
    toast({
      title: "Exame adicionado!",
      description: `${selectedFiles.length} arquivo(s) enviado(s) para ${formData.patient}`,
    });
    onClose();
    setFormData({
      patient: '', type: '', description: '', 
      date: new Date().toISOString().split('T')[0], 
      doctor: 'Dr. João Silva', notes: ''
    });
    setSelectedFiles([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload size={20} className="text-dental-gold" />
            Adicionar Exame
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paciente *</label>
              <input
                type="text"
                value={formData.patient}
                onChange={(e) => setFormData({...formData, patient: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
                placeholder="Nome do paciente"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
                required
              >
                <option value="">Selecione o tipo</option>
                {examTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
                placeholder="Descrição do exame"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profissional</label>
              <select
                value={formData.doctor}
                onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              >
                <option value="Dr. João Silva">Dr. João Silva</option>
                <option value="Dra. Maria Santos">Dra. Maria Santos</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Arquivos *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-dental-gold transition-colors">
              <FileImage size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Arraste arquivos aqui ou clique para selecionar</p>
              <p className="text-sm text-gray-500 mb-4">Formatos aceitos: JPG, PNG, PDF, DICOM</p>
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf,.dcm,.dicom"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <Button type="button" variant="outline" asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Selecionar Arquivos
                </label>
              </Button>
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Arquivos selecionados ({selectedFiles.length}):
                </p>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              rows={3}
              placeholder="Observações adicionais..."
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
