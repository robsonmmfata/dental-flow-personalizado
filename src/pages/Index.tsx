
import React, { useState } from 'react';
import { DentalSidebar } from '@/components/Layout/DentalSidebar';
import { DashboardView } from '@/components/Dashboard/DashboardView';
import { SchedulingView } from '@/components/Scheduling/SchedulingView';
import { PatientsView } from '@/components/Patients/PatientsView';
import { FinancialView } from '@/components/Financial/FinancialView';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'agendamento':
        return <SchedulingView />;
      case 'pacientes':
        return <PatientsView />;
      case 'financeiro':
        return <FinancialView />;
      case 'exames':
        return <div className="p-6"><h1 className="text-3xl font-bold">Exames</h1><p>Módulo em desenvolvimento...</p></div>;
      case 'perfil':
        return <div className="p-6"><h1 className="text-3xl font-bold">Perfil</h1><p>Módulo em desenvolvimento...</p></div>;
      case 'configuracoes':
        return <div className="p-6"><h1 className="text-3xl font-bold">Configurações</h1><p>Módulo em desenvolvimento...</p></div>;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dental-cream to-white flex">
      <DentalSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
