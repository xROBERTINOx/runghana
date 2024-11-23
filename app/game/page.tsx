"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getLevel, MAX_LEVEL } from '@/config/levels';
import type { Position, Platform, Obstacle } from '@/types/game';

const Game = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [player1Pos, setPlayer1Pos] = useState<Position & { vy: number }>(
    { ...getLevel(1).player1Start, vy: 0 }
  );
  const [player2Pos, setPlayer2Pos] = useState<Position & { vy: number }>(
    { ...getLevel(1).player2Start, vy: 0 }
  );
  const [gameOver, setGameOver] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  
  const playerDiameter = 50;
  const playerRadius = playerDiameter / 2;
  const goalSize = 40;
  const gravity = 0.8;
  const jumpForce = -15;
  const moveSpeed = 5;
  
  const levelConfig = getLevel(currentLevel);

  // Physics update loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    
    const updatePhysics = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 16.67; // Normalize to ~60fps
      lastTime = currentTime;

      if (!gameOver && !levelComplete) {
        // Update player 1
        setPlayer1Pos(prev => {
          const newPos = { ...prev };
          
          // Apply horizontal movement
          if (keysPressed.has('d')) newPos.x += moveSpeed * deltaTime;
          if (keysPressed.has('a')) newPos.x -= moveSpeed * deltaTime;
          
          // Apply gravity
          newPos.vy += gravity * deltaTime;
          newPos.y += newPos.vy * deltaTime;

          // Check collision with obstacles
          for (const obstacle of levelConfig.obstacles) {
            if (
              newPos.x < obstacle.x + obstacle.size &&
              newPos.x + playerDiameter > obstacle.x &&
              newPos.y < obstacle.y + obstacle.size &&
              newPos.y + playerDiameter > obstacle.y
            ) {
              setGameOver(true);
            }
          }

          const onGround = checkPlatformCollisions(newPos);
          
          // Allow jumping only if on ground
          if (onGround && keysPressed.has('w') && newPos.vy >= 0) {
            newPos.vy = jumpForce;
          }
          
          // Constrain to game bounds
          newPos.x = Math.max(playerRadius, Math.min(levelConfig.gameFieldWidth - playerRadius, newPos.x));
          newPos.y = Math.max(playerRadius, Math.min(levelConfig.gameFieldHeight - playerRadius, newPos.y));
          
          return newPos;
        });

        // Update player 2 (similar logic as player 1)
        setPlayer2Pos(prev => {
          const newPos = { ...prev };
          
          // Move towards player 1 when 'd' or 'a' keys are pressed
          if (keysPressed.has('d') || keysPressed.has('a')) {
            if (player2Pos.x < player1Pos.x) {
              newPos.x += moveSpeed * deltaTime;
            } else if (player2Pos.x > player1Pos.x) {
              newPos.x -= moveSpeed * deltaTime;
            }
          }
          
          // Apply gravity
          newPos.vy += gravity * deltaTime;
          newPos.y += newPos.vy * deltaTime;

          // Add platform collision checks
          const onGround = checkPlatformCollisions(newPos);
          
          // Allow jumping only if on ground
          if (onGround && keysPressed.has('w') && newPos.vy >= 0) {
            newPos.vy = jumpForce;
          }
          
          // Constrain to game bounds
          newPos.x = Math.max(playerRadius, Math.min(levelConfig.gameFieldWidth - playerRadius, newPos.x));
          newPos.y = Math.max(playerRadius, Math.min(levelConfig.gameFieldHeight - playerRadius, newPos.y));

          return newPos;
        });
      }
      
      animationFrameId = requestAnimationFrame(updatePhysics);
    };
    
    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [keysPressed, gameOver, levelComplete, levelConfig]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysPressed(prev => new Set(prev).add(e.key));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed(prev => {
        const next = new Set(prev);
        next.delete(e.key);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Check collisions with platforms
  const checkPlatformCollisions = useCallback((position: Position & { vy: number }) => {
    let onGround = false;
    
    for (const platform of levelConfig.platforms) {
      // Check if player is within horizontal bounds of platform
      if (position.x + playerRadius > platform.x && 
          position.x - playerRadius < platform.x + platform.width) {
        
        // Check for collision from above
        if (position.vy > 0 && 
            position.y + playerRadius > platform.y && 
            position.y + playerRadius < platform.y + platform.height) {
          position.y = platform.y - playerRadius;
          position.vy = 0;
          onGround = true;
        }
        
        // Check for collision from below
        if (position.vy < 0 && 
            position.y - playerRadius < platform.y + platform.height && 
            position.y - playerRadius > platform.y) {
          position.y = platform.y + platform.height + playerRadius;
          position.vy = 0;
        }
      }
    }
    
    return onGround;
  }, [levelConfig]);

  // Check if players are touching
  const checkIfTouching = useCallback((pos1: Position, pos2: Position) => {
    const distance = Math.sqrt(
      Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2)
    );
    return distance < playerDiameter;
  }, []);

  // Check if blue player reached the goal
  const checkIfTouchingGoal = useCallback((position: Position) => {
    const goalCenter = levelConfig.goalPosition;
    const distance = Math.sqrt(
      Math.pow(position.x - (goalCenter.x + goalSize/2), 2) + 
      Math.pow(position.y - (goalCenter.y + goalSize/2), 2)
    );
    return distance <= (playerRadius + goalSize/2);
  }, [levelConfig]);

  // Check win/lose conditions
  useEffect(() => {
    if (checkIfTouching(player1Pos, player2Pos)) {
      setGameOver(true);
    }
    if (checkIfTouchingGoal(player1Pos)) {
      setLevelComplete(true);
    }
  }, [player1Pos, player2Pos, checkIfTouching, checkIfTouchingGoal]);

  const nextLevel = () => {
    if (currentLevel < MAX_LEVEL) {
      const newLevel = currentLevel + 1;
      setCurrentLevel(newLevel);
      const levelConfig = getLevel(newLevel);
      setPlayer1Pos({ ...levelConfig.player1Start, vy: 0 });
      setPlayer2Pos({ ...levelConfig.player2Start, vy: 0 });
      setGameOver(false);
      setLevelComplete(false);
    }
  };

  const resetLevel = () => {
    const levelConfig = getLevel(currentLevel);
    setPlayer1Pos({ ...levelConfig.player1Start, vy: 0 });
    setPlayer2Pos({ ...levelConfig.player2Start, vy: 0 });
    setGameOver(false);
    setLevelComplete(false);
  };

  const resetGame = () => {
    setCurrentLevel(1);
    const levelConfig = getLevel(1);
    setPlayer1Pos({ ...levelConfig.player1Start, vy: 0 });
    setPlayer2Pos({ ...levelConfig.player2Start, vy: 0 });
    setGameOver(false);
    setLevelComplete(false);
  };

  return (
    <div className="p-4">      
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-purple-600">Level {currentLevel}</h2>
        <p className="text-sm text-gray-600 mt-2">
          Blue Player: WSAD to move and jump | Red Player: Arrow keys to move and jump
        </p>
      </div>
      
      <div 
        className="relative bg-gray-100 rounded-lg mb-4 border-2 border-gray-300"
        style={{
          width: levelConfig.gameFieldWidth,
          height: levelConfig.gameFieldHeight
        }}
      >
        {/* Level Complete Alert */}
        {levelComplete && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <div className="space-y-4 text-center">
              <Alert className="bg-green-500 border-green-700">
                <AlertDescription className="text-white text-xl font-bold">
                  Level {currentLevel} Complete!
                </AlertDescription>
              </Alert>
              <div className="space-x-4">
                {currentLevel < MAX_LEVEL ? (
                  <button
                    onClick={nextLevel}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Next Level
                  </button>
                ) : (
                  <button
                    onClick={resetGame}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Play Again
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Game Over Alert */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <div className="space-y-4 text-center">
              <Alert className="bg-red-500 border-red-700">
                <AlertDescription className="text-white text-xl font-bold">
                  Game Over - Level {currentLevel}
                </AlertDescription>
              </Alert>
              <div className="space-x-4">
                <button
                  onClick={resetLevel}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Retry Level
                </button>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Reset to Level 1
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Goal Box */}
        <div 
          className="absolute bg-yellow-400 border-2 border-yellow-600"
          style={{
            left: levelConfig.goalPosition.x,
            top: levelConfig.goalPosition.y,
            width: goalSize,
            height: goalSize
          }}
        />

        {/* Platforms */}
        {levelConfig.platforms.map((platform, index) => (
          <div 
            key={index}
            className="absolute bg-gray-800"
            style={{
              left: platform.x,
              top: platform.y,
              width: platform.width,
              height: platform.height
            }}
          />
        ))}

        {/* Obstacles */}
        {levelConfig.obstacles.map((obstacle, index) => (
          <div 
            key={index}
            className="absolute bg-red-500"
            style={{
              left: obstacle.x,
              top: obstacle.y,
              width: obstacle.size,
              height: obstacle.size
            }}
          />
        ))}
        
        {/* Player 1 Circle (Blue) */}
        <div 
          className="absolute w-12 h-12 bg-blue-500 rounded-full transition-transform"
          style={{ 
            left: player1Pos.x - playerRadius,
            top: player1Pos.y - playerRadius
          }}
        />
        
        {/* Player 2 Circle (Red) */}
        <div 
          className="absolute w-12 h-12 bg-red-500 rounded-full transition-transform"
          style={{ 
            left: player2Pos.x - playerRadius,
            top: player2Pos.y - playerRadius
          }}
        />
      </div>
    </div>
  );
};

export default Game;