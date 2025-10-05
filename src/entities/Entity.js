export class Entity {
    constructor() {
        this.active = true;
        this.components = new Map();
    }

    addComponent(component) {
        const componentName = component.constructor.name;
        this.components.set(componentName, component);
        component.init();
        return this;
    }

    getComponent(componentName) {
        return this.components.get(componentName);
    }

    hasComponent(componentName) {
        return this.components.has(componentName);
    }

    removeComponent(componentName) {
        const component = this.components.get(componentName);
        if (component) {
            component.destroy();
            this.components.delete(componentName);
        }
    }

    update(deltaTime, context = {}) {
        for (const component of this.components.values()) {
            if (component.enabled) {
                component.update(deltaTime, context);
            }
        }
    }

    draw(ctx) {
        const sprite = this.getComponent('SpriteComponent');
        if (sprite) {
            sprite.render(ctx);
        }
    }

    isOffScreen(canvasWidth, canvasHeight) {
        const transform = this.getComponent('TransformComponent');
        return transform ? transform.isOffScreen(canvasWidth, canvasHeight) : false;
    }

    destroy() {
        for (const component of this.components.values()) {
            component.destroy();
        }
        this.active = false;
    }
}
