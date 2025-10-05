// Base Entity class - Component-based architecture
export class Entity {
    constructor(x, y, width, height) {
        // Legacy properties for backward compatibility
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.active = true;

        // Component system
        this.components = new Map();
    }

    /**
     * Add a component to this entity
     * @param {Component} component - Component instance
     */
    addComponent(component) {
        const componentName = component.constructor.name;
        this.components.set(componentName, component);
        component.init();
        return this;
    }

    /**
     * Get a component by name
     * @param {string} componentName - Name of component class
     */
    getComponent(componentName) {
        return this.components.get(componentName);
    }

    /**
     * Check if entity has a component
     */
    hasComponent(componentName) {
        return this.components.has(componentName);
    }

    /**
     * Remove a component
     */
    removeComponent(componentName) {
        const component = this.components.get(componentName);
        if (component) {
            component.destroy();
            this.components.delete(componentName);
        }
    }

    /**
     * Update entity - calls update on all components
     * @param {number} deltaTime - Time since last frame
     * @param {Object} context - Game context
     */
    update(deltaTime, context = {}) {
        for (const component of this.components.values()) {
            if (component.enabled) {
                component.update(deltaTime, context);
            }
        }

        // Update legacy properties from TransformComponent if present
        const transform = this.getComponent('TransformComponent');
        if (transform) {
            this.x = transform.x;
            this.y = transform.y;
            this.width = transform.width;
            this.height = transform.height;
        }
    }

    /**
     * Draw entity - calls render on SpriteComponent
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        const sprite = this.getComponent('SpriteComponent');
        if (sprite) {
            sprite.render(ctx);
        }
    }

    /**
     * Check if entity is off screen (uses TransformComponent or legacy)
     */
    isOffScreen(canvasWidth, canvasHeight) {
        const transform = this.getComponent('TransformComponent');
        if (transform) {
            return transform.isOffScreen(canvasWidth, canvasHeight);
        }

        // Fallback to legacy
        return this.x + this.width / 2 < 0 ||
               this.x - this.width / 2 > canvasWidth ||
               this.y + this.height / 2 < 0 ||
               this.y - this.height / 2 > canvasHeight;
    }

    /**
     * Destroy this entity and all components
     */
    destroy() {
        for (const component of this.components.values()) {
            component.destroy();
        }
        this.active = false;
    }
}
