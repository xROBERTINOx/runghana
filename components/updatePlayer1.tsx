//updatePlayer1
import { Dispatch, SetStateAction } from 'react';

interface UpdatePlayer1Props {
  prev: { 
    x: number; 
    y: number; 
    vy: number;
  };
  keysPressed: Set<string>;
  moveSpeed: number;
  deltaTime: number;
  gravity: number;
  jumpForce: number;
  playerRadius: number;
  levelConfig: {
    gameFieldWidth: number;
    gameFieldHeight: number;
  };
  setPlayer1Direction: Dispatch<SetStateAction<'left' | 'right'>>;
  setPlayer1IsMoving: Dispatch<SetStateAction<boolean>>;
  checkPlatformCollisions: (pos: { x: number; y: number; vy: number }) => boolean;
  checkFloorCollisions: (pos: { x: number; y: number; vy: number }) => boolean;
}

export const updatePlayer1 = ({
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
}: UpdatePlayer1Props) => {
  const newPos = { ...prev };
  let isMoving = false;

  // Apply horizontal movement
  if (keysPressed.has("d")) {
    newPos.x += moveSpeed * deltaTime;
    isMoving = true;
    setPlayer1Direction("right");
  }
  if (keysPressed.has("a")) {
    newPos.x -= moveSpeed * deltaTime;
    isMoving = true;
    setPlayer1Direction("left");
  }

  setPlayer1IsMoving(isMoving);
  
  // Apply gravity
  newPos.vy += gravity * deltaTime;
  newPos.y += newPos.vy * deltaTime;

  // Check both platform and floor collisions
  const onPlatform = checkPlatformCollisions(newPos);
  const onFloor = checkFloorCollisions(newPos);
  
  // Allow jumping if on either platform or floor
  if ((onPlatform || onFloor) && keysPressed.has("w") && newPos.vy >= 0) {
    newPos.vy = jumpForce;
  }

  // Constrain to game bounds
  newPos.x = Math.max(playerRadius, Math.min(levelConfig.gameFieldWidth - playerRadius, newPos.x));
  newPos.y = Math.max(playerRadius, Math.min(levelConfig.gameFieldHeight - playerRadius, newPos.y));

  return newPos;
};