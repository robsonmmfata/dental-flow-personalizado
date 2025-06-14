
import React, { useState } from 'react';
import { Stethoscope, Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { NewDoctorModal } from './NewDoctorModal';
import { EditDoctorModal } from './EditDoctorModal';
import { doctorStore, Doctor } from '@/stores/doctorStore';

export const DoctorsView: React.FC = () => {
  const { toast } = useToast();
  const [showNewDoctorModal, setShowNewDoctorModal] = useState(false);
  const [showEditDoctorModal, setShowEditDoctorModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);

  React.useEffect(() => {
    async function fetchDoctors() {
      try {
        const doctorsData = await doctorStore.getAllDoctors();
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Erro ao buscar doutores:', error);
        setDoctors([]);
      }
    }
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.cro.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = async (doctorId: number) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      try {
        const updatedDoctor = await doctorStore.updateDoctor(doctorId, {
          status: doctor.status === 'ativo' ? 'inativo' : 'ativo'
        });
        
        if (updatedDoctor) {
          const doctorsData = await doctorStore.getAllDoctors();
          setDoctors(doctorsData);
          toast({
            title: "Status atualizado!",
            description: `${doctor.name} foi ${doctor.status === 'ativo' ? 'desativado' : 'ativado'} com sucesso.`,
          });
        }
      } catch (error) {
        console.error('Erro ao atualizar status do doutor:', error);
        toast({
          title: "Erro ao atualizar status",
          description: "Não foi possível atualizar o status do doutor. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteDoctor = async (doctorId: number) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor && window.confirm(`Tem certeza que deseja excluir ${doctor.name}?`)) {
      try {
        await doctorStore.deleteDoctor(doctorId);
        const doctorsData = await doctorStore.getAllDoctors();
        setDoctors(doctorsData);
        toast({
          title: "Doutor excluído!",
          description: `${doctor.name} foi removido do sistema.`,
        });
      } catch (error) {
        console.error('Erro ao excluir doutor:', error);
        toast({
          title: "Erro ao excluir doutor",
          description: "Não foi possível excluir o doutor. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddDoctor = async (newDoctorData: Omit<Doctor, 'id' | 'createdAt'>) => {
    try {
      const newDoctor = await doctorStore.addDoctor(newDoctorData);
      const doctorsData = await doctorStore.getAllDoctors();
      setDoctors(doctorsData);
      toast({
        title: "Doutor cadastrado!",
        description: `${newDoctor.name} foi adicionado ao sistema.`,
      });
    } catch (error) {
      console.error('Erro ao cadastrar doutor:', error);
      toast({
        title: "Erro ao cadastrar doutor",
        description: "Não foi possível cadastrar o doutor. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditDoctor = async (doctorData: Omit<Doctor, 'id' | 'createdAt'>) => {
    if (selectedDoctor) {
      try {
        const updatedDoctor = await doctorStore.updateDoctor(selectedDoctor.id, doctorData);
        if (updatedDoctor) {
          const doctorsData = await doctorStore.getAllDoctors();
          setDoctors(doctorsData);
          toast({
            title: "Doutor atualizado!",
            description: `${updatedDoctor.name} foi atualizado com sucesso.`,
          });
        }
      } catch (error) {
        console.error('Erro ao atualizar doutor:', error);
        toast({
          title: "Erro ao atualizar doutor",
          description: "Não foi possível atualizar o doutor. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const openEditModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowEditDoctorModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doutores</h1>
          <p className="text-gray-600 mt-1">Gerencie os dentistas da clínica</p>
        </div>
        <Button 
          onClick={() => setShowNewDoctorModal(true)}
          className="bg-dental-gold hover:bg-dental-gold-dark text-white"
        >
          <Plus size={16} className="mr-2" />
          Novo Doutor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Doutores</p>
              <p className="text-2xl font-bold text-dental-gold">{doctors.length}</p>
            </div>
            <Stethoscope size={24} className="text-dental-gold" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Doutores Ativos</p>
              <p className="text-2xl font-bold text-green-600">
                {doctors.filter(d => d.status === 'ativo').length}
              </p>
            </div>
            <UserCheck size={24} className="text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Especialidades</p>
              <p className="text-2xl font-bold text-blue-600">
                {new Set(doctors.map(d => d.specialty)).size}
              </p>
            </div>
            <Stethoscope size={24} className="text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Stethoscope size={18} />
              Lista de Doutores
            </h3>
            <input
              type="text"
              placeholder="Buscar doutor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
            />
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="border border-gray-200 rounded-lg p-4 hover:bg-dental-cream/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-dental-gold/20 rounded-full flex items-center justify-center">
                      <Stethoscope size={20} className="text-dental-gold" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{doctor.name}</div>
                      <div className="text-sm text-gray-600">{doctor.cro}</div>
                      <div className="text-sm text-gray-600">{doctor.specialty}</div>
                      <div className="text-sm text-gray-600">{doctor.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Status</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doctor.status === 'ativo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {doctor.status}
                      </span>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Telefone</div>
                      <div className="font-medium text-gray-900">{doctor.phone}</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openEditModal(doctor)}
                        className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                      >
                        <Edit size={14} className="mr-1" />
                        Editar
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleToggleStatus(doctor.id)}
                        className={doctor.status === 'ativo' 
                          ? "text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                          : "text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                        }
                      >
                        {doctor.status === 'ativo' ? <UserX size={14} className="mr-1" /> : <UserCheck size={14} className="mr-1" />}
                        {doctor.status === 'ativo' ? 'Desativar' : 'Ativar'}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteDoctor(doctor.id)}
                        className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <Stethoscope size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'Nenhum doutor encontrado' : 'Nenhum doutor cadastrado'}
              </p>
            </div>
          )}
        </div>
      </div>

      <NewDoctorModal 
        isOpen={showNewDoctorModal} 
        onClose={() => setShowNewDoctorModal(false)}
        onSave={handleAddDoctor}
      />

      <EditDoctorModal 
        isOpen={showEditDoctorModal} 
        onClose={() => {
          setShowEditDoctorModal(false);
          setSelectedDoctor(null);
        }}
        onSave={handleEditDoctor}
        doctor={selectedDoctor}
      />
    </div>
  );
};
