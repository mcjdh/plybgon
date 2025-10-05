import { checkCollision } from '../utils/helpers.js';
import { SpatialGrid } from '../utils/SpatialGrid.js';
import { CONFIG } from '../config/constants.js';

// Handles all collision detection with spatial partitioning and Entity Manager
export class CollisionSystem {
    constructor(entityManager) {
        this.entityManager = entityManager;
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
     * Run all collision checks with spatial partitioning (Entity Manager based)
     * @returns {Object} - Collision results {scoreGained, playerHit, enemyReachedPlayer}
     */
    checkAllCollisions() {
        let scoreGained = 0;
        let playerHit = false;
        let enemyReachedPlayer = false;

        // Get entities from manager
        const player = this.entityManager.getPlayer();
        if (!player) return { scoreGained, playerHit, enemyReachedPlayer };

        const bullets = this.entityManager.getByType(this.entityManager.entityTypes.BULLET);
        const enemyBullets = this.entityManager.getByType(this.entityManager.entityTypes.ENEMY_BULLET);
        const enemies = this.entityManager.getByType(this.entityManager.entityTypes.ENEMY);

        // Clear and populate spatial grid
        this.spatialGrid.clear();
        enemies.forEach(e => this.spatialGrid.insert(e));
        bullets.forEach(b => this.spatialGrid.insert(b));

        // Check player bullets vs enemies (with spatial optimization)
        for (const bullet of bullets) {
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

        // Check enemy bullets vs player
        if (!playerHit) {
            for (const bullet of enemyBullets) {
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
