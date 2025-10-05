import { generateEnemiesFromData } from './levelData.js';

// Base Level class - now data-driven
export class Level {
    constructor(levelData) {
        this.name = levelData.name || 'Untitled Level';
        this.difficulty = levelData.difficulty || 1;
        this.pattern = levelData.pattern || 'grid';
        this.config = levelData.config || {};

        // Generate enemies from data on demand (lazy loading)
        this.enemies = null;
    }

    /**
     * Get enemy formation for this level (lazy loaded)
     * @returns {Array} - Array of enemy configurations {x, y, type}
     */
    getEnemyFormation() {
        if (!this.enemies) {
            this.enemies = generateEnemiesFromData({
                pattern: this.pattern,
                config: this.config
            });
        }
        return this.enemies;
    }

    /**
     * Get level metadata
     * @returns {Object} - {name, difficulty, pattern}
     */
    getMetadata() {
        return {
            name: this.name,
            difficulty: this.difficulty,
            pattern: this.pattern
        };
    }
}
