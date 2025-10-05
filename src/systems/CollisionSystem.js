import { checkCollision } from '../utils/helpers.js';

// Handles all collision detection and resolution
export class CollisionSystem {
    constructor() {
        this.onEnemyHit = null; // Callback when enemy is hit
        this.onPlayerHit = null; // Callback when player is hit
    }

    /**
     * Run all collision checks in a single optimized pass
     * @param {Object} gameState - Current game state
     * @returns {Object} - Collision results {scoreGained, playerHit, enemyReachedPlayer}
     */
    checkAllCollisions(gameState) {
        let scoreGained = 0;
        let playerHit = false;
        let enemyReachedPlayer = false;

        const { bullets, enemyBullets, enemies, player } = gameState;

        // Single pass: Check all enemy-related collisions
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            if (!enemy.active) continue;

            // Check if enemy reached player
            if (!enemyReachedPlayer && enemy.y + enemy.height / 2 >= player.y - player.height / 2) {
                enemyReachedPlayer = true;
            }

            // Check player bullets vs this enemy
            for (let j = bullets.length - 1; j >= 0; j--) {
                const bullet = bullets[j];
                if (!bullet.active) continue;

                if (checkCollision(bullet, enemy)) {
                    bullet.destroy();
                    enemy.destroy();
                    scoreGained += enemy.points;

                    if (this.onEnemyHit) {
                        this.onEnemyHit(enemy);
                    }

                    break; // Bullet can only hit one enemy
                }
            }
        }

        // Single pass: Check all enemy bullets vs player
        if (!playerHit) {
            for (let i = enemyBullets.length - 1; i >= 0; i--) {
                const bullet = enemyBullets[i];
                if (!bullet.active) continue;

                if (checkCollision(bullet, player)) {
                    bullet.destroy();
                    playerHit = true;

                    if (this.onPlayerHit) {
                        this.onPlayerHit();
                    }

                    break; // Only need to detect one hit
                }
            }
        }

        return { scoreGained, playerHit, enemyReachedPlayer };
    }
}
