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
import { checkPlayer1Collisions } from "@/components/player1Checks";






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
  const [player2Pos, setPlayer2Pos] = useState<Position & { vy: number }>(
    { ...getLevel(1).player2Start, vy: 0 }
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
  


  //useeffect for cookies
  
  

  const playerDiameter = 50;
  const playerRadius = playerDiameter / 2;
  const gravity = 0.8;
  const jumpForce = -15;
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

      // const deltaTime = (currentTime - lastTime) / 16.67;
      // lastTime = currentTime;

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

      // Draw background
      // ctx.fillStyle = "#1F2937";
      // ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw platforms
      levelConfig.platforms.forEach(platform => {
        if (imagesRef.current.platform) {
          ctx.drawImage(
            imagesRef.current.platform,
            platform.x,
            platform.y,
            platform.width || 120,
            platform.height || 50
          );
        }
      });
      
      // Draw floor
      // Draw floor
      levelConfig.floor.forEach(floor => {
        const floorImage = imagesRef.current.floor;
        if (floorImage) {
          // Get the natural width of the floor image
          const imageWidth = floorImage.width;
          // Calculate how many times we need to repeat the image
          const repetitions = Math.ceil(floor.width / imageWidth);
          
          // Draw the floor image repeatedly
          for (let i = 0; i < repetitions; i++) {
            const currentX = floor.x + (i * imageWidth);
            const remainingWidth = floor.width - (i * imageWidth);
            const width = Math.min(imageWidth, remainingWidth);
            
            ctx.drawImage(
              floorImage,
              0, // source x
              0, // source y
              width, // source width
              floorImage.height, // source height
              currentX, // destination x
              floor.y, // destination y
              width, // destination width
              floor.height // destination height
            );
          }
        }
      });
      
      //draw door
      if (imagesRef.current.door) {
        const bounceOffset = Math.sin(currentTime / 500) * 10; // Adjust the speed and height of the bounce
        ctx.drawImage(
          imagesRef.current.door,
          levelConfig.doorPosition.x,
          levelConfig.doorPosition.y + bounceOffset,
          50, // door width
          100 // door height
        );
      }

      const gradient4door = ctx.createRadialGradient(
        levelConfig.doorPosition.x,
        levelConfig.doorPosition.y,
        100,
        levelConfig.doorPosition.x,
        levelConfig.doorPosition.y,
        300
      );
      gradient4door.addColorStop(0, "rgba(255, 255, 255, 0.2)");
      gradient4door.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient4door;
      ctx.fillRect(
        levelConfig.doorPosition.x - 300,
        levelConfig.doorPosition.y - 300,
        600,
        600
      );


      // Draw obstacles
      levelConfig.obstacles.forEach((obstacle) => {
        if (imagesRef.current.obstacle) {
          ctx.drawImage(
            imagesRef.current.obstacle,
            obstacleCurrentFrame * obstacleFrameWidth, // Animated frame
            0,
            obstacleFrameWidth,
            obstacleImage.height,
            obstacle.x,
            obstacle.y,
            obstacle.size,
            obstacle.size
          );
        }
      
    
      });
    
    
      

      // Draw Player 1 (with walking animation)
      
      if (imagesRef.current.player1WalkingSprite && imagesRef.current.player1) {
        if (player1IsMoving) {
          ctx.save();
          if (player1Direction === "left") {
            ctx.scale(-1, 1);
            ctx.translate(-player1Pos.x * 2, 0);
          }
          ctx.drawImage(
            imagesRef.current.player1WalkingSprite,
            player1CurrentFrame * player1FrameWidth,
            0,
            player1FrameWidth,
            frameHeight,
            player1Pos.x - playerRadius - 15,
            player1Pos.y - playerRadius - 35,
            playerDiameter + 10,
            playerDiameter + 30
          );
          ctx.restore();
        } else {
          ctx.save();
          if (player1Direction === "left") {
            ctx.scale(-1, 1);
            ctx.translate(-player1Pos.x * 2, 0);
          }
          ctx.drawImage(
            imagesRef.current.player1,
            player1Pos.x - playerRadius - 15,
            player1Pos.y - playerRadius - 35,
            playerDiameter + 10,
            playerDiameter + 30
          );
          ctx.restore();
        }
      }

      // Draw Player 2 (with walking animation)
      if (imagesRef.current.player2WalkingSprite && imagesRef.current.player2) {
        if (player2IsMoving) {
          ctx.save();
          if (player2Direction === "left") {
            ctx.scale(-1, 1);
            ctx.translate(-player2Pos.x * 2, 0);
          }
          ctx.drawImage(
            imagesRef.current.player2WalkingSprite,
            player2CurrentFrame * player2FrameWidth,
            0,
            player2FrameWidth,
            frameHeight,
            player2Pos.x - playerRadius - 15,
            player2Pos.y - playerRadius - 35,
            playerDiameter + 10,
            playerDiameter + 50
          );
          ctx.restore();
        } else {
          ctx.save();
          if (player2Direction === "left") {
            ctx.scale(-1, 1);
            ctx.translate(-player2Pos.x * 2, 0);
          }
          ctx.drawImage(
            imagesRef.current.player2,
            player2Pos.x - playerRadius - 15,
            player2Pos.y - playerRadius - 35,
            playerDiameter + 10,
            playerDiameter + 30
          );
          ctx.restore();
        }
      }

      // Add lighting effect
      const gradient = ctx.createRadialGradient(
        player1Pos.x,
        player1Pos.y,
        0,
        player1Pos.x,
        player1Pos.y,
        300
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(
        player1Pos.x - 300,
        player1Pos.y - 300,
        600,
        600
      );

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
            keysPressed,
            player1Pos,
            player2Pos,
            moveSpeed,
            deltaTime,
            gravity,
            jumpForce,
            playerRadius,
            levelConfig,
            setPlayer2Direction,
            checkPlatformCollisions,
            checkFloorCollisions
          })
        );   
      }
  
      animationFrameId = requestAnimationFrame(updatePhysics);
    };
  
    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [keysPressed, gameOver, levelComplete, levelConfig, player1Pos.x, player2Pos.x]);



  //  utility functions 
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

  const checkFloorCollisions = (position: Position & { vy: number }) => {
    let onGround = false;
    
    for (const floor of levelConfig.floor) {
      // Check if player is within the floor"s x bounds
      if (position.x + playerRadius > floor.x && 
          position.x - playerRadius < floor.x + floor.width) {
        
        // Check if player is touching the top of the floor
        if (position.vy > 0 && 
            position.y + playerRadius > floor.y && 
            position.y + playerRadius < floor.y + floor.height) {
          position.y = floor.y - playerRadius;
          position.vy = 0;
          onGround = true;
        }
        
        // Check if player is hitting the bottom of the floor
        if (position.vy < 0 && 
            position.y - playerRadius < floor.y + floor.height && 
            position.y - playerRadius > floor.y) {
          position.y = floor.y + floor.height + playerRadius;
          position.vy = 0;
        }
      }
    }
    
    return onGround;
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
          YOU: WSAD to move and jump, do not let your shadow get you!
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
