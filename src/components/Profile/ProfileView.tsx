
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Camera, Save, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const ProfileView: React.FC = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Dr. João Silva',
    email: 'joao.silva@dentalcare.com',
    phone: '(11) 99999-9999',
    cro: 'CRO-SP 12345',
    specialty: 'Clínico Geral',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    birthDate: '1985-03-15',
    bio: 'Dentista especializado em odontologia geral com mais de 10 anos de experiência.',
    workingHours: {
      start: '08:00',
      end: '18:00',
      lunch: '12:00-13:00'
    }
  });

  const handleSave = () => {
    console.log('Salvando perfil:', profileData);
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Uploading image:', file.name);
      toast({
        title: "Foto atualizada!",
        description: "Sua foto de perfil foi alterada.",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-1">Gerencie suas informações pessoais e profissionais</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-dental-gold hover:bg-dental-gold-dark text-white">
                <Save size={16} className="mr-2" />
                Salvar
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-dental-gold hover:bg-dental-gold-dark text-white">
              <Edit3 size={16} className="mr-2" />
              Editar Perfil
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-r from-dental-gold to-dental-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={48} className="text-white" />
                </div>
                {isEditing && (
                  <label className="absolute bottom-2 right-2 bg-dental-gold rounded-full p-2 cursor-pointer hover:bg-dental-gold-dark transition-colors">
                    <Camera size={16} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-gray-900">{profileData.name}</h2>
              <p className="text-dental-gold font-medium">{profileData.specialty}</p>
              <p className="text-sm text-gray-600 mt-1">{profileData.cro}</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail size={16} />
                <span className="text-sm">{profileData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={16} />
                <span className="text-sm">{profileData.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={16} />
                <span className="text-sm">{profileData.address}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar size={16} />
                <span className="text-sm">
                  Nascimento: {new Date(profileData.birthDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de nascimento</label>
                <input
                  type="date"
                  value={profileData.birthDate}
                  onChange={(e) => setProfileData({...profileData, birthDate: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Profissionais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CRO</label>
                <input
                  type="text"
                  value={profileData.cro}
                  onChange={(e) => setProfileData({...profileData, cro: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
                <select
                  value={profileData.specialty}
                  onChange={(e) => setProfileData({...profileData, specialty: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="Clínico Geral">Clínico Geral</option>
                  <option value="Ortodontia">Ortodontia</option>
                  <option value="Endodontia">Endodontia</option>
                  <option value="Periodontia">Periodontia</option>
                  <option value="Implantodontia">Implantodontia</option>
                  <option value="Cirurgia">Cirurgia</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário de início</label>
                <input
                  type="time"
                  value={profileData.workingHours.start}
                  onChange={(e) => setProfileData({
                    ...profileData, 
                    workingHours: {...profileData.workingHours, start: e.target.value}
                  })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário de término</label>
                <input
                  type="time"
                  value={profileData.workingHours.end}
                  onChange={(e) => setProfileData({
                    ...profileData, 
                    workingHours: {...profileData.workingHours, end: e.target.value}
                  })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Biografia profissional</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dental-gold disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Descreva sua experiência e especialidades..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
