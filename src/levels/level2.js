import { Level } from './Level.js';

// Level 2 - V Formation
export const level2 = new Level({
    name: 'Wave 2 - V Formation',
    difficulty: 2,
    enemies: generateVFormation()
});

function generateVFormation() {
    const enemies = [];
    const centerX = 200;
    const startY = 40;
    const rows = 4; // Reduced from 5 to fit on screen
    const spacing = 30;

    for (let row = 0; row < rows; row++) {
        const enemiesPerSide = row + 1;
        const type = Math.floor(row / 2); // Vary enemy types

        for (let i = 0; i < enemiesPerSide; i++) {
            // Left side of V
            const leftX = centerX - (row * spacing / 2) - (i * spacing);
            if (leftX >= 40) { // Only add if on screen
                enemies.push({
                    x: leftX,
                    y: startY + row * spacing,
                    type: type
                });
            }

            // Right side of V
            const rightX = centerX + (row * spacing / 2) + (i * spacing);
            if (rightX <= 360 && i > 0) { // Only add if on screen and not duplicate center
                enemies.push({
                    x: rightX,
                    y: startY + row * spacing,
                    type: type
                });
            }
        }
    }

    return enemies;
}
