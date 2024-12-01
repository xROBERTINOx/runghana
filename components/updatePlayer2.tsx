import type { Position } from "@/types/game";
import { Platform, Floor, Obstacle } from "@/types/game";

interface UpdatePlayer2Props {
  prev: Position & { vy: number, lastMoveTime?: number, moveDirection?: 'left' | 'right' | 'jump' | 'none' };
  player1Pos: Position & { vy: number };
  player2Pos: Position;
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
  setPlayer2Direction: React.Dispatch<React.SetStateAction<'left' | 'right'>>;
  checkPlatformCollisions: (pos: Position & { vy: number }) => boolean;
  checkFloorCollisions: (pos: Position & { vy: number }) => boolean;
  keysPressed: Set<string>;
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
  checkFloorCollisions,
  keysPressed
}: UpdatePlayer2Props): Position & { vy: number, lastMoveTime?: number, moveDirection?: 'left' | 'right' | 'jump' | 'none' } => {
  // Create a new position object with the previous state

  const newPos = { 
    ...prev, 
    // Ensure these properties exist
    lastMoveTime: prev.lastMoveTime || 0,
    moveDirection: prev.moveDirection || 'none'
  };

  // Apply gravity
  newPos.vy += gravity * deltaTime;
  newPos.y += newPos.vy * deltaTime;

  // Update move direction based on keys pressed
  const updatedPos = handlePlayer2KeyPress(keysPressed, newPos);

  // Simplified movement logic
  if (updatedPos.moveDirection === 'left') {
    // Move left (decrease x)
    updatedPos.x -= moveSpeed * deltaTime;
    setPlayer2Direction('left');
  } else if (updatedPos.moveDirection === 'right') {
    // Move right (increase x)
    updatedPos.x += moveSpeed * deltaTime;
    setPlayer2Direction('right');
  }
  if (keysPressed.has("w") && ((checkPlatformCollisions(newPos) || checkFloorCollisions(newPos)) && newPos.vy >= 0)) {
    updatedPos.vy = -18;
  }

  // Jumping mechanics
  const JUMP_VELOCITY = -300; // Adjust as needed
  // Determine if player is on ground by checking collisions
  const onPlatform = checkPlatformCollisions(updatedPos);
  const onFloor = checkFloorCollisions(updatedPos);
  const isOnGround = onPlatform || onFloor;

  if (updatedPos.moveDirection === 'jump' && isOnGround) {
    // Apply jump velocity only when on ground
    updatedPos.vy = JUMP_VELOCITY;
  }

  // If landed on platform or floor, reset vertical velocity and adjust position
  if (isOnGround) {
    // Stop falling
    updatedPos.vy = 0;

    // Find the nearest platform or floor
    const platforms = [...levelConfig.platforms, ...levelConfig.floor];
    const landedOn = platforms.find(platform =>
      Math.abs(updatedPos.y - (platform.y + playerRadius)) < playerRadius * 0.5
    );

    // Adjust position to sit exactly on top of the platform/floor
    if (landedOn) {
      updatedPos.y = landedOn.y + playerRadius;
    }
  }

  // Constrain to game bounds
  updatedPos.x = Math.max(playerRadius, Math.min(levelConfig.gameFieldWidth - playerRadius, updatedPos.x));
  updatedPos.y = Math.max(playerRadius, Math.min(levelConfig.gameFieldHeight - playerRadius, updatedPos.y));

  return updatedPos;
};

// Helper function to handle key presses
export const handlePlayer2KeyPress = (
  keysPressed: Set<string>, 
  currentState: Position & { vy: number, lastMoveTime?: number, moveDirection?: 'left' | 'right' | 'jump' | 'none' }
): Position & { vy: number, lastMoveTime?: number, moveDirection?: 'left' | 'right' | 'jump' | 'none' } => {
  // Reset move direction if no keys are pressed
  if (keysPressed.size === 0) {
    return {
      ...currentState,
      moveDirection: 'none'
    };
  }

  // Prioritize movement keys with simpler logic
  if (keysPressed.has('a')) {
    return {
      ...currentState,
      moveDirection: 'left'
    };
  }

  if (keysPressed.has('d')) {
    return {
      ...currentState,
      moveDirection: 'right'
    };
  }

  if (keysPressed.has('w')) {
    return {
      ...currentState,
      moveDirection: 'jump'
    };
  }

  // If no specific action, return current state
  return currentState;
};