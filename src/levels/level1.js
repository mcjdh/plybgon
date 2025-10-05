import { Level } from './Level.js';

// Level 1 - Classic Galaga formation
export const level1 = new Level({
    name: 'Wave 1',
    difficulty: 1,
    enemies: generateClassicFormation()
});

function generateClassicFormation() {
    const enemies = [];
    const rows = 3;
    const cols = 8;
    const startX = 50;
    const startY = 50;
    const spacingX = 40;
    const spacingY = 40;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            enemies.push({
                x: startX + col * spacingX,
                y: startY + row * spacingY,
                type: row // Different enemy type per row
            });
        }
    }

    return enemies;
}
