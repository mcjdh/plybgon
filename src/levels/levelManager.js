import { level1 } from './level1.js';
import { level2 } from './level2.js';
import { level3 } from './level3.js';
import { Enemy } from '../entities/Enemy.js';

// Manages level progression and enemy spawning
export class LevelManager {
    constructor() {
        this.levels = [level1, level2, level3];
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
            // Apply difficulty multiplier to speed
            enemy.speed *= this.difficultyMultiplier;
            return enemy;
        });
    }

    /**
     * Update all enemies
     * @param {Array} enemies - Array of enemies
     */
    updateEnemies(enemies, deltaTime) {
        // First, move all enemies
        enemies.forEach(enemy => {
            if (!enemy.active) return;
            enemy.update(deltaTime, this.enemyDirection);
        });

        // Then check if any hit the edge (after movement)
        let hitEdge = false;
        for (const enemy of enemies) {
            if (!enemy.active) continue;
            if (enemy.isAtEdge()) {
                hitEdge = true;
                break;
            }
        }

        // If hit edge, reverse direction and move down (only once per frame)
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
