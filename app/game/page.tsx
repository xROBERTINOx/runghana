"use client";
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const Game = () => {
  const [player1Pos, setPlayer1Pos] = useState({ x: 100, y: 100 });
  const [player2Pos, setPlayer2Pos] = useState({ x: 300, y: 100 });
  const [gameOver, setGameOver] = useState(false);
  const playerDiameter = 50;
  const playerRadius = 1/2*playerDiameter;
  
  const obstacle = {
    x: 250,
    y: 200,
    width: 100,
    height: 100
  };

  useEffect(() => {
    checkIfTouching(player1Pos, player2Pos);
  }, [player1Pos, player2Pos]);

  const checkCollision = (position: { x: number; y: number }) => {
    const closestX = Math.max(obstacle.x, Math.min(position.x, obstacle.x + obstacle.width));
    const closestY = Math.max(obstacle.y, Math.min(position.y, obstacle.y + obstacle.height));    
    const distanceX = position.x - closestX;
    const distanceY = position.y - closestY;
    const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    return distanceSquared < (playerRadius * playerRadius);
  };
  
  const checkIfTouching = (player1Pos: { x: number, y: number }, player2Post: { x: number, y: number }) => {
    if ((Math.sqrt((player2Pos.x-player1Pos.x)**2 + (player2Pos.y-player1Pos.y)**2)) <= 40) {
      setGameOver(true);
    }
  }

  const moveCharacters = (direction: string) => {
    if (gameOver) return; // Prevent movement if game is over
    
    const step = 15;
    
    setPlayer1Pos(prev => {
      const newPos = { ...prev };
      switch (direction) {
        case 'up':
          newPos.y = Math.max(25, prev.y - step);
          break;
        case 'down':
          newPos.y = Math.min(375, prev.y + step);
          break;
        case 'left':
          newPos.x = Math.max(25, prev.x - step);
          break;
        case 'right':
          newPos.x = Math.min(575, prev.x + step);
          break;
        default:
          return prev;
      }
      return checkCollision(newPos) ? prev : newPos;
    });

    setPlayer2Pos(prev => {
      const newPos = { ...prev };
      switch (direction) {
        case 'up':
          newPos.y = Math.max(25, prev.y - step);
          break;
        case 'down':
          newPos.y = Math.min(375, prev.y + step);
          break;
        case 'left':
          newPos.x = Math.max(25, prev.x - step);
          break;
        case 'right':
          newPos.x = Math.min(575, prev.x + step);
          break;
        default:
          return prev;
      }
      return checkCollision(newPos) ? prev : newPos;
    });
  };

  const resetGame = () => {
    setPlayer1Pos({ x: 100, y: 100 });
    setPlayer2Pos({ x: 300, y: 100 });
    setGameOver(false);
  };

  return (
    <div className="p-4">      
      <div className="relative w-[600px] h-[400px] bg-gray-100 rounded-lg mb-4 border-2 border-gray-300">
        {/* Game Over Alert */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <div className="space-y-4 text-center">
              <Alert className="bg-red-500 border-red-700">
                <AlertDescription className="text-white text-xl font-bold">
                  Game Over - You Lost!
                </AlertDescription>
              </Alert>
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
        
        {/* Obstacle */}
        <div 
          className="absolute bg-black"
          style={{
            left: obstacle.x,
            top: obstacle.y,
            width: obstacle.width,
            height: obstacle.height
          }}
        />
        
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

      {/* Controls */}
      <div className="flex justify-center">
        <div className="space-y-2">
          <h3 className="font-bold text-gray-700 mb-2 text-center">Controls</h3>
          <div className="grid grid-cols-3 gap-2 w-36">
            <button 
              onClick={() => moveCharacters('left')}
              className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={gameOver}
            >
              ←
            </button>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => moveCharacters('up')}
                className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={gameOver}
              >
                ↑
              </button>
              <button 
                onClick={() => moveCharacters('down')}
                className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={gameOver}
              >
                ↓
              </button>
            </div>
            <button 
              onClick={() => moveCharacters('right')}
              className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={gameOver}
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