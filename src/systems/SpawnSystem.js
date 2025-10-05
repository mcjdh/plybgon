import { Bullet } from '../entities/Bullet.js';
import { CONFIG } from '../config/constants.js';
import { randomElement } from '../utils/helpers.js';
import { ObjectPool } from '../utils/ObjectPool.js';

// Handles spawning of bullets and enemies
export class SpawnSystem {
    constructor() {
        this.enemyFireTimer = 0; // Delta-time based timer

        // Object pools for performance
        this.bulletPool = new ObjectPool(() => new Bullet(), 100);
    }

    /**
     * Spawn a player bullet (from pool)
     * @param {Object} player - Player object
     * @returns {Bullet|null} - Pooled bullet or null if can't shoot
     */
    spawnPlayerBullet(player) {
        if (player.canShoot()) {
            const pos = player.getBulletSpawnPosition();
            const bullet = this.bulletPool.acquire();
            bullet.init(pos.x, pos.y, -1);
            return bullet;
        }
        return null;
    }

    /**
     * Spawn enemy bullets (delta-time based, from pool)
     * @param {Array} enemies - Array of enemies
     * @param {number} deltaTime - Time since last frame in seconds
     * @returns {Array} - Array of pooled bullets
     */
    spawnEnemyBullets(enemies, deltaTime) {
        const bullets = [];
        this.enemyFireTimer += deltaTime * 1000; // Convert to ms

        if (enemies.length > 0 && this.enemyFireTimer >= CONFIG.ENEMY_FIRE_RATE) {
            const shooter = randomElement(enemies.filter(e => e.active));
            if (shooter) {
                const pos = shooter.getBulletSpawnPosition();
                const bullet = this.bulletPool.acquire();
                bullet.init(pos.x, pos.y, 1);
                bullets.push(bullet);
                this.enemyFireTimer = 0;
            }
        }

        return bullets;
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

