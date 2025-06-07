
import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { NewUserModal } from './NewUserModal';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'dentist' | 'assistant';
  status: 'ativo' | 'inativo';
  createdAt: string;
  cro?: string;
}

export const UsersView: React.FC = () => {
  const { toast } = useToast();
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Dr. Admin',
      email: 'admin@dentalcare.com',
      role: 'admin',
      status: 'ativo',
      createdAt: '2024-01-01',
      cro: 'CRO-SP 12345'
    },
    {
      id: 2,
      name: 'Dr. Silva',
      email: 'dentista@dentalcare.com',
      role: 'dentist',
      status: 'ativo',
      createdAt: '2024-01-02',
      cro: 'CRO-SP 54321'
    },
    {
      id: 3,
      name: 'Ana Costa',
      email: 'assistente@dentalcare.com',
      role: 'assistant',
      status: 'ativo',
      createdAt: '2024-01-03'
    }
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'ativo' ? 'inativo' : 'ativo' }
        : user
    ));
    
    const user = users.find(u => u.id === userId);
    toast({
      title: "Status atualizado!",
      description: `${user?.name} foi ${user?.status === 'ativo' ? 'desativado' : 'ativado'} com sucesso.`,
    });
  };

  const handleDeleteUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user && window.confirm(`Tem certeza que deseja excluir ${user.name}?`)) {
      setUsers(users.filter(u => u.id !== userId));
      toast({
        title: "Usuário excluído!",
        description: `${user.name} foi removido do sistema.`,
      });
    }
  };

  const handleAddUser = (newUserData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...newUserData,
      id: Math.max(...users.map(u => u.id), 0) + 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setUsers([...users, newUser]);
    toast({
      title: "Usuário criado!",
      description: `${newUser.name} foi adicionado ao sistema.`,
    });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'dentist': return 'Dentista';
      case 'assistant': return 'Assistente';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'dentist': return 'bg-blue-100 text-blue-800';
      case 'assistant': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-600 mt-1">Gerencie dentistas e funcionários da clínica</p>
        </div>
        <Button 
          onClick={() => setShowNewUserModal(true)}
          className="bg-dental-gold hover:bg-dental-gold-dark text-white"
        >
          <Plus size={16} className="mr-2" />
          Novo Usuário
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Usuários</p>
              <p className="text-2xl font-bold text-dental-gold">{users.length}</p>
            </div>
            <Users size={24} className="text-dental-gold" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dentistas</p>
              <p className="text-2xl font-bold text-blue-600">
                {users.filter(u => u.role === 'dentist').length}
              </p>
            </div>
            <UserCheck size={24} className="text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Usuários Ativos</p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === 'ativo').length}
              </p>
            </div>
            <UserCheck size={24} className="text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users size={18} />
              Lista de Usuários
            </h3>
            <input
              type="text"
              placeholder="Buscar usuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
            />
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:bg-dental-cream/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-dental-gold/20 rounded-full flex items-center justify-center">
                      <Users size={20} className="text-dental-gold" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      {user.cro && (
                        <div className="text-sm text-gray-600">{user.cro}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Função</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Status</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'ativo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Cadastrado em</div>
                      <div className="font-medium text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleToggleStatus(user.id)}
                        className={user.status === 'ativo' 
                          ? "text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                          : "text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                        }
                      >
                        {user.status === 'ativo' ? <UserX size={14} className="mr-1" /> : <UserCheck size={14} className="mr-1" />}
                        {user.status === 'ativo' ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteUser(user.id)}
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
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
              </p>
            </div>
          )}
        </div>
      </div>

      <NewUserModal 
        isOpen={showNewUserModal} 
        onClose={() => setShowNewUserModal(false)}
        onSave={handleAddUser}
      />
    </div>
  );
};
