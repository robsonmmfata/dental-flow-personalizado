
import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

// Usuários cadastrados (simulado - em produção seria um banco de dados)
const registeredUsers = [
  { email: 'admin@dentalcare.com', password: '123456', name: 'Dr. Admin', role: 'admin' },
  { email: 'dentista@dentalcare.com', password: '123456', name: 'Dr. Silva', role: 'dentist' },
  { email: 'assistente@dentalcare.com', password: '123456', name: 'Ana Costa', role: 'assistant' }
];

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    role: 'dentist'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Verificar login
      const user = registeredUsers.find(u => 
        u.email === formData.email && u.password === formData.password
      );
      
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        toast({
          title: "Login realizado!",
          description: `Bem-vindo, ${user.name}!`,
        });
        setTimeout(() => {
          onLoginSuccess();
        }, 1000);
      } else {
        toast({
          title: "Erro no login",
          description: "Email ou senha incorretos.",
          variant: "destructive"
        });
      }
    } else {
      // Cadastro
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Erro",
          description: "As senhas não coincidem",
          variant: "destructive"
        });
        return;
      }

      const newUser = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role
      };

      // Simular cadastro (em produção salvaria no banco)
      console.log('Novo usuário cadastrado:', newUser);
      
      toast({
        title: "Cadastro realizado!",
        description: "Conta criada com sucesso! Faça login para continuar.",
      });
      
      setIsLogin(true);
      setFormData({ email: '', password: '', name: '', confirmPassword: '', role: 'dentist' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dental-cream via-dental-nude to-dental-gold flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-dental-gold to-dental-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">🦷</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">DentalCare</h1>
            <p className="text-gray-600 mt-1">Sistema de Gestão Odontológica</p>
          </div>

          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                isLogin 
                  ? 'bg-dental-gold text-white shadow-sm' 
                  : 'text-gray-600 hover:text-dental-gold'
              }`}
            >
              <LogIn size={16} className="inline mr-2" />
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                !isLogin 
                  ? 'bg-dental-gold text-white shadow-sm' 
                  : 'text-gray-600 hover:text-dental-gold'
              }`}
            >
              <UserPlus size={16} className="inline mr-2" />
              Cadastro
            </button>
          </div>

          {isLogin && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">Usuários de teste:</p>
              <p className="text-xs text-blue-600">admin@dentalcare.com - 123456</p>
              <p className="text-xs text-blue-600">dentista@dentalcare.com - 123456</p>
              <p className="text-xs text-blue-600">assistente@dentalcare.com - 123456</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
                  placeholder="Seu nome completo"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
                placeholder="seu@email.com"
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

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar senha</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
                    placeholder="Confirme sua senha"
                    required={!isLogin}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold"
                  >
                    <option value="admin">Administrador</option>
                    <option value="dentist">Dentista</option>
                    <option value="assistant">Assistente</option>
                  </select>
                </div>
              </>
            )}

            <Button 
              type="submit" 
              className="w-full bg-dental-gold hover:bg-dental-gold-dark text-white py-3 mt-6"
            >
              {isLogin ? 'Entrar' : 'Criar conta'}
            </Button>
          </form>

          {isLogin && (
            <div className="text-center mt-4">
              <a href="#" className="text-sm text-dental-gold hover:text-dental-gold-dark">
                Esqueceu sua senha?
              </a>
            </div>
          )}

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
