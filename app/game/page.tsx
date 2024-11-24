"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getLevel, MAX_LEVEL } from '@/config/levels';
import type { Position, Platform, Obstacle } from '@/types/game';
import player1Image from '@/assets/player1.png';
import player2Image from '@/assets/player2.png';
import platformImage from '@/assets/platform1.png';
import player1SpriteSheetWalking from '@/assets/player1Walking.png';

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<{
    player1?: HTMLImageElement;
    player2?: HTMLImageElement;
    platform?: HTMLImageElement;
    walkingSprite?: HTMLImageElement;
  }>({});
  
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
  const [player1Direction, setPlayer1Direction] = useState<'left' | 'right'>('right');
  const [player1IsMoving, setPlayer1IsMoving] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const [lastFrameUpdate, setLastFrameUpdate] = useState(0);
  const frameUpdateInterval = 100;

  const playerDiameter = 50;
  const playerRadius = playerDiameter / 2;
  const goalSize = 40;
  const gravity = 0.8;
  const jumpForce = -15;
  const moveSpeed = 5;
  
  const levelConfig = getLevel(currentLevel);

  // Load images
  useEffect(() => {
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    Promise.all([
      loadImage(player1Image.src),
      loadImage(player2Image.src),
      loadImage(platformImage.src),
      loadImage(player1SpriteSheetWalking.src)
    ]).then(([player1Img, player2Img, platformImg, walkingSpritesheet]) => {
      imagesRef.current = {
        player1: player1Img,
        player2: player2Img,
        platform: platformImg,
        walkingSprite: walkingSpritesheet
      };
      setImagesLoaded(true);
    }).catch(error => {
      console.error('Error loading images:', error);
    });
  }, []);

  // Main game loop
  useEffect(() => {
    if (!imagesLoaded) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    const frameWidth = player1SpriteSheetWalking.width / 4;
    const frameHeight = 64;
    const numFrames = 4;

    const render = (currentTime: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const deltaTime = (currentTime - lastTime) / 16.67;
      lastTime = currentTime;

      if (player1IsMoving && currentTime - lastFrameUpdate > frameUpdateInterval) {
        setCurrentFrame(prev => (prev + 1) % numFrames);
        setLastFrameUpdate(currentTime);
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      ctx.fillStyle = '#1F2937';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw platforms
      levelConfig.platforms.forEach(platform => {
        if (imagesRef.current.platform) {
          ctx.drawImage(
            imagesRef.current.platform,
            platform.x,
            platform.y,
            120,
            50
          );
        }
      });

      // Draw obstacles
      levelConfig.obstacles.forEach(obstacle => {
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.size, obstacle.size);
      });

      // Draw goal
      ctx.fillStyle = '#FCD34D';
      ctx.fillRect(
        levelConfig.goalPosition.x,
        levelConfig.goalPosition.y,
        goalSize,
        goalSize
      );

      // Draw Player 1 (with walking animation)
      if (imagesRef.current.walkingSprite && imagesRef.current.player1) {
        if (player1IsMoving) {
          // Draw walking animation
          ctx.save();
          if (player1Direction === 'left') {
            ctx.scale(-1, 1);
            ctx.translate(-player1Pos.x * 2, 0);
          }
          ctx.drawImage(
            imagesRef.current.walkingSprite,
            currentFrame * frameWidth,
            0,
            frameWidth,
            frameHeight,
            player1Pos.x - playerRadius - 15,
            player1Pos.y - playerRadius - 15,
            playerDiameter + 30,
            playerDiameter + 30
          );
          ctx.restore();
        } else {
          // Draw standing sprite
          ctx.save();
          if (player1Direction === 'left') {
            ctx.scale(-1, 1);
            ctx.translate(-player1Pos.x * 2, 0);
          }
          ctx.drawImage(
            imagesRef.current.player1,
            player1Pos.x - playerRadius - 15,
            player1Pos.y - playerRadius - 15,
            playerDiameter + 30,
            playerDiameter + 30
          );
          ctx.restore();
        }
      }

      // Draw Player 2
      if (imagesRef.current.player2) {
        ctx.drawImage(
          imagesRef.current.player2,
          player2Pos.x - playerRadius,
          player2Pos.y - playerRadius,
          playerDiameter,
          playerDiameter
        );
      }

      // Add lighting effect
      const gradient = ctx.createRadialGradient(
        player1Pos.x,
        player1Pos.y,
        0,
        player1Pos.x,
        player1Pos.y,
        100
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(
        player1Pos.x - 100,
        player1Pos.y - 100,
        200,
        200
      );

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [player1Pos, player2Pos, levelConfig, player1IsMoving, currentFrame, player1Direction, imagesLoaded, lastFrameUpdate]);


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

  // Physics update loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    
    const updatePhysics = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 16.67;
      lastTime = currentTime;

      if (!gameOver && !levelComplete) {
        // Update player 1
        setPlayer1Pos(prev => {
          const newPos = { ...prev };
          let isMoving = false;

          // Apply horizontal movement
          if (keysPressed.has('d')) {
            newPos.x += moveSpeed * deltaTime;
            isMoving = true;
            setPlayer1Direction('right');
          }
          if (keysPressed.has('a')) {
            newPos.x -= moveSpeed * deltaTime;
            isMoving = true;
            setPlayer1Direction('left');
          }

          setPlayer1IsMoving(isMoving);
          
          // Apply gravity
          newPos.vy += gravity * deltaTime;
          newPos.y += newPos.vy * deltaTime;

          // Platform collisions
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

        // Update player 2
        setPlayer2Pos(prev => {
          const newPos = { ...prev };
          
          if (keysPressed.has('d') || keysPressed.has('a')) {
            if (player2Pos.x < player1Pos.x) {
              newPos.x += moveSpeed * deltaTime;
            } else if (player2Pos.x > player1Pos.x) {
              newPos.x -= moveSpeed * deltaTime;
            }
          }
          
          newPos.vy += gravity * deltaTime;
          newPos.y += newPos.vy * deltaTime;

          checkPlatformCollisions(newPos);
          
          newPos.x = Math.max(playerRadius, Math.min(levelConfig.gameFieldWidth - playerRadius, newPos.x));
          newPos.y = Math.max(playerRadius, Math.min(levelConfig.gameFieldHeight - playerRadius, newPos.y));

          return newPos;
        });

        // Check win/lose conditions
        if (checkIfTouching(player1Pos, player2Pos)) {
          setGameOver(true);
        }
        if (checkIfTouchingGoal(player1Pos)) {
          setLevelComplete(true);
        }
      }
      
      animationFrameId = requestAnimationFrame(updatePhysics);
    };
    
    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [keysPressed, gameOver, levelComplete, levelConfig, player1Pos.x, player2Pos.x]);

  // Rest of the utility functions remain the same...
  const checkPlatformCollisions = (position: Position & { vy: number }) => {
    let onGround = false;
    const platformWidth = 120;
    const platformHeight = 50;
    
    for (const platform of levelConfig.platforms) {
      if (position.x + playerRadius > platform.x && 
          position.x - playerRadius < platform.x + platformWidth) {
        
        if (position.vy > 0 && 
            position.y + playerRadius > platform.y && 
            position.y + playerRadius < platform.y + platformHeight) {
          position.y = platform.y - playerRadius;
          position.vy = 0;
          onGround = true;
        }
        
        if (position.vy < 0 && 
            position.y - playerRadius < platform.y + platformHeight && 
            position.y - playerRadius > platform.y) {
          position.y = platform.y + platformHeight + playerRadius;
          position.vy = 0;
        }
      }
    }
    
    return onGround;
  };

  const checkIfTouching = (pos1: Position, pos2: Position) => {
    const distance = Math.sqrt(
      Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2)
    );
    return distance < playerDiameter;
  };

  const checkIfTouchingGoal = (position: Position) => {
    const goalCenter = levelConfig.goalPosition;
    const distance = Math.sqrt(
      Math.pow(position.x - (goalCenter.x + goalSize/2), 2) + 
      Math.pow(position.y - (goalCenter.y + goalSize/2), 2)
    );
    return distance <= (playerRadius + goalSize/2);
  };

  // Game state management functions
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
    <div className="p-4 absolute relative [image-rendering:pixelated]">      
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-purple-600">Level {currentLevel}</h2>
        <p className="text-sm text-gray-600 mt-2">
          Blue Player: WSAD to move and jump | Red Player: Arrow keys to move and jump
        </p>
      </div>
      
      <div className="relative">
      <div className="absolute inset-0 bg-black opacity-40"></div>
        <canvas
          ref={canvasRef}
          width={levelConfig.gameFieldWidth}
          height={levelConfig.gameFieldHeight}
          className="rounded-lg border-2 border-gray-300"
        />

        {levelComplete && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="space-y-4 text-center">
              <Alert className="bg-green-500 border-green-700">
                <AlertDescription className="text-white text-lg">
                  Level Complete! 🎉
                </AlertDescription>
              </Alert>
              {currentLevel < MAX_LEVEL ? (
                <button
                  onClick={nextLevel}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Next Level
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-white text-lg font-bold">
                    Congratulations! You've completed all levels! 🏆
                  </p>
                  <button
                    onClick={resetGame}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="space-y-4 text-center">
              <Alert className="bg-red-500 border-red-700">
                <AlertDescription className="text-white text-lg">
                  Game Over! Players collided! 💥
                </AlertDescription>
              </Alert>
              <button
                onClick={resetLevel}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!imagesLoaded && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <p className="text-white text-lg">Loading game assets...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
