
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
// Removido import do Wifi e WifiOff

interface IndexProps {
  onLogout: () => void;
}

const Index: React.FC<IndexProps> = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  useRealtimeData(); // Mantém para manter funcionalidade em tempo real, mesmo sem o indicador

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
        {/* Removido indicador de conexão em tempo real */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
