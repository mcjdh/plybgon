// Generic pattern generation system
// All patterns use higher-order functions to eliminate duplication

// Position generators - pure functions that calculate (x, y) for index
const POSITION_GENERATORS = {
    grid: (config) => (row, col) => ({
        x: config.startX + col * config.spacingX,
        y: config.startY + row * config.spacingY
    }),

    symmetric: (config) => (row, col) => ({
        x: config.centerX - ((config.count - 1) * config.spacing) / 2 + col * config.spacing,
        y: config.startY + row * config.spacingY
    }),

    vShape: (config) => (row, side, offset) => ({
        x: side === 'left'
            ? config.centerX - (row * config.spacing / 2) - (offset * config.spacing)
            : config.centerX + (row * config.spacing / 2) + (offset * config.spacing),
        y: config.startY + row * config.spacing
    }),

    polar: (config) => (index) => ({
        x: config.centerX + Math.cos(index * config.angleStep) * config.radius,
        y: config.centerY + Math.sin(index * config.angleStep) * config.radius
    })
};

// Type patterns - pure functions for type assignment
const TYPE_PATTERNS = {
    row: (row, col) => row % 3,
    alternating: (row, col) => Math.floor(row / 2) % 3,
    inverted: (row, col) => row < 2 ? 2 : row < 4 ? 1 : 0,
    mixed: (row, col) => (row + col) % 3,
    sequential: (index, col) => index % 3
};

// Bounds checker - higher-order function
const inBounds = (minX = 40, maxX = 360, minY = 40) => ({ x, y }) =>
    x >= minX && x <= maxX && y >= minY;

// Generic position mapper - creates enemies from positions
const createEnemies = (positions, typePattern, boundsCheck = inBounds()) =>
    positions
        .filter(boundsCheck)
        .map(({ x, y, type }) => ({ x, y, type }));

// Generic pattern builder - creates patterns from iterators
const buildPattern = (iterator, positionGen, typeGen) => {
    const positions = [];
    for (const item of iterator) {
        const pos = positionGen(item);
        const type = typeGen(item);
        positions.push({ ...pos, type });
    }
    return createEnemies(positions);
};

