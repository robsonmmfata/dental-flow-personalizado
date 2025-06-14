-- Criação do usuário assistente no Supabase Auth
-- Atenção: A senha deve ser criptografada pelo Supabase, este comando é para uso via API ou painel

-- Como não é possível criar usuário diretamente via SQL no Supabase Auth,
-- você deve usar a API do Supabase para criar o usuário com email e senha.

-- Exemplo de script em JavaScript para criar o usuário:

/*
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://weylieuzfkbnwhyxqdm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndleWxpZXV6ZmtibndoeW14cWRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NzUxMjIsImV4cCI6MjA2NTQ1MTEyMn0.YL7qdqIOnUXk4mhS8WsN1Di0zTiuxikUF0i2bHnaBHA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'assistente@dentalcare.com',
    password: '123456',
    email_confirm: true,
  });

  if (error) {
    console.error('Erro ao criar usuário:', error);
  } else {
    console.log('Usuário criado:', data);
  }
}

createUser();
*/

-- Alternativamente, crie o usuário manualmente no painel do Supabase em Authentication > Users.
