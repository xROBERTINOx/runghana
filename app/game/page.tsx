"use client";
import React, { useState } from 'react';

const Game = () => {
  const [player1Pos, setPlayer1Pos] = useState({ x: 100, y: 100 });
  const [player2Pos, setPlayer2Pos] = useState({ x: 300, y: 100 });
  
  const moveCharacters = (direction: string) => {
    const step = 20;
    
    setPlayer1Pos(prev => {
      switch (direction) {
        case 'up':
          return { ...prev, y: Math.max(25, prev.y - step) };
        case 'down':
          return { ...prev, y: Math.min(375, prev.y + step) };
        case 'left':
          return { ...prev, x: Math.max(25, prev.x - step) };
        case 'right':
          return { ...prev, x: Math.min(575, prev.x + step) };
        default:
          return prev;
      }
    });

    setPlayer2Pos(prev => {
      switch (direction) {
        case 'up':
          return { ...prev, y: Math.max(25, prev.y - step) };
        case 'down':
          return { ...prev, y: Math.min(375, prev.y + step) };
        case 'left':
          return { ...prev, x: Math.max(25, prev.x - step) };
        case 'right':
          return { ...prev, x: Math.min(575, prev.x + step) };
        default:
          return prev;
      }
    });
  };

  return (
    <div className="p-4">
      <div className="relative w-[600px] h-[400px] bg-gray-100 rounded-lg mb-4 border-2 border-gray-300">
        {/* Player 1 Circle */}
        <div 
          className="absolute w-12 h-12 bg-blue-500 rounded-full transition-all duration-200"
          style={{ 
            left: player1Pos.x - 25,
            top: player1Pos.y - 25
          }}
        />
        
        {/* Player 2 Circle */}
        <div 
          className="absolute w-12 h-12 bg-red-500 rounded-full transition-all duration-200"
          style={{ 
            left: player2Pos.x - 25,
            top: player2Pos.y - 25
          }}
        />
      </div>

      {/* Single Set of Controls */}
      <div className="flex justify-center">
        <div className="space-y-2">
          <h3 className="font-bold text-gray-700 mb-2 text-center">Controls</h3>
          <div className="grid grid-cols-3 gap-2 w-36">
            <button 
              onClick={() => moveCharacters('left')}
              className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              ←
            </button>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => moveCharacters('up')}
                className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                ↑
              </button>
              <button 
                onClick={() => moveCharacters('down')}
                className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                ↓
              </button>
            </div>
            <button 
              onClick={() => moveCharacters('right')}
              className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;