// Pattern generators using composition
const PATTERN_GENERATORS = {
    grid: (config) => {
        const posGen = POSITION_GENERATORS.grid(config);
        const typeGen = TYPE_PATTERNS[config.typePattern] || TYPE_PATTERNS.row;

        const positions = [];
        for (let row = 0; row < config.rows; row++) {
            for (let col = 0; col < config.cols; col++) {
                const pos = posGen(row, col);
                positions.push({ ...pos, type: typeGen(row, col) });
            }
        }
        return createEnemies(positions, config.typePattern);
    },

    v: (config) => {
        const posGen = POSITION_GENERATORS.vShape(config);
        const typeGen = TYPE_PATTERNS[config.typePattern] || TYPE_PATTERNS.row;

        const positions = [];
        for (let row = 0; row < config.rows; row++) {
            const enemiesPerSide = row + 1;
            const type = typeGen(row, 0);

            for (let i = 0; i < enemiesPerSide; i++) {
                positions.push({ ...posGen(row, 'left', i), type });
                if (i > 0) {
                    positions.push({ ...posGen(row, 'right', i), type });
                }
            }
        }
        return createEnemies(positions, config.typePattern);
    },

    diamond: (config) => {
        const typeGen = TYPE_PATTERNS[config.typePattern] || TYPE_PATTERNS.row;

        const positions = [];
        config.rows.forEach((count, row) => {
            const startX = config.centerX - ((count - 1) * config.spacing) / 2;
            const type = typeGen(row, 0);

            for (let i = 0; i < count; i++) {
                positions.push({
                    x: startX + i * config.spacing,
                    y: config.centerY + row * 28,
                    type
                });
            }
        });
        return createEnemies(positions, config.typePattern);
    },

    chevron: (config) => {
        const typeGen = TYPE_PATTERNS[config.typePattern] || TYPE_PATTERNS.row;

        const positions = [];
        for (let row = 0; row < config.rows; row++) {
            const offset = row * config.spacingX / 2;
            const cols = 8 - row;

            for (let col = 0; col < cols; col++) {
                const x = config.centerX - ((cols - 1) * config.spacingX) / 2 + col * config.spacingX + offset;
                positions.push({
                    x,
                    y: config.startY + row * config.spacingY,
                    type: typeGen(row, col)
                });
            }
        }
        return createEnemies(positions, config.typePattern);
    },

    circle: (config) => {
        const angleStep = (Math.PI * 2) / config.count;
        const posGen = POSITION_GENERATORS.polar({ ...config, angleStep });
        const typeGen = TYPE_PATTERNS[config.typePattern] || TYPE_PATTERNS.sequential;

        const positions = [];
        for (let i = 0; i < config.count; i++) {
            const pos = posGen(i);
            positions.push({ ...pos, type: typeGen(i, 0) });
        }
        return createEnemies(positions, config.typePattern);
    },

    // NEW: Spiral pattern using generic builder
    spiral: (config) => {
        const { centerX, centerY, arms, enemiesPerArm, spacing } = config;
        const typeGen = TYPE_PATTERNS[config.typePattern] || TYPE_PATTERNS.sequential;

        return buildPattern(
            Array.from({ length: arms * enemiesPerArm }, (_, i) => i),
            (i) => {
                const arm = i % arms;
                const distance = Math.floor(i / arms) * spacing;
                const angle = (arm / arms) * Math.PI * 2 + (distance * 0.1);
                return {
                    x: centerX + Math.cos(angle) * distance,
                    y: centerY + Math.sin(angle) * distance
                };
            },
            (i) => typeGen(Math.floor(i / arms), i % arms)
        );
    },

    // NEW: Wave pattern using sine curve
    wave: (config) => {
        const { startX, startY, count, spacing, amplitude, frequency } = config;
        const typeGen = TYPE_PATTERNS[config.typePattern] || TYPE_PATTERNS.sequential;

        return buildPattern(
            Array.from({ length: count }, (_, i) => i),
            (i) => ({
                x: startX + i * spacing,
                y: startY + Math.sin(i * frequency) * amplitude
            }),
            (i) => typeGen(i, 0)
        );
    },

    // NEW: Cross/Plus formation
    cross: (config) => {
        const { centerX, centerY, armLength, spacing } = config;
        const typeGen = TYPE_PATTERNS[config.typePattern] || TYPE_PATTERNS.sequential;

        const positions = [];
        for (let i = -armLength; i <= armLength; i++) {
            if (i !== 0) {
                positions.push({ x: centerX + i * spacing, y: centerY, type: typeGen(Math.abs(i), 0) });
                positions.push({ x: centerX, y: centerY + i * spacing, type: typeGen(Math.abs(i), 1) });
            }
        }
        positions.push({ x: centerX, y: centerY, type: 2 });
        return createEnemies(positions);
    },

    // NEW: Random scatter with constraints
    scatter: (config) => {
        const { centerX, centerY, count, radius, seed } = config;
        const typeGen = TYPE_PATTERNS[config.typePattern] || TYPE_PATTERNS.sequential;

        // Seeded random for consistent patterns
        let seedValue = seed || 42;
        const random = () => {
            seedValue = (seedValue * 9301 + 49297) % 233280;
            return seedValue / 233280;
        };

        return buildPattern(
            Array.from({ length: count }, (_, i) => i),
            (i) => {
                const angle = random() * Math.PI * 2;
                const dist = random() * radius;
                return {
                    x: centerX + Math.cos(angle) * dist,
                    y: centerY + Math.sin(angle) * dist
                };
            },
            (i) => typeGen(i, 0)
        );
    }
};

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

export function generateEnemiesFromData(levelData) {
    const generator = PATTERN_GENERATORS[levelData.pattern];
    return generator ? generator(levelData.config) : PATTERN_GENERATORS.grid(levelData.config);
}
