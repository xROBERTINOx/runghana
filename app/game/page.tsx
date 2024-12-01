"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { getLevel, MAX_LEVEL } from "@/config/levels";
import type { Position } from "@/types/game";
import player1Image from "@/assets/player1.png";
import player2Image from "@/assets/player2.png";
import platformImage from "@/assets/platform1.png";
import player1SpriteSheetWalking from "@/assets/player1Walking.png";
import player2SpriteSheetWalking from "@/assets/player2Walking.png";
import backgroundImage from "@/assets/background.png";
import floorImage from "@/assets/floor1.png";
import obstacleImage from "@/assets/obstacle1.png";
import gameOverImage from "@/assets/GAMEOVER.png";
import restartButtonImage from "@/assets/restartButton.png";
import doorImage from "@/assets/door.png";
import winScreenImage from "@/assets/winScreen.png";
import pauseImage from "@/assets/pause.png";
import resumeImage from "@/assets/resume.png";
import nextLevelImage from "@/assets/nextLevel.png";
import Cookies from 'js-cookie';
import menuImage from '@/assets/menu.png';
import { createKeyboardControls } from "@/components/keyboardControls";
// import { physicsController } from "@/components/physicsController";
import { updatePlayer1 } from "@/components/updatePlayer1";
import { updatePlayer2 } from "@/components/updatePlayer2"; //NEED TO UDPATE ALG FOR PLAYER 2 CONST MOVEMENT TOWARD PLAYER
import { checkPlayer1Collisions, checkPlatformCollision, checkFloorCollision } from "@/components/player1Checks";
import { drawPlatforms, drawFloor, drawDoor, drawObstacles, drawPlayer1, drawPlayer2, drawLightingEffectPlayer1 } from "@/components/drawItems";






