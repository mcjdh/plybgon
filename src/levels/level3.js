import { Level } from './Level.js';

// Level 3 - Diamond Formation
export const level3 = new Level({
    name: 'Wave 3 - Diamond',
    difficulty: 3,
    enemies: generateDiamondFormation()
});

function generateDiamondFormation() {
    const enemies = [];
    const centerX = 200;
    const centerY = 60;
    const spacing = 35;

    // Diamond pattern - smaller to fit on screen
    const pattern = [
        { row: 0, count: 1 },
        { row: 1, count: 3 },
        { row: 2, count: 5 },
        { row: 3, count: 7 },
        { row: 4, count: 5 },
        { row: 5, count: 3 }
    ];

    pattern.forEach(({ row, count }) => {
        const type = row < 2 ? 2 : row < 4 ? 1 : 0; // Higher types at top
        const startX = centerX - ((count - 1) * spacing) / 2;

        for (let i = 0; i < count; i++) {
            const x = startX + i * spacing;
            // Only add if within safe bounds
            if (x >= 40 && x <= 360) {
                enemies.push({
                    x: x,
                    y: centerY + row * 28,
                    type: type
                });
            }
        }
    });

    return enemies;
}
