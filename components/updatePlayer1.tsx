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
  setPlayer1Direction: Dispatch<SetStateAction<"left" | "right">>;
  setPlayer1IsMoving: Dispatch<SetStateAction<boolean>>;
  checkPlatformCollisions: (pos: { x: number; y: number; vy: number }) => boolean;
  checkFloorCollisions: (pos: { x: number; y: number; vy: number }) => boolean;
  player2Pos: {
    x: number;
    y: number;
    vy: number;
  };
  setPlayer2Direction: Dispatch<SetStateAction<"left" | "right">>;
  setPlayer2Pos: Dispatch<SetStateAction<{ x: number; y: number; vy: number }>>;
  setPlayer2IsMoving: Dispatch<SetStateAction<boolean>>;
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
  checkFloorCollisions,
  player2Pos,
  setPlayer2Direction,
  setPlayer2Pos,
  setPlayer2IsMoving
}: UpdatePlayer1Props) => {
  const newPos = { ...prev };
  let isMoving = false;
  let moveDirection = null;

  // Apply horizontal movement
  if (keysPressed.has("d")) {
    newPos.x += moveSpeed * deltaTime;
    isMoving = true;
    setPlayer1Direction("right");
    moveDirection = "right";
  }
  if (keysPressed.has("a")) {
    newPos.x -= moveSpeed * deltaTime;
    isMoving = true;
    setPlayer1Direction("left");
    moveDirection = "left";
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
    moveDirection = "jump";
  }

  // Constrain to game bounds
  newPos.x = Math.max(playerRadius, Math.min(levelConfig.gameFieldWidth - playerRadius, newPos.x));
  newPos.y = Math.max(playerRadius, Math.min(levelConfig.gameFieldHeight - playerRadius, newPos.y));

  // Update player2 position to mirror player1's movement
  if (moveDirection) {
    setPlayer2Pos(prevPlayer2Pos => {
      const newPlayer2Pos = { ...prevPlayer2Pos };

      // Horizontal movement
      if (moveDirection === "right") {
        newPlayer2Pos.x += moveSpeed * deltaTime;
        setPlayer2Direction("right");
        setPlayer2IsMoving(true);
      } else if (moveDirection === "left") {
        newPlayer2Pos.x -= moveSpeed * deltaTime;
        setPlayer2Direction("left");
        setPlayer2IsMoving(true);
      }

      // Vertical movement (jumping)
      if (moveDirection === "jump") {
        newPlayer2Pos.vy = jumpForce;
        setPlayer2IsMoving(true);
      }

      // Apply gravity to player2
      newPlayer2Pos.vy += gravity * deltaTime;
      newPlayer2Pos.y += newPlayer2Pos.vy * deltaTime;

      // Constrain player2 to game bounds
      newPlayer2Pos.x = Math.max(playerRadius, Math.min(levelConfig.gameFieldWidth - playerRadius, newPlayer2Pos.x));
      newPlayer2Pos.y = Math.max(playerRadius, Math.min(levelConfig.gameFieldHeight - playerRadius, newPlayer2Pos.y));

      return newPlayer2Pos;
    });
  } else {
    // If no movement, ensure player2 is not moving
    setPlayer2IsMoving(false);
  }

  return newPos;
};