//file for checking if player1 is touching any objects that will end the game
interface Player1ChecksProps {
    player1Pos: { x: number; y: number };
    player2Pos: { x: number; y: number };
    playerDiameter: number;
    playerRadius: number;
    levelConfig: {
      obstacles: Array<{ x: number; y: number; size: number }>;
      doorPosition: { x: number; y: number };
    };
    setGameOver: (gameOver: boolean) => void;
    setLevelComplete: (levelComplete: boolean) => void;
  }
  
  export const checkPlayer1Collisions = ({
    player1Pos,
    player2Pos,
    playerDiameter,
    playerRadius,
    levelConfig,
    setGameOver,
    setLevelComplete
  }: Player1ChecksProps) => {
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