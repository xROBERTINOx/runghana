// config/levels.ts
import type { LevelConfig } from '@/types/game';

export const MAX_LEVEL = 5;

export const getLevel = (level: number): LevelConfig => {
  switch (level) {
    case 1:
      return {
        player1Start: { x: 50, y: 750 },
        player2Start: { x: 1200, y: 750 },
        goalPosition: { x: 650, y: 50 },
        platforms: [
          // Ground platform
          { x: 0, y: 800, width: 1300, height: 20 },
          // Escape route platforms
          { x: 200, y: 650, width: 200, height: 20 },
          { x: 500, y: 500, width: 200, height: 20 },
          { x: 800, y: 350, width: 200, height: 20 },
          { x: 500, y: 200, width: 200, height: 20 },
          { x: 600, y: 100, width: 100, height: 20 },
        ],
        gameFieldWidth: 1300,
        gameFieldHeight: 850,
        obstacles: [{ x: 400, y: 700, size: 50 }] // Add this line
      };

    case 2:
      return {
        player1Start: { x: 50, y: 750 },
        player2Start: { x: 1200, y: 750 },
        goalPosition: { x: 650, y: 50 },
        platforms: [
          // Ground platform with gaps
          { x: 0, y: 800, width: 300, height: 20 },
          { x: 400, y: 800, width: 300, height: 20 },
          { x: 800, y: 800, width: 500, height: 20 },
          // Maze-like structure
          { x: 200, y: 650, width: 900, height: 20 },
          { x: 200, y: 500, width: 20, height: 150 },
          { x: 1100, y: 500, width: 20, height: 150 },
          { x: 400, y: 350, width: 500, height: 20 },
          { x: 600, y: 200, width: 100, height: 20 },
        ],
        gameFieldWidth: 1300,
        gameFieldHeight: 850,
        obstacles: [{ x: 600, y: 600, size: 50 }] // Add this line
      };

    case 3:
      return {
        player1Start: { x: 50, y: 750 },
        player2Start: { x: 1200, y: 750 },
        goalPosition: { x: 650, y: 50 },
        platforms: [
          // Split ground platforms
          { x: 0, y: 800, width: 200, height: 20 },
          { x: 300, y: 800, width: 200, height: 20 },
          { x: 600, y: 800, width: 200, height: 20 },
          { x: 900, y: 800, width: 400, height: 20 },
          // Vertical escape paths
          { x: 200, y: 600, width: 20, height: 200 },
          { x: 500, y: 400, width: 20, height: 400 },
          { x: 800, y: 200, width: 20, height: 600 },
          // Horizontal platforms
          { x: 0, y: 400, width: 400, height: 20 },
          { x: 600, y: 300, width: 700, height: 20 },
          { x: 400, y: 200, width: 300, height: 20 },
          { x: 600, y: 100, width: 100, height: 20 },
        ],
        gameFieldWidth: 1300,
        gameFieldHeight: 850,
        obstacles: [{ x: 700, y: 500, size: 50 }] // Add this line
      };
    case 4:
      return {
        player1Start: { x: 50, y: 750 },
        player2Start: { x: 250, y: 750 },
        goalPosition: { x: 1200, y: 50 },
        platforms: [
          { x: 0, y: 800, width: 1300, height: 20 },
          { x: 200, y: 650, width: 150, height: 20 },
          { x: 400, y: 500, width: 150, height: 20 },
          { x: 600, y: 350, width: 150, height: 20 },
          { x: 800, y: 200, width: 150, height: 20 },
          { x: 1000, y: 100, width: 300, height: 20 },
        ],
        gameFieldWidth: 1300,
        gameFieldHeight: 850,
        obstacles: [{ x: 500, y: 600, size: 50 }] // Add this line
      };

    case 5:
      return {
        player1Start: { x: 50, y: 750 },
        player2Start: { x: 1200, y: 750 },
        goalPosition: { x: 650, y: 50 },
        platforms: [
          { x: 0, y: 800, width: 1300, height: 20 },
          { x: 100, y: 600, width: 200, height: 20 },
          { x: 1000, y: 600, width: 200, height: 20 },
          { x: 400, y: 400, width: 500, height: 20 },
          { x: 600, y: 200, width: 100, height: 20 },
        ],
        gameFieldWidth: 1300,
        gameFieldHeight: 850,
        obstacles: [{ x: 300, y: 500, size: 50 }] // Add this line
      };
    default:
      throw new Error(`Invalid level: ${level}`);
  }
};