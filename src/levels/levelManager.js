import { LEVEL_DATA } from './levelData.js';
import { Level } from './Level.js';
import { Enemy } from '../entities/Enemy.js';

// Manages level progression and enemy spawning
export class LevelManager {
    constructor() {
        // Create Level objects from data
        this.levels = LEVEL_DATA.map(data => new Level(data));
        this.currentLevelIndex = 0;
        this.enemyDirection = 1;
        this.difficultyMultiplier = 1.0; // Increases each wave
    }

    /**
     * Get current level
     * @returns {Level}
     */
    getCurrentLevel() {
        return this.levels[this.currentLevelIndex];
    }

    /**
     * Advance to next level
     */
    nextLevel() {
        this.currentLevelIndex++;
        if (this.currentLevelIndex >= this.levels.length) {
            // Loop back with increased difficulty
            this.currentLevelIndex = 0;
            this.difficultyMultiplier += 0.15; // 15% faster each loop
        }
    }

    /**
     * Spawn enemies for current level
     * @returns {Array} - Array of Enemy objects
     */
    spawnEnemies() {
        const level = this.getCurrentLevel();
        const formation = level.getEnemyFormation();

        return formation.map(config => {
            const enemy = new Enemy(config.x, config.y, config.type);

            // Apply difficulty multiplier to speed via TransformComponent
            const transform = enemy.getComponent('TransformComponent');
            if (transform) {
                // Base speed is applied through the update loop
                // Store multiplier for later use
                enemy.speedMultiplier = this.difficultyMultiplier;
            }

            return enemy;
        });
    }

    /**
     * Update enemy group behavior (direction changes, etc.)
     * Movement is handled by EnemyMovementComponent
     * @param {Array} enemies - Array of enemies
     */
    updateEnemies(enemies, deltaTime) {
        // Check if any enemy hit the edge
        let hitEdge = false;
        for (const enemy of enemies) {
            if (!enemy.active) continue;
            if (enemy.isAtEdge()) {
                hitEdge = true;
                break;
            }
        }

        // If hit edge, reverse direction and move all enemies down
        if (hitEdge) {
            this.enemyDirection *= -1;
            enemies.forEach(enemy => {
                if (enemy.active) {
                    enemy.moveDown();
                }
            });
        }
    }

    /**
     * Reset level manager
     */
    reset() {
        this.currentLevelIndex = 0;
        this.enemyDirection = 1;
        this.difficultyMultiplier = 1.0;
    }

    /**
     * Get current level info
     * @returns {Object}
     */
    getLevelInfo() {
        const level = this.getCurrentLevel();
        return {
            ...level.getMetadata(),
            levelNumber: this.currentLevelIndex + 1
        };
    }
}
