
-- Tabela settings: salva as configurações gerais do sistema (1 linha por clínica)
CREATE TABLE IF NOT EXISTS public.settings (
  id SERIAL PRIMARY KEY,
  clinic_name TEXT NOT NULL,
  clinic_phone TEXT NOT NULL,
  clinic_email TEXT NOT NULL,
  clinic_address TEXT NOT NULL,
  working_days TEXT[] NOT NULL,
  working_hours_start TEXT NOT NULL,
  working_hours_end TEXT NOT NULL,

  notifications_email BOOLEAN NOT NULL DEFAULT true,
  notifications_sms BOOLEAN NOT NULL DEFAULT false,
  notifications_push BOOLEAN NOT NULL DEFAULT true,
  notifications_reminders BOOLEAN NOT NULL DEFAULT true,

  theme TEXT NOT NULL DEFAULT 'light',
  language TEXT NOT NULL DEFAULT 'pt-BR',
  date_format TEXT NOT NULL DEFAULT 'DD/MM/YYYY',

  auto_backup BOOLEAN NOT NULL DEFAULT true,
  backup_frequency TEXT NOT NULL DEFAULT 'daily',
  backup_retention TEXT NOT NULL DEFAULT '30'
);

-- Permite apenas um registro (configuração global)
CREATE UNIQUE INDEX IF NOT EXISTS only_one_settings_row ON public.settings((1));

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Permitir todo mundo ver e alterar (se necessário, depois podemos fazer políticas baseadas em usuários/admin)
CREATE POLICY "allow all crud on settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);
