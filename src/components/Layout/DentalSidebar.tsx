
import React from 'react';
import { Calendar, DollarSign, Users, FileImage, BarChart3, Settings, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'agendamento', label: 'Agendamento', icon: Calendar },
  { id: 'pacientes', label: 'Pacientes', icon: Users },
  { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
  { id: 'exames', label: 'Exames', icon: FileImage },
  { id: 'perfil', label: 'Perfil', icon: User },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
];

export const DentalSidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, onLogout }) => {
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-dental-cream to-dental-nude shadow-lg flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-dental-gold to-dental-gold-light rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🦷</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">DentalCare</h1>
            <p className="text-xs text-gray-600">Sistema de Gestão</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-white/50",
                  activeSection === item.id 
                    ? "bg-dental-gold text-white shadow-md" 
                    : "text-gray-700 hover:text-dental-gold-dark"
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Usuário logado:</p>
          <p className="font-semibold text-gray-800">Dr. João Silva</p>
        </div>
        
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
        >
          <LogOut size={16} className="mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
};
