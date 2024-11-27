import { Dispatch, SetStateAction } from 'react';

interface UpdatePlayer2Props {
  prev: { 
    x: number; 
    y: number; 
    vy: number;
  };
  keysPressed: Set<string>;
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
  };
  setPlayer2Direction: Dispatch<SetStateAction<'left' | 'right'>>;
  checkPlatformCollisions: (pos: { x: number; y: number; vy: number }) => boolean;
  checkFloorCollisions: (pos: { x: number; y: number; vy: number }) => boolean;
}

export const updatePlayer2 = ({
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
}: UpdatePlayer2Props) => {
  const newPos = { ...prev };
  
  // If "a" or "d" is pressed, move towards player 1
  if (keysPressed.has("a") || keysPressed.has("d")) {
    if (player2Pos.x < player1Pos.x) {
      newPos.x += moveSpeed * deltaTime;
      setPlayer2Direction("left");
    } else if (player2Pos.x > player1Pos.x) {
      newPos.x -= moveSpeed * deltaTime;
      setPlayer2Direction("right");
    }
  }

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