import { Dispatch, SetStateAction } from 'react';
import { Platform, Floor, Obstacle } from "@/types/game";

interface UpdatePlayer2Props {
  prev: { 
    x: number; 
    y: number; 
    vy: number;
  };
  player1Pos: { x: number; y: number };
  player2Pos: { x: number; y: number };
  moveSpeed: number;
  deltaTime: number;
  gravity: number;
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
  playerRadius,
  levelConfig,
  setPlayer2Direction,
  checkPlatformCollisions,
  checkFloorCollisions
}: UpdatePlayer2Props) => {
  // Create a new position object with the previous state
  const newPos = { ...prev };
  
  // Check current position status
  const onPlatform = checkPlatformCollisions(newPos);
  const onFloor = checkFloorCollisions(newPos);

  // Check if players are at exactly the same y-level (with a small tolerance)
  const atSameYLevel = Math.abs(player1Pos.y - player2Pos.y) < playerRadius;

  // If at the same y-level, chase horizontally
  if (atSameYLevel) { //Chasing player
    console.log("Chasing player1")
    // Determine horizontal direction towards player 1
    const horizontalDirectionToPlayer1 = player1Pos.x < player2Pos.x ? -1 : 1;
    
    // Move horizontally towards player 1
    newPos.x += moveSpeed * deltaTime * horizontalDirectionToPlayer1;
    
    // Update player 2 direction for animation
    setPlayer2Direction(horizontalDirectionToPlayer1 > 0 ? "left" : "right");
  } else  { //Chasing platform
    // console.log("Chasing nearsest platform");
    let closestPlatform: Platform = levelConfig.platforms[0]
    for (const platform of levelConfig.platforms) {
      if (platform.y > closestPlatform.y && platform.y < player2Pos.y) {
        closestPlatform = platform
        console.log("New platform set");
      }
    }
    // console.log(closestPlatform);
    const closerSideX = closestPlatform.x < player2Pos.x 
      ? (closestPlatform.width ? closestPlatform.x + closestPlatform.width + 60 : closestPlatform.x) 
      : closestPlatform.x;
    const directionToCloserSide = closerSideX < player2Pos.x ? -1 : 1;
    newPos.x += moveSpeed * deltaTime * directionToCloserSide;

    console.log(directionToCloserSide);
  }

  // Apply gravity
  newPos.vy += gravity * deltaTime;
  newPos.y += newPos.vy * deltaTime;

  // If landed on platform or floor, reset vertical velocity and adjust position
  if (onPlatform || onFloor) {
    // Stop falling
    newPos.vy = 0;

    // Find the nearest platform or floor
    const platforms = [...levelConfig.platforms, ...levelConfig.floor];
    const landedOn = platforms.find(platform => 
      Math.abs(newPos.y - (platform.y + playerRadius)) < playerRadius * 0.5
    );

    // Adjust position to sit exactly on top of the platform/floor
    if (landedOn) {
      newPos.y = landedOn.y + playerRadius;
    }
  }

  // Constrain to game bounds
  newPos.x = Math.max(playerRadius, Math.min(levelConfig.gameFieldWidth - playerRadius, newPos.x));
  newPos.y = Math.max(playerRadius, Math.min(levelConfig.gameFieldHeight - playerRadius, newPos.y));

  return newPos;
};