// config/levels.ts
import type { LevelConfig } from '@/types/game';

export const MAX_LEVEL = 5;

export const getLevel = (level: number): LevelConfig => {
  switch (level) {
    case 1:
      return {
        player1Start: { x: 80, y: 750 },
        player2Start: { x: 805, y: 750 },
        goalPosition: { x: 650, y: 50 },
        platforms: [
          { x: 150, y: 800, width: 120, height: 50 },
          { x: 250, y: 700, width: 120, height: 50 },
          { x: 370, y: 600, width: 120, height: 50 },
          { x: 500, y: 500, width: 120, height: 50 },
          { x: 700, y: 450, width: 120, height: 50 },
          { x: 500, y: 200, width: 120, height: 50 },
          { x: 550, y: 300, width: 120, height: 50 },
          { x: 600, y: 100, width: 120, height: 50 },
        ],
        floor: [{ x: 0, y: 960, width: 1900, height: 40 }],
        gameFieldWidth: 1900,
        gameFieldHeight: 1000,
        obstacles: [{ x: 670, y: 700, size: 60 }],
        doorPosition: { x: 650, y: 3 }
      };

    case 2:
      return {
        player1Start: { x: 50, y: 750 },
        player2Start: { x: 1200, y: 750 },
        goalPosition: { x: 800, y: 50 },
        platforms: [
          { x: 400, y: 600 },
          { x: 900, y: 700 },
          { x: 200, y: 650 },
          { x: 700, y: 500 },
          { x: 1000, y: 400 },
          { x: 400, y: 350 },
          { x: 600, y: 200 },
        ],
        floor: [{ x: 0, y: 800, width: 1300, height: 60 }],
        gameFieldWidth: 1300,
        gameFieldHeight: 850,
        obstacles: [{ x: 600, y: 600, size: 60 }],
        doorPosition: { x: 1000, y: 300 }
      };

    case 3:
      return {
        player1Start: { x: 1100, y: 750 },
        player2Start: { x: 50, y: 750 },
        goalPosition: { x: 650, y: 50 },
        platforms: [
          { x: 800, y: 400 },
          { x: 600, y: 300 },
          { x: 350, y: 650 },
          { x: 200, y: 500 },
          { x: 700, y: 500 },
          { x: 450, y: 350 },
          { x: 350, y: 250 },
        ],
        floor: [{ x: 0, y: 830, width: 1300, height: 40 }],
        gameFieldWidth: 1300,
        gameFieldHeight: 850,
        obstacles: [
          { x: 600, y: 600, size: 50 },
          { x: 350, y: 390, size: 50 },
        ],
        doorPosition: { x: 650, y: 200 },
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
        doorPosition: { x: 650, y: 95 }
      };

    case 5:
      return {
        player1Start: { x: 100, y: 750 },
        player2Start: { x: 400, y: 800 },
        goalPosition: { x: 650, y: 50 },
        platforms: [
          { x: 400, y: 800 },
          { x: 900, y: 200 },
          { x: 150, y: 650 },
          { x: 200, y: 500 },
          { x: 1100, y: 500 },
          { x: 400, y: 350 },
          { x: 600, y: 200 },
          { x: 400, y: 600 },
        ],
        floor: [{ x: 0, y: 830, width: 1300, height: 40 }],
        gameFieldWidth: 1300,
        gameFieldHeight: 850,
        obstacles: [{ x: 600, y: 600, size: 50 }],
        doorPosition: { x: 1100, y: 400 }
      };

    default:
      return getLevel(1);
  }
};