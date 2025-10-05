// Base Level class
export class Level {
    constructor(config) {
        this.enemies = config.enemies || [];
        this.name = config.name || 'Untitled Level';
        this.difficulty = config.difficulty || 1;
    }

    /**
     * Get enemy formation for this level
     * @returns {Array} - Array of enemy configurations {x, y, type}
     */
    getEnemyFormation() {
        return this.enemies;
    }

    /**
     * Get level metadata
     * @returns {Object} - {name, difficulty}
     */
    getMetadata() {
        return {
            name: this.name,
            difficulty: this.difficulty
        };
    }
}
