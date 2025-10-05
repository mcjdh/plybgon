import { Entity } from './Entity.js';
import { CONFIG } from '../config/constants.js';

export class Bullet extends Entity {
    constructor(x = 0, y = 0, direction = -1) {
        super(x, y, CONFIG.BULLET_WIDTH, CONFIG.BULLET_HEIGHT);

        this.init(x, y, direction);
    }

    /**
     * Initialize/reset bullet (for object pooling)
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} direction - Direction (-1 up, 1 down)
     */
    init(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction; // -1 for up (player), 1 for down (enemy)
        this.speed = direction === -1
            ? -CONFIG.BULLET_SPEED
            : CONFIG.ENEMY_BULLET_SPEED;
        this.color = direction === -1
            ? CONFIG.COLORS.PLAYER_BULLET
            : CONFIG.COLORS.ENEMY_BULLET;
        this.active = true;
    }

    update(deltaTime) {
        this.y += this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
    }

    isOffScreen(canvasWidth, canvasHeight) {
        return this.y < -this.height || this.y > canvasHeight + this.height;
    }
}
