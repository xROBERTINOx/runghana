import { Platform, Floor } from "@/types/game";

//file for checking if player1 is touching any objects that will end the game
interface Player1CollisionProps {
    player1Pos: { x: number; y: number; vy: number };
    player2Pos?: { x: number; y: number };
    playerDiameter?: number;
    playerRadius: number;
    levelConfig: {
      obstacles: Array<{ x: number; y: number; size: number }>;
      doorPosition: { x: number; y: number };
      platforms: Platform[];
      floor: Floor[];
    }
    setGameOver?: (gameOver: boolean) => void;
    setLevelComplete?: (levelComplete: boolean) => void;
    platformDimensions?: { width: number, height: number };
}
  
export const checkPlayer1Collisions = ({
    player1Pos,
    player2Pos = { x: 64, y: 64 },
    playerDiameter = 64,
    playerRadius,
    levelConfig,
    setGameOver = () => {},
    setLevelComplete = () => {}
}: Player1CollisionProps) => {
    // Check for player1 and player2 colliding
    if (
      player1Pos.x < player2Pos.x + playerDiameter &&
      player1Pos.x + playerDiameter > player2Pos.x &&
      player1Pos.y < player2Pos.y + playerDiameter &&
      player1Pos.y + playerDiameter > player2Pos.y
    ) {
      setGameOver(true);
    }
  
    // Check for touching obstacles
    levelConfig.obstacles.forEach(obstacle => {
      if (
        player1Pos.x + playerRadius > obstacle.x &&
        player1Pos.x - playerRadius < obstacle.x + obstacle.size &&
        player1Pos.y + playerRadius > obstacle.y &&
        player1Pos.y - playerRadius < obstacle.y + obstacle.size
      ) {
        setGameOver(true);
      }
    });
    
    // Check if touching door
    if (
      player1Pos.x < levelConfig.doorPosition.x + 20 &&
      player1Pos.x + 20 > levelConfig.doorPosition.x &&
      player1Pos.y < levelConfig.doorPosition.y + 100 &&
      player1Pos.y + 100 > levelConfig.doorPosition.y
    ) {
      setLevelComplete(true);
    }
};

//check platform collisions
export const checkPlatformCollision = ({
    player1Pos,
    playerRadius,
    levelConfig,
    platformDimensions = { width: 120, height: 50 }
}: Player1CollisionProps) => {
    let onGround = false;
    
    for (const platform of levelConfig.platforms) {
        // Horizontal overlap check
        const horizontalOverlap = 
            player1Pos.x + playerRadius > platform.x &&
            player1Pos.x - playerRadius < platform.x + platformDimensions.width;

        // Vertical overlap range
        const playerTop = player1Pos.y - playerRadius;
        const playerBottom = player1Pos.y + playerRadius;
        const platformTop = platform.y;
        const platformBottom = platform.y + platformDimensions.height;

        // Detailed collision checks
        if (horizontalOverlap) {
            // Falling onto platform
            if (player1Pos.vy > 0 && 
                playerBottom >= platformTop && 
                playerTop < platformTop) {
                player1Pos.y = platformTop - playerRadius;
                player1Pos.vy = 0;
                onGround = true;
            }
            // Hitting platform from below
            else if (player1Pos.vy < 0 && 
                     playerTop <= platformBottom && 
                     playerBottom > platformBottom) {
                player1Pos.y = platformBottom + playerRadius;
                player1Pos.vy = 0;
            }
            
            // Additional check to prevent falling through
            if (player1Pos.vy > 0 && 
                playerTop < platformBottom && 
                playerBottom > platformTop) {
                // If player is within platform vertical space while falling
                onGround = true;
                // Adjust position to platform top if falling through
                if (player1Pos.y + playerRadius > platformTop) {
                    player1Pos.y = platformTop - playerRadius;
                    player1Pos.vy = 0;
                }
            }
        }
    }
    
    return onGround;
};

//check for floor collisions
export const checkFloorCollision = ({
    player1Pos,
    playerRadius,
    levelConfig,
}: Player1CollisionProps) => {
    let onGround = false;

    for (const floor of levelConfig.floor) {
        if 
        (
            player1Pos.x + playerRadius > floor.x &&
            player1Pos.x - playerRadius < floor.x + floor.width
        )
        {
            if 
            (
                player1Pos.vy > 0 &&
                player1Pos.y + playerRadius > floor.y &&
                player1Pos.y + playerRadius < floor.y + floor.height
            )
            {
                player1Pos.y = floor.y - playerRadius;
                player1Pos.vy = 0;
                onGround = true;
            }
        }

        if
        (
            player1Pos.vy < 0 &&
            player1Pos.y - playerRadius < floor.y + floor.height &&
            player1Pos.y - playerRadius > floor.y
        )
        {
            player1Pos.y = floor.y + floor.height + playerRadius;
            player1Pos.vy = 0;
        }
    }
    return onGround;
}