const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const imagesRef = useRef<{
    player1?: HTMLImageElement;
    player2?: HTMLImageElement;
    platform?: HTMLImageElement;
    player1WalkingSprite?: HTMLImageElement;
    player2WalkingSprite?: HTMLImageElement;
    floor?: HTMLImageElement;
    obstacle?: HTMLImageElement;
    door?: HTMLImageElement;
    winScreen?: HTMLImageElement;
    pause?: HTMLImageElement;
    resume?: HTMLImageElement;
    menu?: HTMLImageElement;
  }>({});
  
  


  const [player1Pos, setPlayer1Pos] = useState<Position & { vy: number }>(
    { ...getLevel(1).player1Start, vy: 0 }
  );
  const [player2Pos, setPlayer2Pos] = useState<Position & { 
    vy: number, 
    lastMoveTime?: number, 
    moveDirection?: 'left' | 'right' | 'jump' | 'none' 
  }>(
    { 
      ...getLevel(1).player2Start, 
      vy: 0,
      lastMoveTime: 0,
      moveDirection: 'none'
    }
  );
  
  const [gameOver, setGameOver] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [player1Direction, setPlayer1Direction] = useState<"left" | "right">("right");
  const [player2Direction, setPlayer2Direction] = useState<"left" | "right">("right");
  const [player1IsMoving, setPlayer1IsMoving] = useState(false);
  const [player2IsMoving, setPlayer2IsMoving] = useState(false);
  const [player1CurrentFrame, setPlayer1CurrentFrame] = useState(0);
  const [player2CurrentFrame, setPlayer2CurrentFrame] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [lastFrameUpdate, setLastFrameUpdate] = useState(0);
  const frameUpdateInterval = 100;
  // const [isObstacleTouched, setIsObstacleTouched] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [obstacleCurrentFrame, setObstacleCurrentFrame] = useState(0);

  const playerDiameter = 40;
  const playerRadius = playerDiameter / 2;
  const gravity = 0.98;
  const jumpForce = -18;
  const moveSpeed = 5;
  
  const levelConfig = getLevel(currentLevel);

  
  useEffect(() => {
    //load cookies
    const retVal = Number(Cookies.get('currentLevel') || 1);
    setCurrentLevel(retVal);
    
    //load images
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
      loadImage(player1SpriteSheetWalking.src),
      loadImage(player2SpriteSheetWalking.src),
      loadImage(floorImage.src),
      loadImage(obstacleImage.src),
      loadImage(doorImage.src),
      loadImage(winScreenImage.src),
      loadImage(pauseImage.src),
      loadImage(resumeImage.src),
      loadImage(menuImage.src),
    ]).then(([player1Img, player2Img, platformImg, player1WalkingSprite, player2WalkingSprite, floor, obstacle, doorImg, winScreenImg, pauseImg, resumeImg, menuImg]) => {
      imagesRef.current = {
        player1: player1Img,
        player2: player2Img,
        platform: platformImg,
        player1WalkingSprite: player1WalkingSprite,
        player2WalkingSprite: player2WalkingSprite,
        floor: floor,
        obstacle: obstacle,
        door: doorImg,
        winScreen: winScreenImg,
        pause: pauseImg,
        resume: resumeImg,
        menu: menuImg,
      };
      setImagesLoaded(true);
    }).catch(error => {
      console.error("Error loading images:", error);
    });
  }, []);


  // Main game loop
  useEffect(() => {
    
    if (!imagesLoaded) return;

    let animationFrameId: number;
    const player1FrameWidth = player1SpriteSheetWalking.width / 4;
    const player2FrameWidth = player2SpriteSheetWalking.width / 3;
    const frameHeight = 64;
    const player1NumFrames = 4;
    const player2NumFrames = 3;
    const obstacleFrameWidth = obstacleImage.width / 7;
    const obstacleNumFrames = 7;
    




    const render = (currentTime: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.imageSmoothingEnabled = false;

      if (isPaused) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if ((player1IsMoving || player2IsMoving || true) && currentTime - lastFrameUpdate > frameUpdateInterval) {
        setPlayer1CurrentFrame(prev => (prev + 1) % player1NumFrames);
        setPlayer2CurrentFrame(prev => (prev + 1) % player2NumFrames);
        
        // Add obstacle frame animation
        setObstacleCurrentFrame(prev => (prev + 1) % obstacleNumFrames);
        
        setPlayer2IsMoving(false);
        setLastFrameUpdate(currentTime);
      }
    

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw platforms
      drawPlatforms({
        ctx,
        levelConfig,
        imagesRef,
      })
      
      // Draw floor
      drawFloor({
        ctx,
        levelConfig,
        imagesRef,
      })
      
      //draw door
     drawDoor({
      ctx,
      levelConfig,
      imagesRef,
      currentTime: currentTime
     })

      // Draw obstacles
      drawObstacles({
        ctx,
        levelConfig,
        imagesRef,
        obstacleFrameWidth,
        obstacleCurrentFrame: obstacleCurrentFrame
      });

      // Draw Player 1 (with walking animation)      
      drawPlayer1({
        ctx,
        imagesRef,
        levelConfig,
        player1Pos,
        player1IsMoving,
        player1Direction,
        player1CurrentFrame,
        player1FrameWidth,
        frameHeight,
        playerRadius,
        playerDiameter
      });
  
      // Draw Player 2 (with walking animation)
      drawPlayer2({
        ctx,
        imagesRef,
        levelConfig,
        player2Pos,
        player2IsMoving,
        player2Direction,
        player2CurrentFrame,
        player2FrameWidth,
        frameHeight,
        playerRadius,
        playerDiameter
      });
    
      // Add lighting effect
      drawLightingEffectPlayer1({
        ctx,
        player1Pos,

      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [player1Pos, player2Pos, levelConfig, player1IsMoving, player2IsMoving, player1CurrentFrame, player2CurrentFrame, player1Direction, player2Direction, imagesLoaded, lastFrameUpdate]);


  // Keyboard controls
  useEffect(() => {
    const { handleKeyDown, handleKeyUp } = createKeyboardControls(setKeysPressed);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);


  // Physics update loop
  useEffect(() => {
    //check for collisions that will end the game
    checkPlayer1Collisions({
      player1Pos,
      player2Pos,
      playerDiameter,
      playerRadius,
      levelConfig,
      setGameOver,
      setLevelComplete
    });

    let animationFrameId: number;
    let lastTime = performance.now();

    const updatePhysics = (currentTime: number) => {
      if (isPaused) {
        animationFrameId = requestAnimationFrame(updatePhysics);
        return;
      }

      const deltaTime = (currentTime - lastTime) / 16.67;
      lastTime = currentTime;
  
      if (!gameOver && !levelComplete) {
        // Update player 1 movement
        setPlayer1Pos(prev => 
          updatePlayer1({
            prev,
            keysPressed,
            moveSpeed,
            deltaTime,
            gravity,
            jumpForce,
            playerRadius,
            levelConfig,
            setPlayer1Direction,
            setPlayer1IsMoving,
            checkPlatformCollisions,
            checkFloorCollisions
          })
        );
  
        // Update player 2 
        setPlayer2Pos(prev => 
          updatePlayer2({
            prev,
            moveSpeed,
            deltaTime,
            gravity,
            playerRadius,
            levelConfig,
            setPlayer2Direction,
            checkPlatformCollisions,
            checkFloorCollisions,
            keysPressed
          })
        );
        
      }
  
      animationFrameId = requestAnimationFrame(updatePhysics);
    };
  
    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [keysPressed, gameOver, levelComplete, levelConfig, player1Pos.x, player2Pos.x]);



  //  utility functions  !!Deal with fixing platform dimensions
  const checkPlatformCollisions = (player1Pos: Position & { vy: number }) => {
    return checkPlatformCollision({
      player1Pos,
      playerRadius,
      levelConfig
    })
  };

  const checkFloorCollisions = (player1Pos: Position & { vy: number }) => {
    return checkFloorCollision({
      player1Pos,
      playerRadius,
      levelConfig
    })
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
    Cookies.set('currentLevel', '1');
    setPlayer1Pos({ ...getLevel(1).player1Start, vy: 0 });
    setPlayer2Pos({ ...getLevel(1).player2Start, vy: 0 });
    setGameOver(false);
    setLevelComplete(false);
  };
  return (
    <div className="p-4 absolute relative [image-rendering:pixelated]">      
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-purple-600">Level {currentLevel}</h2>
        <p className="text-sm text-gray-600 mt-2">
          YOU: WSAD to move and jump, do not let your shadow get to the door before you or touch you!
        </p>
      </div>
      
      <div className="relative">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
  </div>
        <canvas
          ref={canvasRef}
          width={levelConfig.gameFieldWidth}
          height={levelConfig.gameFieldHeight}
          className="rounded-lg border-2 border-gray-300"
          style={{
            imageRendering: "pixelated", 
            width: levelConfig.gameFieldWidth + "px", 
            height: levelConfig.gameFieldHeight + "px",
            backgroundImage: `url(${backgroundImage.src})`,
            backgroundSize: "cover"
          }}
        />

{levelComplete && (
  <div className="absolute inset-0 flex items-center justify-center">
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
    </div>
    <img
      src={winScreenImage.src}
      alt="Level Complete"
      style={{
        width: '50%',
        height: '50%',
        objectFit: 'contain',
        zIndex: 30
      }}
    />
    <div className="absolute bottom-10 space-x-4" style={{ zIndex: 31 }}>
      <button
        onClick={() => {
          if (currentLevel < MAX_LEVEL) {
          setCurrentLevel(currentLevel + 1);
          Cookies.set('currentLevel', (currentLevel + 1).toString());
          resetLevel();
          } else {
            resetGame();
          }
        }}
        style={{ zIndex: 50, background: 'none', border: 'none' }} // Ensure the button is above the overlay and remove default styles
      >
        <img
          src={nextLevelImage.src}
          alt="Next Level"
          style={{
            width: '100px', // Adjust the size as needed
            height: '100px', // Adjust the size as needed
            objectFit: 'contain'
          }}
        />
      </button>
      <button
        onClick={resetGame}
        className="absolute bottom-10"
        style={{ zIndex: 50, background: 'none', border: 'none' }} // Ensure the button is above the overlay and remove default styles
      >
        <img
          src={restartButtonImage.src}
          alt="Restart Game"
          style={{
            width: '100px',
            height: '100px',
            objectFit: 'contain'
          }}
        />
      </button>
    </div>
  </div>
)}

{gameOver && (
  <div className="absolute inset-0 flex items-center justify-center">
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
    </div>
    <img
      src={gameOverImage.src}
      alt="Game Over"
      style={{
        width: "50%",
        height: "50%",
        objectFit: "contain",
        zIndex: 30 
      }}
    />
   
      <button
        onClick={resetLevel}
        className="absolute bottom-10"
        style={{ zIndex: 31, background: "none", border: "none" }} // Ensure the button is above the overlay and remove default styles
      >
      <img
        src={restartButtonImage.src}
        alt="Restart Level"
        style={{
          width: "100px", 
          height: "100px", 
          objectFit: "contain"
        }}
      />
      </button>
    
  </div>
)}


        {!imagesLoaded && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <p className="text-white text-lg">Loading game assets...</p>
          </div>
        )}
      </div>

      <button
  onClick={()=>setIsPaused(!isPaused)}
  className="absolute top-4 right-4"
  style={{ zIndex: 31, background: 'none', border: 'none' }} // Ensure the button is above the overlay and remove default styles
>
  <img
    src={isPaused ? resumeImage.src : pauseImage.src}
    alt={isPaused ? 'Resume' : 'Pause'}
    style={{
      width: '50px', // Adjust the size as needed
      height: '50px', // Adjust the size as needed
      objectFit: 'contain'
    }}
  />
</button>

<button
  onClick={() => router.push('/menu')}
  className="absolute top-4 right-20"
  style={{ zIndex: 31, background: 'none', border: 'none', color: 'white' }} // Ensure the button is above the overlay and remove default styles
>
  <img
    src={menuImage.src}
    style={{
      width: '50px',
      height: '50px',
      objectFit: 'contain'
    }}
  />
</button>


    </div>

    
  );
};

export default Game;
