
import React, { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Palette, Database, Mail, Save, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type SettingsRecord = {
  id: number;
  clinic_name: string;
  clinic_phone: string;
  clinic_email: string;
  clinic_address: string;
  working_days: string[];
  working_hours_start: string;
  working_hours_end: string;
  notifications_email: boolean;
  notifications_sms: boolean;
  notifications_push: boolean;
  notifications_reminders: boolean;
  theme: string;
  language: string;
  date_format: string;
  auto_backup: boolean;
  backup_frequency: string;
  backup_retention: string;
};

const emptySettings: SettingsRecord = {
  id: 0,
  clinic_name: '',
  clinic_phone: '',
  clinic_email: '',
  clinic_address: '',
  working_days: [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday'
  ],
  working_hours_start: '08:00',
  working_hours_end: '18:00',
  notifications_email: true,
  notifications_sms: false,
  notifications_push: true,
  notifications_reminders: true,
  theme: 'light',
  language: 'pt-BR',
  date_format: 'DD/MM/YYYY',
  auto_backup: true,
  backup_frequency: 'daily',
  backup_retention: '30',
};

export const SettingsView: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingsRecord>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carregar configurações do Supabase ao montar
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('settings').select('*').order('id', {ascending: true}).limit(1).maybeSingle();
      if (data) setSettings(data as SettingsRecord);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // Se já existe, faz update, senão faz insert (padrão: um só registro)
    const { data: existing } = await supabase.from('settings').select('id').limit(1).maybeSingle();
    let res;
    if (existing && existing.id) {
      res = await supabase.from('settings').update({
        clinic_name: settings.clinic_name,
        clinic_phone: settings.clinic_phone,
        clinic_email: settings.clinic_email,
        clinic_address: settings.clinic_address,
        working_days: settings.working_days,
        working_hours_start: settings.working_hours_start,
        working_hours_end: settings.working_hours_end,
        notifications_email: settings.notifications_email,
        notifications_sms: settings.notifications_sms,
        notifications_push: settings.notifications_push,
        notifications_reminders: settings.notifications_reminders,
        theme: settings.theme,
        language: settings.language,
        date_format: settings.date_format,
        auto_backup: settings.auto_backup,
        backup_frequency: settings.backup_frequency,
        backup_retention: settings.backup_retention,
      }).eq('id', existing.id);
    } else {
      res = await supabase.from('settings').insert({
        clinic_name: settings.clinic_name,
        clinic_phone: settings.clinic_phone,
        clinic_email: settings.clinic_email,
        clinic_address: settings.clinic_address,
        working_days: settings.working_days,
        working_hours_start: settings.working_hours_start,
        working_hours_end: settings.working_hours_end,
        notifications_email: settings.notifications_email,
        notifications_sms: settings.notifications_sms,
        notifications_push: settings.notifications_push,
        notifications_reminders: settings.notifications_reminders,
        theme: settings.theme,
        language: settings.language,
        date_format: settings.date_format,
        auto_backup: settings.auto_backup,
        backup_frequency: settings.backup_frequency,
        backup_retention: settings.backup_retention,
      });
    }
    setSaving(false);
    if (!res.error) {
      toast({
        title: "Configurações salvas!",
        description: "Todas as alterações foram aplicadas com sucesso.",
      });
    } else {
      toast({
        title: "Erro ao salvar",
        description: res.error.message || "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    }
  };

  const handleBackup = () => {
    toast({
      title: "Backup iniciado!",
      description: "O backup dos dados está sendo gerado.",
    });
  };

  const handleRestore = () => {
    toast({
      title: "Restauração iniciada!",
      description: "Os dados estão sendo restaurados.",
    });
  };

  const weekDays = [
    { id: 'monday', label: 'Segunda-feira' },
    { id: 'tuesday', label: 'Terça-feira' },
    { id: 'wednesday', label: 'Quarta-feira' },
    { id: 'thursday', label: 'Quinta-feira' },
    { id: 'friday', label: 'Sexta-feira' },
    { id: 'saturday', label: 'Sábado' },
    { id: 'sunday', label: 'Domingo' },
  ];

  if (loading)
    return (
      <div className="p-6 text-gray-500">Carregando configurações...</div>
    );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-1">Personalize o sistema conforme suas necessidades</p>
        </div>
        <Button onClick={handleSave} className="bg-dental-gold hover:bg-dental-gold-dark text-white" disabled={saving}>
          <Save size={16} className="mr-2" />
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações da Clínica */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Settings size={20} className="text-dental-gold" />
            Informações da Clínica
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da clínica</label>
              <input
                type="text"
                value={settings.clinic_name}
                onChange={(e) => setSettings({ ...settings, clinic_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                type="tel"
                value={settings.clinic_phone}
                onChange={(e) => setSettings({ ...settings, clinic_phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={settings.clinic_email}
                onChange={(e) => setSettings({ ...settings, clinic_email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
              <textarea
                value={settings.clinic_address}
                onChange={(e) => setSettings({ ...settings, clinic_address: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              />
            </div>
          </div>
        </div>

        {/* Horários de Funcionamento */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Horários de Funcionamento</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Abertura</label>
                <input
                  type="time"
                  value={settings.working_hours_start}
                  onChange={(e) => setSettings({
                    ...settings,
                    working_hours_start: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fechamento</label>
                <input
                  type="time"
                  value={settings.working_hours_end}
                  onChange={(e) => setSettings({
                    ...settings,
                    working_hours_end: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Dias de funcionamento</label>
              <div className="space-y-2">
                {weekDays.map((day) => (
                  <label key={day.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.working_days.includes(day.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSettings({
                            ...settings,
                            working_days: [...settings.working_days, day.id]
                          });
                        } else {
                          setSettings({
                            ...settings,
                            working_days: settings.working_days.filter(d => d !== day.id)
                          });
                        }
                      }}
                      className="rounded border-gray-300 text-dental-gold focus:ring-dental-gold"
                    />
                    <span className="ml-2 text-sm text-gray-700">{day.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notificações */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell size={20} className="text-dental-gold" />
            Notificações
          </h3>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Notificações por e-mail</div>
                <div className="text-sm text-gray-600">Receba atualizações por e-mail</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications_email}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications_email: e.target.checked
                })}
                className="rounded border-gray-300 text-dental-gold focus:ring-dental-gold"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Notificações SMS</div>
                <div className="text-sm text-gray-600">Receba lembretes por SMS</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications_sms}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications_sms: e.target.checked
                })}
                className="rounded border-gray-300 text-dental-gold focus:ring-dental-gold"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Notificações Push</div>
                <div className="text-sm text-gray-600">Receba notificações push</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications_push}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications_push: e.target.checked
                })}
                className="rounded border-gray-300 text-dental-gold focus:ring-dental-gold"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Lembretes de consulta</div>
                <div className="text-sm text-gray-600">Enviar lembretes automáticos</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications_reminders}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications_reminders: e.target.checked
                })}
                className="rounded border-gray-300 text-dental-gold focus:ring-dental-gold"
              />
            </label>
          </div>
        </div>

        {/* Backup e Segurança */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Database size={20} className="text-dental-gold" />
            Backup e Segurança
          </h3>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Backup automático</div>
                <div className="text-sm text-gray-600">Fazer backup dos dados automaticamente</div>
              </div>
              <input
                type="checkbox"
                checked={settings.auto_backup}
                onChange={(e) => setSettings({
                  ...settings,
                  auto_backup: e.target.checked
                })}
                className="rounded border-gray-300 text-dental-gold focus:ring-dental-gold"
              />
            </label>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequência do backup</label>
              <select
                value={settings.backup_frequency}
                onChange={(e) => setSettings({
                  ...settings,
                  backup_frequency: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
              >
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button onClick={handleBackup} variant="outline" className="flex-1">
                <Download size={16} className="mr-2" />
                Fazer Backup
              </Button>
              <Button onClick={handleRestore} variant="outline" className="flex-1">
                <Upload size={16} className="mr-2" />
                Restaurar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
