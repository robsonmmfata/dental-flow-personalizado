
import React, { useState } from 'react';
import { Users, Plus, User, Calendar, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PatientsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const patients = [
    { 
      id: 1, 
      name: 'Maria Silva', 
      email: 'maria@email.com', 
      phone: '(11) 99999-9999',
      lastVisit: '2024-01-10',
      nextAppointment: '2024-01-20',
      status: 'ativo'
    },
    { 
      id: 2, 
      name: 'João Santos', 
      email: 'joao@email.com', 
      phone: '(11) 88888-8888',
      lastVisit: '2024-01-08',
      nextAppointment: null,
      status: 'ativo'
    },
    { 
      id: 3, 
      name: 'Ana Costa', 
      email: 'ana@email.com', 
      phone: '(11) 77777-7777',
      lastVisit: '2023-12-15',
      nextAppointment: '2024-01-25',
      status: 'inativo'
    },
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-600 mt-1">Gerencie o cadastro de pacientes</p>
        </div>
        <Button className="bg-dental-gold hover:bg-dental-gold-dark text-white">
          <Plus size={16} className="mr-2" />
          Novo Paciente
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users size={18} />
              Lista de Pacientes
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Buscar paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              />
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="border border-gray-200 rounded-lg p-4 hover:bg-dental-cream/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-dental-gold/20 rounded-full flex items-center justify-center">
                      <User size={20} className="text-dental-gold" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-600">{patient.email}</div>
                      <div className="text-sm text-gray-600">{patient.phone}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Última consulta</div>
                      <div className="font-medium text-gray-900">
                        {new Date(patient.lastVisit).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Próxima consulta</div>
                      <div className="font-medium text-gray-900">
                        {patient.nextAppointment 
                          ? new Date(patient.nextAppointment).toLocaleDateString('pt-BR')
                          : 'Não agendada'
                        }
                      </div>
                    </div>
                    
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        patient.status === 'ativo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.status}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-dental-gold border-dental-gold hover:bg-dental-gold hover:text-white">
                        <Calendar size={14} className="mr-1" />
                        Agendar
                      </Button>
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white">
                        <FileImage size={14} className="mr-1" />
                        Orçamento
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
