import { Dispatch, SetStateAction } from 'react';
import { Platform, Floor, Obstacle } from "@/types/game";

interface UpdatePlayer2Props {
  prev: { 
    x: number; 
    y: number; 
    vy: number;
    allowHorizMovement?: boolean; // Add this to track horizontal movement state
  };
  player1Pos: { x: number; y: number };
  player2Pos: { x: number; y: number };
  moveSpeed: number;
  deltaTime: number;
  gravity: number;
  jumpForce: number;
  playerRadius: number;
  levelConfig: {
    gameFieldWidth: number;
    gameFieldHeight: number;
    obstacles: Obstacle[];
    doorPosition: { x: number; y: number };
    platforms: Platform[];
    floor: Floor[];
  };
  setPlayer2Direction: Dispatch<SetStateAction<'left' | 'right'>>;
  checkPlatformCollisions: (pos: { x: number; y: number; vy: number }) => boolean;
  checkFloorCollisions: (pos: { x: number; y: number; vy: number }) => boolean;
}

export const updatePlayer2 = ({
  prev,
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
}: UpdatePlayer2Props) => {
  // Create a new position object with the previous state, including allowHorizMovement
  const newPos = { 
    ...prev, 
    allowHorizMovement: prev.allowHorizMovement ?? true 
  };
  
  // Check current position status
  const onPlatform = checkPlatformCollisions(newPos);
  const onFloor = checkFloorCollisions(newPos);

  // Sort platforms by y-value in ascending order
  const sortedPlatforms = [...levelConfig.platforms].sort((a, b) => a.y - b.y);

  // Check if player 1 is on a platform or floor
  const player1OnPlatform = checkPlatformCollisions({ x: player1Pos.x, y: player1Pos.y, vy: 0 });
  const player1OnFloor = checkFloorCollisions({ x: player1Pos.x, y: player1Pos.y, vy: 0 });

  // Find the nearest platform with a lower y-value
  const findNearestLowerPlatform = (currentY: number) => {
    return sortedPlatforms
      .filter(platform => platform.y < currentY)
      .reduce((nearest, platform) => {
        if (!nearest) return platform;
        
        // Prioritize platforms closer to current y-value
        const currentDistance = currentY - platform.y;
        const nearestDistance = currentY - nearest.y;
        
        return currentDistance < nearestDistance ? platform : nearest;
      }, null as Platform | null);
  };

  // If player 1 is not on floor or platform
  if (!player1OnPlatform && !player1OnFloor) {
    const nearestLowerPlatform = findNearestLowerPlatform(player2Pos.y);

    if (nearestLowerPlatform) {
      // Determine horizontal direction towards platform
      const horizontalDirection = nearestLowerPlatform.x < player2Pos.x ? -1 : 1;
      
      // Check if close enough to platform to jump
      const distanceToPlatform = Math.abs(newPos.x - nearestLowerPlatform.x);
      
      // Move horizontally if allowed
      if (newPos.allowHorizMovement) {
        newPos.x += moveSpeed * 1.5 * deltaTime * horizontalDirection;
        setPlayer2Direction(horizontalDirection > 0 ? "left" : "right");
      }
      
      // Prepare for jump
      if ((onPlatform || onFloor) && distanceToPlatform < playerRadius * 5) {
        newPos.vy = jumpForce;
        // Disable horizontal movement when about to jump
        newPos.allowHorizMovement = false;
      }
    } else {
      // If no lower platform, move towards player 1
      const horizontalDirection = player2Pos.x < player1Pos.x ? 1 : -1;
      
      // Move horizontally if allowed
      if (newPos.allowHorizMovement) {
        newPos.x += moveSpeed * 1.5 * deltaTime * horizontalDirection;
        setPlayer2Direction(horizontalDirection > 0 ? "left" : "right");
      }
    }
  } else {
    // Vertical distance check for regular movement
    const verticalDistanceToPlayer1 = Math.abs(player2Pos.y - player1Pos.y);

    if (verticalDistanceToPlayer1 > 20) {
      // Find the nearest platform to current position
      const nearestPlatform = sortedPlatforms.find(platform => 
        platform.y > player2Pos.y || 
        Math.abs(platform.y - player2Pos.y) < 10
      );

      if (nearestPlatform) {
        // Determine horizontal movement towards platform
        const horizontalDirection = nearestPlatform.x < player2Pos.x ? -1 : 1;
        
        // Move horizontally if allowed
        if (newPos.allowHorizMovement) {
          newPos.x += moveSpeed * 1.5 * deltaTime * horizontalDirection;
          setPlayer2Direction(horizontalDirection > 0 ? "left" : "right");
        }

        // Check if close enough to platform to jump
        const distanceToPlatform = Math.abs(newPos.x - nearestPlatform.x);
        
        // Prepare for jump
        if ((onPlatform || onFloor) && distanceToPlatform < playerRadius * 5) {
          newPos.vy = jumpForce;
          // Disable horizontal movement when about to jump
          newPos.allowHorizMovement = false;
        }
      }
    } else {
      // Close enough to player 1 vertically, move horizontally
      const horizontalDirection = player2Pos.x < player1Pos.x ? 1 : -1;
      
      // Move horizontally if allowed
      if (newPos.allowHorizMovement) {
        newPos.x += moveSpeed * 1.5 * deltaTime * horizontalDirection;
        setPlayer2Direction(horizontalDirection > 0 ? "left" : "right");
      }
    }
  }

  // Apply gravity
  newPos.vy += gravity * deltaTime;
  newPos.y += newPos.vy * deltaTime;

  // Constrain to game bounds
  newPos.x = Math.max(playerRadius, Math.min(levelConfig.gameFieldWidth - playerRadius, newPos.x));
  newPos.y = Math.max(playerRadius, Math.min(levelConfig.gameFieldHeight - playerRadius, newPos.y));

  // Reset horizontal movement if player has landed
  if (onPlatform || onFloor) {
    newPos.allowHorizMovement = true;
  }

  return newPos;
};