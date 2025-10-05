// Base Entity class - all game objects inherit from this
export class Entity {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.active = true;
    }

    /**
     * Update entity state - override in subclasses
     * @param {number} deltaTime - Time since last frame
     */
    update(deltaTime) {
        // Override in subclasses
    }

    /**
     * Draw entity - override in subclasses
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        // Override in subclasses
    }

    /**
     * Check if entity is off screen
     * @param {number} canvasWidth - Canvas width
     * @param {number} canvasHeight - Canvas height
     * @returns {boolean}
     */
    isOffScreen(canvasWidth, canvasHeight) {
        return this.x + this.width / 2 < 0 ||
               this.x - this.width / 2 > canvasWidth ||
               this.y + this.height / 2 < 0 ||
               this.y - this.height / 2 > canvasHeight;
    }

    /**
     * Destroy this entity
     */
    destroy() {
        this.active = false;
    }
}
