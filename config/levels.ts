// config/levels.ts
import type { LevelConfig } from '@/types/game';

export const MAX_LEVEL = 5;

export const getLevel = (level: number): LevelConfig => {
  switch (level) {
    case 1:
      return {
        player1Start: { x: 50, y: 750 },
        player2Start: { x: 400, y: 750 },
        goalPosition: { x: 1700, y: 50 },
        platforms: [
          // First set of stairs (lower)
          { x: 150, y: 800, width: 120, height: 50 },
          { x: 500, y: 800, width: 120, height: 50 },
      
          // Second set of stairs (mid-level)
          { x: 250, y: 700, width: 120, height: 50 },
          { x: 600, y: 700, width: 120, height: 50 },
      
          // Third set of stairs (higher)
          { x: 370, y: 600, width: 120, height: 50 },
          { x: 700, y: 600, width: 120, height: 50 },
      
          // Fourth set of stairs (even higher)
          { x: 500, y: 500, width: 120, height: 50 },
          { x: 830, y: 500, width: 120, height: 50 },
      
          // Fifth set of stairs (near top)
          { x: 650, y: 400, width: 120, height: 50 },
          { x: 980, y: 400, width: 120, height: 50 },
      
          // Top platforms
          { x: 800, y: 300, width: 120, height: 50 },
          { x: 1130, y: 300, width: 120, height: 50 },

          { x: 1000, y: 200, width: 120, height: 50 },
      
          // Final approach to goal
          { x: 1300, y: 200, width: 120, height: 50 },
          { x: 1600, y: 100, width: 120, height: 50 }
        ],
        floor: [{ x: 0, y: 960, width: 1900, height: 40 }],
        gameFieldWidth: 1900,
        gameFieldHeight: 1000,
        obstacles: [
          { x: 400, y: 700, size: 60 },
          { x: 750, y: 500, size: 60 },
          { x: 1100, y: 300, size: 60 }
        ],
        doorPosition: { x: 1700, y: 3 }
      };

    case 2:
      return {
        player1Start: { x: 50, y: 1800 },
        player2Start: { x: 400, y: 1800 },
        goalPosition: { x: 1700, y: 50 },
        platforms: [
          { x: 100, y: 1700, width: 120, height: 50 },
          { x: 300, y: 1600, width: 120, height: 50 },
          { x: 500, y: 1500, width: 120, height: 50 },
          { x: 700, y: 1400, width: 120, height: 50 },
          { x: 900, y: 1300, width: 120, height: 50 },
          { x: 1100, y: 1200, width: 120, height: 50 },
          { x: 1300, y: 1100, width: 120, height: 50 },
          { x: 1250, y: 900, width: 120, height: 50 },
          { x: 1500, y: 1000, width: 120, height: 50 },
          { x: 700, y: 900, width: 120, height: 50 },
          { x: 400, y: 1000, width: 120, height: 50 },
          { x: 300, y: 800, width: 120, height: 50 },
          { x: 1000, y: 800, width: 120, height: 50 },
          { x: 1300, y: 700, width: 120, height: 50 },
          { x: 500, y: 600, width: 120, height: 50 },
          { x: 800, y: 500, width: 120, height: 50 },
          { x: 1100, y: 400, width: 120, height: 50 },
          { x: 1400, y: 300, width: 120, height: 50 }
        ],
        floor: [{ x: 0, y: 1900, width: 1900, height: 40 }],
        obstacles: [
          { x: 600, y: 1500, size: 60 },
          { x: 750, y: 1200, size: 60 },
          { x: 1200, y: 900, size: 70 },
          { x: 1500, y: 600, size: 60 }
        ],
        gameFieldWidth: 1900,
        gameFieldHeight: 2000,
        doorPosition: { x: 1600, y: 100 }
      };

    case 3:
      return {
        player1Start: { x: 50, y: 3000 },
        player2Start: { x: 400, y: 3000 },
        goalPosition: { x: 1700, y: 50 },
        platforms: [
          { x: 100, y: 2900, width: 120, height: 50 },
          { x: 300, y: 2800, width: 120, height: 50 },
          { x: 500, y: 2700, width: 120, height: 50 },
          { x: 700, y: 2600, width: 120, height: 50 },
          { x: 900, y: 2500, width: 120, height: 50 },
          { x: 1100, y: 2400, width: 120, height: 50 },
          { x: 1300, y: 2300, width: 120, height: 50 },
          { x: 1500, y: 2200, width: 120, height: 50 },
          { x: 200, y: 2100, width: 120, height: 50 },
          { x: 500, y: 2000, width: 120, height: 50 },
          { x: 800, y: 1900, width: 120, height: 50 },
          { x: 1100, y: 1800, width: 120, height: 50 },
          { x: 1400, y: 1700, width: 120, height: 50 },
          { x: 300, y: 1600, width: 120, height: 50 },
          { x: 600, y: 1500, width: 120, height: 50 }
        ],
        floor: [{ x: 0, y: 3100, width: 1900, height: 40 }],
        obstacles: [
          { x: 400, y: 2700, size: 60 },
          { x: 700, y: 2400, size: 60 },
          { x: 1000, y: 2100, size: 60 },
          { x: 1300, y: 1800, size: 60 }
        ],
        gameFieldWidth: 1900,
        gameFieldHeight: 3200,
        doorPosition: { x: 1700, y: 50 }
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