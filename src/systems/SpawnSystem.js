import { Bullet } from '../entities/Bullet.js';
import { CONFIG } from '../config/constants.js';
import { randomElement } from '../utils/helpers.js';
import { ObjectPool } from '../utils/ObjectPool.js';

export class SpawnSystem {
    constructor(entityManager) {
        this.entityManager = entityManager;
        this.enemyFireTimer = 0;
        this.bulletPool = new ObjectPool(() => new Bullet(), CONFIG.BULLET_POOL_SIZE);
    }

    trySpawnPlayerBullet(player) {
        if (player.canShoot()) {
            const pos = player.getBulletSpawnPosition();
            const bullet = this.bulletPool.acquire();
            bullet.init(pos.x, pos.y, -1);
            this.entityManager.add(bullet, this.entityManager.entityTypes.BULLET);
            return true;
        }
        return false;
    }

    spawnEnemyBullets(deltaTime) {
        this.enemyFireTimer += deltaTime * 1000;
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
