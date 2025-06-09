
import React from 'react';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  FileImage, 
  FileText,
  Settings, 
  User, 
  LogOut,
  BarChart3,
  UserCog
} from 'lucide-react';

interface DentalSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

export const DentalSidebar: React.FC<DentalSidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  onLogout 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'agendamento', label: 'Agendamento', icon: Calendar },
    { id: 'pacientes', label: 'Pacientes', icon: Users },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'orcamentos', label: 'Orçamentos', icon: FileText },
    { id: 'exames', label: 'Exames', icon: FileImage },
    { id: 'usuarios', label: 'Usuários', icon: UserCog },
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="w-24 h-16 mx-auto mb-2">
          <img 
            src="/lovable-uploads/a2ae9abc-d670-4c90-942c-c97d169a8824.png" 
            alt="Espaço Sorriso" 
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-sm text-gray-600 text-center">Sistema de Gestão</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-dental-gold text-white'
                      : 'text-gray-700 hover:bg-dental-cream/50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
};
