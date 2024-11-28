import { MutableRefObject } from 'react';
import { LevelConfig } from '@/types/game'; // Adjust import path as needed

interface DrawItemsProps {
    ctx: CanvasRenderingContext2D;
    levelConfig?: LevelConfig;
    imagesRef?: MutableRefObject<{
      platform?: HTMLImageElement;
      floor?: HTMLImageElement;
      door?: HTMLImageElement;
      obstacle?: HTMLImageElement;
      player1?: HTMLImageElement;
      player1WalkingSprite?: HTMLImageElement;
      player2?: HTMLImageElement;
      player2WalkingSprite?: HTMLImageElement;
    }>;
    currentTime?: number;
    obstacleFrameWidth?: number;
    obstacleCurrentFrame?: number;
    player1Pos?: { x: number; y: number };
    player1IsMoving?: boolean;
    player1Direction?: string;
    player1CurrentFrame?: number;
    player2Pos?: { x: number; y: number };
    player2IsMoving?: boolean;
    player2Direction?: string;
    player2CurrentFrame?: number;
    playerRadius?: number;
    playerDiameter?: number;
    player1FrameWidth?: number;
    player2FrameWidth?: number;
    frameHeight?: number;
  }


//draw platforms
export const drawPlatforms = ({ ctx, levelConfig, imagesRef }: DrawItemsProps) => {
  levelConfig?.platforms?.forEach(platform => {
    if (imagesRef?.current.platform) {
      ctx.drawImage(
        imagesRef.current.platform,
        platform.x,
        platform.y,
        platform.width || 120,
        platform.height || 50
      );
    }
  });
};

//draw floor
export const drawFloor = ({ ctx, levelConfig, imagesRef }: DrawItemsProps) => {
  levelConfig?.floor.forEach(floor => {
    const floorImage = imagesRef?.current.floor;
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
};

//draw door
export const drawDoor = ({ ctx, levelConfig, imagesRef, currentTime = 0 }: DrawItemsProps) => {
    if (imagesRef?.current.door && levelConfig) {
      // Bouncing door animation
      const bounceOffset = Math.sin(currentTime / 500) * 10; // Adjust the speed and height of the bounce
      ctx.drawImage(
        imagesRef.current.door,
        levelConfig.doorPosition.x,
        levelConfig.doorPosition.y + bounceOffset,
        50, // door width
        100 // door height
      );
  
      // Radial gradient effect around the door
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
    }
};
  
//draw obstacles
export const drawObstacles = ({ 
    ctx, 
    levelConfig, 
    imagesRef, 
    obstacleFrameWidth = 64, // Default frame width, adjust as needed
    obstacleCurrentFrame = 0 
  }: DrawItemsProps) => {
    const obstacleImage = imagesRef?.current.obstacle;
    
    if (obstacleImage) {
      levelConfig?.obstacles.forEach((obstacle) => {
        ctx.drawImage(
          obstacleImage,
          obstacleCurrentFrame * obstacleFrameWidth, // source x (animated frame)
          0, // source y
          obstacleFrameWidth, // source width
          obstacleImage.height, // source height
          obstacle.x, // destination x
          obstacle.y, // destination y
          obstacle.size, // destination width
          obstacle.size // destination height
        );
      });
    }
};

//draw player1
export const drawPlayer1 = ({
    ctx, 
    imagesRef, 
    player1Pos = { x: 64, y: 64 }, 
    player1IsMoving, 
    player1Direction, 
    player1CurrentFrame = 64,
    player1FrameWidth = 64, 
    frameHeight = 64, 
    playerRadius = 64, 
    playerDiameter = 64
  }: DrawItemsProps) => {
    if (imagesRef?.current.player1WalkingSprite && imagesRef.current.player1) {
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
};
  
//draw player2
export const drawPlayer2 = ({
    ctx, 
    imagesRef, 
    player2Pos, 
    player2IsMoving, 
    player2Direction, 
    player2CurrentFrame = 64, 
    player2FrameWidth = 64, // Default value
    frameHeight = 64, // Default value 
    playerRadius = 64, 
    playerDiameter = 64
  }: DrawItemsProps) => {
    if (imagesRef?.current.player2WalkingSprite && imagesRef.current.player2) {
      if (player2IsMoving) {
        ctx.save();
        if (player2Direction === "left") {
          ctx.scale(-1, 1);
          ctx.translate(-player2Pos!.x * 2, 0);
        }
        ctx.drawImage(
          imagesRef.current.player2WalkingSprite,
          player2CurrentFrame! * player2FrameWidth,
          0,
          player2FrameWidth,
          frameHeight,
          player2Pos!.x - playerRadius - 15,
          player2Pos!.y - playerRadius - 35,
          playerDiameter + 10,
          playerDiameter + 50
        );
        ctx.restore();
      } else {
        ctx.save();
        if (player2Direction === "left") {
          ctx.scale(-1, 1);
          ctx.translate(-player2Pos!.x * 2, 0);
        }
        ctx.drawImage(
          imagesRef.current.player2,
          player2Pos!.x - playerRadius - 15,
          player2Pos!.y - playerRadius - 35,
          playerDiameter + 10,
          playerDiameter + 30
        );
        ctx.restore();
      }
    }
};
  
//draw lighting effect on player1
export const drawLightingEffectPlayer1 = ({
    ctx,
    player1Pos = { x: 64, y: 64 }
}: DrawItemsProps) => {
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
}