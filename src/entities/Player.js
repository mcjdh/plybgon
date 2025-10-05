import { Entity } from './Entity.js';
import { CONFIG } from '../config/constants.js';
import { clamp } from '../utils/helpers.js';

export class Player extends Entity {
    constructor(x, y) {
        super(x, y, CONFIG.PLAYER_WIDTH, CONFIG.PLAYER_HEIGHT);

        this.speed = CONFIG.PLAYER_SPEED;
        this.fireTimer = 0; // Accumulated time since last shot

        // Death animation
        this.isExploding = false;
        this.explosionTimer = 0;
        this.explosionDuration = 500; // ms
    }

    update(deltaTime, inputManager) {
        // Update explosion animation
        if (this.isExploding) {
            this.explosionTimer += deltaTime * 1000;
            if (this.explosionTimer >= this.explosionDuration) {
                this.isExploding = false;
                this.explosionTimer = 0;
            }
            return; // Don't process movement during explosion
        }

        // Keyboard controls
        if (inputManager.isLeft()) {
            this.x -= this.speed;
        }
        if (inputManager.isRight()) {
            this.x += this.speed;
        }

        // Touch controls
        const touchX = inputManager.getTouchX();
        if (touchX !== null) {
            const diff = touchX - this.x;
            if (Math.abs(diff) > 5) {
                this.x += diff * 0.1;
            }
        }

        // Keep player in bounds
        this.x = clamp(
            this.x,
            this.width / 2,
            CONFIG.CANVAS_WIDTH - this.width / 2
        );

        // Update fire timer
        this.fireTimer += deltaTime * 1000; // Convert to ms
    }

    draw(ctx) {
        if (this.isExploding) {
            // Draw explosion effect
            const progress = this.explosionTimer / this.explosionDuration;
            const explosionRadius = 15 * (1 + progress);

            ctx.save();
            ctx.globalAlpha = 1 - progress;

            // Explosion rings
            for (let i = 0; i < 3; i++) {
                ctx.strokeStyle = i % 2 === 0 ? '#ff0' : '#f00';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(this.x, this.y, explosionRadius - i * 5, 0, Math.PI * 2);
                ctx.stroke();
            }

            ctx.restore();
        } else {
            // Normal player rendering
            ctx.fillStyle = CONFIG.COLORS.PLAYER;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.height / 2);
            ctx.lineTo(this.x - this.width / 2, this.y + this.height / 2);
            ctx.lineTo(this.x + this.width / 2, this.y + this.height / 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    /**
     * Trigger death animation
     */
    explode() {
        this.isExploding = true;
        this.explosionTimer = 0;
    }

    /**
     * Check if player can shoot (delta-time based)
     * @returns {boolean}
     */
    canShoot() {
        if (this.fireTimer >= CONFIG.PLAYER_FIRE_RATE) {
            this.fireTimer = 0;
            return true;
        }
        return false;
    }

    /**
     * Get bullet spawn position
     * @returns {Object} - {x, y} position
     */
    getBulletSpawnPosition() {
        return {
            x: this.x,
            y: this.y - this.height / 2
        };
    }
}
