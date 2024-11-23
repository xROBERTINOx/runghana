"use client";
import React, { useState, useEffect } from 'react';
const Game = () => {
  const [player1Pos, setPlayer1Pos] = useState({ x: 100, y: 100 });
  const [player2Pos, setPlayer2Pos] = useState({ x: 300, y: 100 });
  const playerRadius = 50;
  
  // Define obstacle properties
  const obstacle = {
    x: 250,
    y: 200,
    width: 100,
    height: 100
  };

  //check for touching whenever positions updates
  useEffect(() => {
    checkIfTouching(player1Pos,player2Pos);
  }, [player1Pos,player2Pos]);

  // Check if a position collides with the obstacle
  const checkCollision = (position: { x: number; y: number }) => {

    // Check if any point of the circle overlaps with the rectangle
    const closestX = Math.max(obstacle.x, Math.min(position.x, obstacle.x + obstacle.width));
    const closestY = Math.max(obstacle.y, Math.min(position.y, obstacle.y + obstacle.height));    

    // Calculate distance between closest point and circle center
    const distanceX = position.x - closestX;
    const distanceY = position.y - closestY;
    
    const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    return distanceSquared < (playerRadius * playerRadius);
  };
  
  const checkIfTouching = (player1Pos: { x: number, y: number }, player2Post: { x: number, y: number }) => {
    if (((player1Pos.x-player2Pos.x) < playerRadius && (player1Pos.x-player2Pos.x) > -playerRadius) && ((player1Pos.y-player2Pos.y) < playerRadius && (player1Pos.y-player2Pos.y) > -playerRadius)) {
      console.log("Touching");
    } 
  }

  const moveCharacters = (direction: string) => {
    const step = 20;
    
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

  return (
    <div className="p-4">
      <div className="relative w-[600px] h-[400px] bg-gray-100 rounded-lg mb-4 border-2 border-gray-300">
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