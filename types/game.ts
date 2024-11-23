// types/game.ts
export interface Position {
    x: number;
    y: number;
  }
  
export interface Platform {
    x: number;
    y: number;
    width: number;
    height: number;
  }

export interface Obstacle {
    x: number;
    y: number;
    size: number;
}
  
export interface LevelConfig {
    player1Start: Position;
    player2Start: Position;
    platforms: Platform[];
    goalPosition: Position;
    gameFieldWidth: number;
    gameFieldHeight: number;
    obstacles: Obstacle[];
  }