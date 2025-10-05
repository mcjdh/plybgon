import { Bullet } from '../entities/Bullet.js';
import { CONFIG } from '../config/constants.js';
import { randomElement } from '../utils/helpers.js';
import { ObjectPool } from '../utils/ObjectPool.js';

// Handles spawning of bullets and enemies with Entity Manager integration
export class SpawnSystem {
    constructor(entityManager) {
        this.entityManager = entityManager;
        this.enemyFireTimer = 0; // Delta-time based timer

        // Object pools for performance
        this.bulletPool = new ObjectPool(() => new Bullet(), CONFIG.BULLET_POOL_SIZE);
    }

    /**
     * Try to spawn a player bullet (from pool), add to entity manager if successful
     * @param {Object} player - Player object
     * @param {number} deltaTime - Time delta (optional, for future use)
     * @returns {boolean} - True if bullet was spawned
     */
    trySpawnPlayerBullet(player, deltaTime) {
        if (player.canShoot()) {
            const pos = player.getBulletSpawnPosition();
            const bullet = this.bulletPool.acquire();
            bullet.init(pos.x, pos.y, -1);
            this.entityManager.add(bullet, this.entityManager.entityTypes.BULLET);
            return true;
        }
        return false;
    }

    /**
     * Spawn enemy bullets (delta-time based, from pool)
     * @param {number} deltaTime - Time since last frame in seconds
     */
    spawnEnemyBullets(deltaTime) {
        this.enemyFireTimer += deltaTime * 1000; // Convert to ms

        const enemies = this.entityManager.getByType(this.entityManager.entityTypes.ENEMY);

        if (enemies.length > 0 && this.enemyFireTimer >= CONFIG.ENEMY_FIRE_RATE) {
            const shooter = randomElement(enemies);
            if (shooter) {
                const pos = shooter.getBulletSpawnPosition();
                const bullet = this.bulletPool.acquire();
                bullet.init(pos.x, pos.y, 1);
                this.entityManager.add(bullet, this.entityManager.entityTypes.ENEMY_BULLET);
                this.enemyFireTimer = 0;
            }
        }
    }

    /**
     * Release bullets back to pool
     * @param {Array} bullets - Bullets to release
     */
    releaseBullets(bullets) {
        bullets.forEach(bullet => {
            if (!bullet.active) {
                this.bulletPool.release(bullet);
            }
        });
    }

    reset() {
        this.enemyFireTimer = 0;
        this.bulletPool.clear();
    }
}
