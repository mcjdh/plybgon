import { checkCollision } from '../utils/helpers.js';
import { SpatialGrid } from '../utils/SpatialGrid.js';
import { CONFIG } from '../config/constants.js';

export class CollisionSystem {
    constructor(entityManager) {
        this.entityManager = entityManager;
        this.spatialGrid = new SpatialGrid(CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT, 64);
    }

    checkAllCollisions() {
        let scoreGained = 0;
        let playerHit = false;
        let enemyReachedPlayer = false;

        const player = this.entityManager.getPlayer();
        if (!player) return { scoreGained, playerHit, enemyReachedPlayer };

        const bullets = this.entityManager.getByType(this.entityManager.entityTypes.BULLET);
        const enemyBullets = this.entityManager.getByType(this.entityManager.entityTypes.ENEMY_BULLET);
        const enemies = this.entityManager.getByType(this.entityManager.entityTypes.ENEMY);

        this.spatialGrid.clear();
        enemies.forEach(e => this.spatialGrid.insert(e));
        bullets.forEach(b => this.spatialGrid.insert(b));

        for (const bullet of bullets) {
            if (!bullet.active) continue;

            const nearbyEnemies = this.spatialGrid.getNearby(bullet)
                .filter(e => e.active && enemies.includes(e));

            for (const enemy of nearbyEnemies) {
                if (checkCollision(bullet, enemy)) {
                    bullet.destroy();
                    enemy.destroy();
                    scoreGained += enemy.points;
                    break;
                }
            }
        }

        for (const enemy of enemies) {
            if (!enemy.active) continue;

            if (!enemyReachedPlayer && enemy.y + enemy.height / 2 >= player.y - player.height / 2) {
                enemyReachedPlayer = true;
            }
        }

        if (!playerHit) {
            for (const bullet of enemyBullets) {
                if (!bullet.active) continue;

                if (checkCollision(bullet, player)) {
                    bullet.destroy();
                    playerHit = true;
                    break;
                }
            }
        }

        return { scoreGained, playerHit, enemyReachedPlayer };
    }
}
