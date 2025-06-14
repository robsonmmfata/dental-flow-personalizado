
import React, { useState } from 'react';
import { DentalSidebar } from '@/components/Layout/DentalSidebar';
import { DashboardView } from '@/components/Dashboard/DashboardView';
import { SchedulingView } from '@/components/Scheduling/SchedulingView';
import { PatientsView } from '@/components/Patients/PatientsView';
import { DoctorsView } from '@/components/Doctors/DoctorsView';
import { FinancialView } from '@/components/Financial/FinancialView';
import { BudgetsView } from '@/components/Budgets/BudgetsView';
import { ExamsView } from '@/components/Exams/ExamsView';
import { UsersView } from '@/components/Users/UsersView';
import { ProfileView } from '@/components/Profile/ProfileView';
import { SettingsView } from '@/components/Settings/SettingsView';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { Wifi, WifiOff } from 'lucide-react';

interface IndexProps {
  onLogout: () => void;
}

const Index: React.FC<IndexProps> = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { isConnected } = useRealtimeData();

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'agendamento':
        return <SchedulingView />;
      case 'pacientes':
        return <PatientsView />;
      case 'doutores':
        return <DoctorsView />;
      case 'financeiro':
        return <FinancialView />;
      case 'orcamentos':
        return <BudgetsView />;
      case 'exames':
        return <ExamsView />;
      case 'usuarios':
        return <UsersView />;
      case 'perfil':
        return <ProfileView />;
      case 'configuracoes':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dental-cream to-white flex">
      <DentalSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        onLogout={onLogout}
      />
      <div className="flex-1 overflow-auto">
        {/* Indicador de conexão em tempo real */}
        <div className="fixed top-4 right-4 z-50">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
            isConnected 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {isConnected ? (
              <>
                <Wifi size={16} />
                Conectado
              </>
            ) : (
              <>
                <WifiOff size={16} />
                Desconectado
              </>
            )}
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
