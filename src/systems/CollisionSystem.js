import { checkCollision } from '../utils/helpers.js';
import { SpatialGrid } from '../utils/SpatialGrid.js';
import { CONFIG } from '../config/constants.js';

// Handles all collision detection and resolution with spatial partitioning
export class CollisionSystem {
    constructor() {
        this.onEnemyHit = null; // Callback when enemy is hit
        this.onPlayerHit = null; // Callback when player is hit

        // Spatial grid for efficient collision detection
        this.spatialGrid = new SpatialGrid(
            CONFIG.CANVAS_WIDTH,
            CONFIG.CANVAS_HEIGHT,
            64 // Cell size - tuned for typical entity sizes
        );
    }

    /**
     * Run all collision checks with spatial partitioning optimization
     * @param {Object} gameState - Current game state
     * @returns {Object} - Collision results {scoreGained, playerHit, enemyReachedPlayer}
     */
    checkAllCollisions(gameState) {
        let scoreGained = 0;
        let playerHit = false;
        let enemyReachedPlayer = false;

        const { bullets, enemyBullets, enemies, player } = gameState;

        // Clear and populate spatial grid
        this.spatialGrid.clear();
        enemies.forEach(e => e.active && this.spatialGrid.insert(e));
        bullets.forEach(b => b.active && this.spatialGrid.insert(b));
        enemyBullets.forEach(b => b.active && this.spatialGrid.insert(b));

        // Check player bullets vs enemies (with spatial optimization)
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            if (!bullet.active) continue;

            // Only check nearby enemies (spatial partitioning!)
            const nearbyEnemies = this.spatialGrid.getNearby(bullet)
                .filter(e => e.active && enemies.includes(e));

            for (const enemy of nearbyEnemies) {
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

        // Check enemies (position and player reach)
        for (const enemy of enemies) {
            if (!enemy.active) continue;

            // Check if enemy reached player
            if (!enemyReachedPlayer && enemy.y + enemy.height / 2 >= player.y - player.height / 2) {
                enemyReachedPlayer = true;
            }
        }

        // Check enemy bullets vs player (spatial optimization)
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
