
import React, { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '../../lib/supabaseClient';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from('custom_users')
        .select('*')
        .eq('email', formData.email)
        .single();

      if (error || !data) {
        toast({
          title: "Erro no login",
          description: "Email ou senha incorretos.",
          variant: "destructive"
        });
        return;
      }

      if (data.password !== formData.password) {
        toast({
          title: "Erro no login",
          description: "Email ou senha incorretos.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Login realizado!",
        description: `Bem-vinda, ${formData.email}!`,
      });
      onLoginSuccess();
    } catch (err) {
      toast({
        title: "Erro no login",
        description: "Erro inesperado ao tentar logar.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dental-cream via-dental-nude to-dental-gold flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-32 h-20 mx-auto mb-4 flex items-center justify-center">
              <img 
                src="/lovable-uploads/a2ae9abc-d670-4c90-942c-c97d169a8824.png" 
                alt="Espaço Sorriso" 
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-gray-600 mt-1">Sistema de Gestão Odontológica</p>
          </div>

          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">Acesso do Sistema:</p>
            <p className="text-xs text-blue-600">assistente@dentalcare.com - 123456</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
                placeholder="assistente@dentalcare.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold pr-12"
                  placeholder="Sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-dental-gold"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-dental-gold hover:bg-dental-gold-dark text-white py-3 mt-6"
            >
              <LogIn size={16} className="mr-2" />
              Entrar no Sistema
            </Button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Sistema desenvolvido para clínicas odontológicas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
