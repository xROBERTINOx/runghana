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
          // { x: 0, y: 960 }, // floor
          { x: 150, y: 800 },
          { x: 250, y:700},
          { x: 350, y: 600},
          { x: 500, y: 500 },
          { x: 700, y: 450 },
          { x: 500, y: 200 },
          { x: 550, y: 300},
          { x: 600, y: 100 },
        ],
        floor: [{ x: 0, y: 960, width: 1900, height: 40 }],
        gameFieldWidth: 1900,
        gameFieldHeight: 1000,
        obstacles: [{ x: 400, y: 700, size: 80 }],
        doorPosition: { x: 600, y: 5 }
      };

    case 2:
      return {
        player1Start: { x: 50, y: 750 },
        player2Start: { x: 1200, y: 750 },
        goalPosition: { x: 650, y: 50 },
        platforms: [
          { x: 400, y: 800 },
          { x: 800, y: 800 },
          { x: 200, y: 650 },
          { x: 200, y: 500 },
          { x: 1100, y: 500 },
          { x: 400, y: 350 },
          { x: 600, y: 200 },
        ],
        floor: [{ x: 0, y: 830, width: 1300, height: 40 }],
        gameFieldWidth: 1300,
        gameFieldHeight: 850,
        obstacles: [{ x: 600, y: 600, size: 50 }],
        doorPosition: { x: 1800, y: 920 }
      };

    case 3:
      return {
        player1Start: { x: 50, y: 750 },
        player2Start: { x: 1200, y: 750 },
        goalPosition: { x: 650, y: 50 },
        platforms: [
          { x: 400, y: 800 },
          { x: 800, y: 800 },
          { x: 200, y: 650 },
          { x: 200, y: 500 },
          { x: 1100, y: 500 },
          { x: 400, y: 350 },
          { x: 600, y: 200 },
        ],
        floor: [{ x: 0, y: 830, width: 1300, height: 40 }],
        gameFieldWidth: 1300,
        gameFieldHeight: 850,
        obstacles: [{ x: 600, y: 600, size: 50 }],
        doorPosition: { x: 1800, y: 920 }
      };

    case 4:
      return {
        player1Start: { x: 50, y: 750 },
        player2Start: { x: 1200, y: 750 },
        goalPosition: { x: 650, y: 50 },
        platforms: [
          { x: 400, y: 800 },
          { x: 800, y: 800 },
          { x: 200, y: 650 },
          { x: 200, y: 500 },
          { x: 1100, y: 500 },
          { x: 400, y: 350 },
          { x: 600, y: 200 },
        ],
        floor: [{ x: 0, y: 830, width: 1300, height: 40 }],
        gameFieldWidth: 1300,
        gameFieldHeight: 850,
        obstacles: [{ x: 600, y: 600, size: 50 }],
        doorPosition: { x: 1800, y: 920 }
      };

    case 5:
      return {
        player1Start: { x: 50, y: 750 },
        player2Start: { x: 1200, y: 750 },
        goalPosition: { x: 650, y: 50 },
        platforms: [
          { x: 400, y: 800 },
          { x: 800, y: 800 },
          { x: 200, y: 650 },
          { x: 200, y: 500 },
          { x: 1100, y: 500 },
          { x: 400, y: 350 },
          { x: 600, y: 200 },
        ],
        floor: [{ x: 0, y: 830, width: 1300, height: 40 }],
        gameFieldWidth: 1300,
        gameFieldHeight: 850,
        obstacles: [{ x: 600, y: 600, size: 50 }],
        doorPosition: { x: 1800, y: 920 }
      };

    default:
      throw new Error(`Invalid level: ${level}`);
  }
};