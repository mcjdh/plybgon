import { Component } from './Component.js';

// Transform Component - Handles position, size, and movement
export class TransformComponent extends Component {
    constructor(entity, x, y, width, height) {
        super(entity);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.velocityY = 0;
    }

    update(deltaTime, context) {
        if (!this.enabled) return;

        // Apply velocity
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
    }

    /**
     * Check if this transform is off-screen
     */
    isOffScreen(canvasWidth, canvasHeight) {
        return this.x + this.width < 0 ||
               this.x > canvasWidth ||
               this.y + this.height < 0 ||
               this.y > canvasHeight;
    }

    /**
     * Get bounds for collision detection
     */
    getBounds() {
        return {
            left: this.x - this.width / 2,
            right: this.x + this.width / 2,
            top: this.y - this.height / 2,
            bottom: this.y + this.height / 2,
            centerX: this.x,
            centerY: this.y
        };
    }
}
