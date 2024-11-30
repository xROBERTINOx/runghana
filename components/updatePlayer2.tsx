import { Dispatch, SetStateAction } from 'react';
import { Platform, Floor, Obstacle } from "@/types/game";

interface UpdatePlayer2Props {
  prev: { 
    x: number; 
    y: number; 
    vy: number;
  };
  player1Pos: { x: number; y: number; vy: number };
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
  
  // Calculate the offset between player 1 and player 2
  const xOffset = player2Pos.x - player1Pos.x;
  const yOffset = player2Pos.y - player1Pos.y;

  // Mimic player 1's vertical velocity and apply gravity
  newPos.vy = player1Pos.vy;
  newPos.vy += gravity * deltaTime;

  // Update position based on player 1's movement pattern
  newPos.x = player1Pos.x + xOffset;
  newPos.y += newPos.vy * deltaTime;

  // Check collisions for this new position
  const onPlatform = checkPlatformCollisions(newPos);
  const onFloor = checkFloorCollisions(newPos);

  // Update player 2 direction for animation
  const horizontalDirection = player1Pos.x > player2Pos.x ? 1 : -1;
  setPlayer2Direction(horizontalDirection > 0 ? "left" : "right");

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