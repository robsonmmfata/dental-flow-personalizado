
import React, { useState } from 'react';

interface Tooth {
  id: number;
  quadrant: number;
  position: number;
  selected: boolean;
}

interface OdontogramProps {
  selectedTeeth: number[];
  onToothSelect: (toothId: number) => void;
}

export const OdontogramComponent: React.FC<OdontogramProps> = ({ selectedTeeth, onToothSelect }) => {
  const teeth: Tooth[] = [
    // Quadrante 1 (superior direito)
    { id: 18, quadrant: 1, position: 8, selected: false },
    { id: 17, quadrant: 1, position: 7, selected: false },
    { id: 16, quadrant: 1, position: 6, selected: false },
    { id: 15, quadrant: 1, position: 5, selected: false },
    { id: 14, quadrant: 1, position: 4, selected: false },
    { id: 13, quadrant: 1, position: 3, selected: false },
    { id: 12, quadrant: 1, position: 2, selected: false },
    { id: 11, quadrant: 1, position: 1, selected: false },
    // Quadrante 2 (superior esquerdo)
    { id: 21, quadrant: 2, position: 1, selected: false },
    { id: 22, quadrant: 2, position: 2, selected: false },
    { id: 23, quadrant: 2, position: 3, selected: false },
    { id: 24, quadrant: 2, position: 4, selected: false },
    { id: 25, quadrant: 2, position: 5, selected: false },
    { id: 26, quadrant: 2, position: 6, selected: false },
    { id: 27, quadrant: 2, position: 7, selected: false },
    { id: 28, quadrant: 2, position: 8, selected: false },
    // Quadrante 3 (inferior esquerdo)
    { id: 38, quadrant: 3, position: 8, selected: false },
    { id: 37, quadrant: 3, position: 7, selected: false },
    { id: 36, quadrant: 3, position: 6, selected: false },
    { id: 35, quadrant: 3, position: 5, selected: false },
    { id: 34, quadrant: 3, position: 4, selected: false },
    { id: 33, quadrant: 3, position: 3, selected: false },
    { id: 32, quadrant: 3, position: 2, selected: false },
    { id: 31, quadrant: 3, position: 1, selected: false },
    // Quadrante 4 (inferior direito)
    { id: 41, quadrant: 4, position: 1, selected: false },
    { id: 42, quadrant: 4, position: 2, selected: false },
    { id: 43, quadrant: 4, position: 3, selected: false },
    { id: 44, quadrant: 4, position: 4, selected: false },
    { id: 45, quadrant: 4, position: 5, selected: false },
    { id: 46, quadrant: 4, position: 6, selected: false },
    { id: 47, quadrant: 4, position: 7, selected: false },
    { id: 48, quadrant: 4, position: 8, selected: false },
  ];

  const renderQuadrant = (quadrant: number) => {
    const quadrantTeeth = teeth.filter(tooth => tooth.quadrant === quadrant);
    const isUpper = quadrant === 1 || quadrant === 2;
    const isLeft = quadrant === 2 || quadrant === 3;
    
    return (
      <div className={`grid grid-cols-8 gap-1 ${isUpper ? 'mb-4' : 'mt-4'} ${isLeft ? 'order-2' : 'order-1'}`}>
        {quadrantTeeth.map((tooth) => (
          <button
            key={tooth.id}
            onClick={() => onToothSelect(tooth.id)}
            className={`w-8 h-8 border-2 rounded text-xs font-medium transition-all duration-200 ${
              selectedTeeth.includes(tooth.id)
                ? 'bg-dental-gold border-dental-gold-dark text-white shadow-md'
                : 'bg-white border-gray-300 text-gray-700 hover:border-dental-gold hover:bg-dental-cream/30'
            }`}
            title={`Dente ${tooth.id}`}
          >
            {tooth.id}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-dental-cream/20 p-6 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-900 mb-4 text-center">Odontograma - Selecione os Dentes</h4>
      
      <div className="max-w-md mx-auto">
        {/* Arcada Superior */}
        <div className="flex gap-2 justify-center">
          {renderQuadrant(1)}
          {renderQuadrant(2)}
        </div>
        
        {/* Linha central */}
        <div className="border-t border-gray-400 my-4"></div>
        
        {/* Arcada Inferior */}
        <div className="flex gap-2 justify-center">
          {renderQuadrant(4)}
          {renderQuadrant(3)}
        </div>
      </div>
      
      {selectedTeeth.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Dentes selecionados: <span className="font-medium text-dental-gold">{selectedTeeth.join(', ')}</span>
          </p>
        </div>
      )}
    </div>
  );
};
