// Data-driven level definitions
// Each level is defined as compact data rather than procedural code

export const LEVEL_DATA = [
    // Level 1: Classic Grid Formation
    {
        name: 'Wave 1 - Classic',
        difficulty: 1,
        pattern: 'grid',
        config: {
            rows: 3,
            cols: 8,
            startX: 50,
            startY: 50,
            spacingX: 40,
            spacingY: 40,
            typePattern: 'row' // Type changes per row
        }
    },

    // Level 2: V Formation
    {
        name: 'Wave 2 - V Formation',
        difficulty: 2,
        pattern: 'v',
        config: {
            rows: 4,
            centerX: 200,
            startY: 40,
            spacing: 30,
            typePattern: 'alternating'
        }
    },

    // Level 3: Diamond Formation
    {
        name: 'Wave 3 - Diamond',
        difficulty: 3,
        pattern: 'diamond',
        config: {
            centerX: 200,
            centerY: 60,
            spacing: 35,
            rows: [1, 3, 5, 7, 5, 3],
            typePattern: 'inverted' // Higher types at top
        }
    },

    // Level 4: Chevron Formation
    {
        name: 'Wave 4 - Chevron',
        difficulty: 4,
        pattern: 'chevron',
        config: {
            rows: 3,
            centerX: 200,
            startY: 50,
            spacingX: 35,
            spacingY: 35,
            typePattern: 'mixed'
        }
    },

    // Level 5: Circle Formation
    {
        name: 'Wave 5 - Circle',
        difficulty: 5,
        pattern: 'circle',
        config: {
            centerX: 200,
            centerY: 120,
            radius: 80,
            count: 16,
            typePattern: 'alternating'
        }
    }
];

/**
 * Generate enemies from pattern data
 * @param {Object} levelData - Level configuration
 * @returns {Array} - Array of enemy configs {x, y, type}
 */
export function generateEnemiesFromData(levelData) {
    const { pattern, config } = levelData;

    switch (pattern) {
        case 'grid':
            return generateGrid(config);
        case 'v':
            return generateV(config);
        case 'diamond':
            return generateDiamond(config);
        case 'chevron':
            return generateChevron(config);
        case 'circle':
            return generateCircle(config);
        default:
            return generateGrid(config);
    }
}

// Pattern Generators

function generateGrid(config) {
    const { rows, cols, startX, startY, spacingX, spacingY, typePattern } = config;
    const enemies = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            enemies.push({
                x: startX + col * spacingX,
                y: startY + row * spacingY,
                type: getTypeForPosition(row, col, typePattern)
            });
        }
    }

    return enemies;
}

function generateV(config) {
    const { rows, centerX, startY, spacing, typePattern } = config;
    const enemies = [];

    for (let row = 0; row < rows; row++) {
        const enemiesPerSide = row + 1;
        const type = getTypeForPosition(row, 0, typePattern);

        for (let i = 0; i < enemiesPerSide; i++) {
            // Left side of V
            const leftX = centerX - (row * spacing / 2) - (i * spacing);
            if (leftX >= 40) {
                enemies.push({ x: leftX, y: startY + row * spacing, type });
            }

            // Right side of V
            const rightX = centerX + (row * spacing / 2) + (i * spacing);
            if (rightX <= 360 && i > 0) {
                enemies.push({ x: rightX, y: startY + row * spacing, type });
            }
        }
    }

    return enemies;
}

function generateDiamond(config) {
    const { centerX, centerY, spacing, rows, typePattern } = config;
    const enemies = [];

    rows.forEach((count, row) => {
        const type = getTypeForPosition(row, 0, typePattern);
        const startX = centerX - ((count - 1) * spacing) / 2;

        for (let i = 0; i < count; i++) {
            const x = startX + i * spacing;
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

function generateChevron(config) {
    const { rows, centerX, startY, spacingX, spacingY, typePattern } = config;
    const enemies = [];

    for (let row = 0; row < rows; row++) {
        const offset = row * spacingX / 2;
        const cols = 8 - row;

        for (let col = 0; col < cols; col++) {
            const x = centerX - ((cols - 1) * spacingX) / 2 + col * spacingX + offset;
            if (x >= 40 && x <= 360) {
                enemies.push({
                    x: x,
                    y: startY + row * spacingY,
                    type: getTypeForPosition(row, col, typePattern)
                });
            }
        }
    }

    return enemies;
}

function generateCircle(config) {
    const { centerX, centerY, radius, count, typePattern } = config;
    const enemies = [];
    const angleStep = (Math.PI * 2) / count;

    for (let i = 0; i < count; i++) {
        const angle = i * angleStep;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (x >= 40 && x <= 360 && y >= 40) {
            enemies.push({
                x: x,
                y: y,
                type: getTypeForPosition(i, 0, typePattern)
            });
        }
    }

    return enemies;
}

// Type assignment patterns
function getTypeForPosition(row, col, pattern) {
    switch (pattern) {
        case 'row':
            return row % 3; // Type based on row
        case 'alternating':
            return Math.floor(row / 2) % 3; // Alternates every 2 rows
        case 'inverted':
            return row < 2 ? 2 : row < 4 ? 1 : 0; // Higher types at top
        case 'mixed':
            return (row + col) % 3; // Checkerboard pattern
        default:
            return 0;
    }
}
