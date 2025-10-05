import { Entity } from './Entity.js';
import { CONFIG } from '../config/constants.js';

export class Enemy extends Entity {
    constructor(x, y, type = 0) {
        super(x, y, CONFIG.ENEMY_WIDTH, CONFIG.ENEMY_HEIGHT);

        this.type = type;
        this.speed = CONFIG.ENEMY_SPEED;
        this.points = CONFIG.POINTS[`ENEMY_TYPE_${type + 1}`] || 10;
        this.color = this.getColorForType(type);

        // Animation
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 300; // ms per frame
    }

    getColorForType(type) {
        const colors = [
            CONFIG.COLORS.ENEMY_TYPE_1,
            CONFIG.COLORS.ENEMY_TYPE_2,
            CONFIG.COLORS.ENEMY_TYPE_3
        ];
        return colors[type] || CONFIG.COLORS.ENEMY_TYPE_1;
    }

    update(deltaTime, enemyDirection) {
        this.x += this.speed * enemyDirection;

        // Update animation
        this.animationTimer += deltaTime * 1000;
        if (this.animationTimer >= this.animationSpeed) {
            this.animationFrame = (this.animationFrame + 1) % 2; // 2-frame animation
            this.animationTimer = 0;
        }
    }

    draw(ctx) {
        const offset = this.animationFrame === 0 ? 0 : 2; // Subtle bounce

        // Draw enemy body with animation
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x - this.width / 2,
            this.y - this.height / 2 - offset,
            this.width,
            this.height
        );

        // Draw eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x - 10, this.y - 5 - offset, 6, 6);
        ctx.fillRect(this.x + 4, this.y - 5 - offset, 6, 6);

        // Draw antenna (alternates in animation)
        if (this.animationFrame === 0) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - 2, this.y - this.height / 2 - offset - 4, 4, 4);
        }
    }

    /**
     * Get bullet spawn position
     * @returns {Object} - {x, y} position
     */
    getBulletSpawnPosition() {
        return {
            x: this.x,
            y: this.y + this.height / 2
        };
    }

    /**
     * Check if enemy is at edge of screen
     * @returns {boolean}
     */
    isAtEdge() {
        return this.x < CONFIG.ENEMY_BOUNDARY_MARGIN ||
               this.x > CONFIG.CANVAS_WIDTH - CONFIG.ENEMY_BOUNDARY_MARGIN;
    }

    /**
     * Move enemy down
     */
    moveDown() {
        this.y += CONFIG.ENEMY_DROP_DISTANCE;
    }
}
