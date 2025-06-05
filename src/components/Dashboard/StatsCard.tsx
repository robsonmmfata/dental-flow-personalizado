
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'gold' | 'sage' | 'nude';
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  color = 'gold' 
}) => {
  const colorClasses = {
    gold: 'from-dental-gold/20 to-dental-gold-light/10 border-dental-gold/30',
    sage: 'from-dental-sage/20 to-dental-sage/10 border-dental-sage/30',
    nude: 'from-dental-nude/40 to-dental-nude/20 border-dental-nude'
  };

  const iconColors = {
    gold: 'text-dental-gold',
    sage: 'text-dental-sage',
    nude: 'text-dental-gold-dark'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 hover:shadow-lg transition-all duration-300 animate-fade-in`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs. mês anterior</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-white/50 ${iconColors[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};
