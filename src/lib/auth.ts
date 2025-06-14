
import { supabase } from './supabaseClient';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return null;
  }

  // Buscar dados adicionais do usuário na tabela custom_users
  const { data: userData, error } = await supabase
    .from('custom_users')
    .select('*')
    .eq('email', session.user.email)
    .single();

  if (error || !userData) {
    return null;
  }

  return {
    id: session.user.id,
    email: userData.email,
    role: userData.role || 'assistant'
  };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const signUp = async (email: string, password: string, name?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || ''
      }
    }
  });

  if (!error && data.user) {
    // Criar registro na tabela custom_users
    await supabase
      .from('custom_users')
      .insert([{
        email,
        password, // Em produção, isso deve ser hash
        name: name || '',
        role: 'assistant'
      }]);
  }

  return { data, error };
};
