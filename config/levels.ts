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
          { x: 0, y: 960 }, // floor
          { x: 100, y: 960 }, // floor
          { x: 200, y: 960 }, // floor
          { x: 200, y: 960 }, // floor
          { x: 300, y: 960 }, // floor
          { x: 400, y: 960 }, // floor
          { x: 500, y: 960 }, // floor
          { x: 600, y: 960 }, // floor
          { x: 700, y: 960 }, // floor
          { x: 800, y: 960 }, // floor
          { x: 900, y: 960 }, // floor
          { x: 1000, y: 960 }, // floor
          { x: 1100, y: 960 }, // floor
          { x: 1200, y: 960 }, // floor
          { x: 1300, y: 960 }, // floor
          { x: 1400, y: 960 }, // floor
          { x: 1500, y: 960 }, // floor
          { x: 1600, y: 960 }, // floor
          { x: 1700, y: 960 }, // floor
          { x: 1800, y: 960 }, // floor
       
          { x: 150, y: 700 },

          { x: 500, y: 500 },
          { x: 800, y: 350 },
          { x: 500, y: 200 },
          { x: 600, y: 100 },
        ],
        gameFieldWidth: 1900,
        gameFieldHeight: 1000,
        obstacles: [{ x: 400, y: 700, size: 50 }]
      };

    case 2:
      return {
        player1Start: { x: 50, y: 750 },
        player2Start: { x: 1200, y: 750 },
        goalPosition: { x: 650, y: 50 },
        platforms: [
          { x: 0, y: 830 }, // floor
          { x: 400, y: 800 },
          { x: 800, y: 800 },
          { x: 200, y: 650 },
          { x: 200, y: 500 },
          { x: 1100, y: 500 },
          { x: 400, y: 350 },
          { x: 600, y: 200 },
        ],
        gameFieldWidth: 1300,
        gameFieldHeight: 850,
        obstacles: [{ x: 600, y: 600, size: 50 }]
      };

    case 3:
      return {
        player1Start: { x: 50, y: 750 },
        player2Start: { x: 1200, y: 750 },
        goalPosition: { x: 650, y: 50 },
        platforms: [
          { x: 0, y: 830 }, // floor
          { x: 300, y: 800 },
          { x: 600, y: 800 },
          { x: 900, y: 800 },
          { x: 200, y: 600 },
          { x: 500, y: 400 },
          { x: 800, y: 200 },
          { x: 0, y: 400 },
          { x: 600, y: 300 },
          { x: 400, y: 200 },
          { x: 600, y: 100 },
        ],
        gameFieldWidth: 1300,
        gameFieldHeight: 850,
        obstacles: [{ x: 700, y: 500, size: 50 }]
      };

    case 4:
      return {
        player1Start: { x: 50, y: 750 },
        player2Start: { x: 250, y: 750 },
        goalPosition: { x: 1200, y: 50 },
        platforms: [
          { x: 0, y: 830 }, // floor
          { x: 200, y: 650 },
          { x: 400, y: 500 },
          { x: 600, y: 350 },
          { x: 800, y: 200 },
          { x: 1000, y: 100 },
        ],
        gameFieldWidth: 1300,
        gameFieldHeight: 850,
        obstacles: [{ x: 500, y: 600, size: 50 }]
      };

    case 5:
      return {
        player1Start: { x: 50, y: 750 },
        player2Start: { x: 1200, y: 750 },
        goalPosition: { x: 650, y: 50 },
        platforms: [
          { x: 0, y: 830 }, // floor
          { x: 100, y: 600 },
          { x: 1000, y: 600 },
          { x: 400, y: 400 },
          { x: 600, y: 200 },
        ],
        gameFieldWidth: 1300,
        gameFieldHeight: 850,
        obstacles: [{ x: 300, y: 500, size: 50 }]
      };

    default:
      throw new Error(`Invalid level: ${level}`);
  }
};