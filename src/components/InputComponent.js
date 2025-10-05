import { Component } from './Component.js';

// Input Component - Handles player input
export class InputComponent extends Component {
    constructor(entity, speed = 200) {
        super(entity);
        this.speed = speed;
    }

    update(deltaTime, context) {
        if (!this.enabled) return;

        const inputManager = context.inputManager;
        if (!inputManager) return;

        const transform = this.entity.getComponent('TransformComponent');
        if (!transform) return;

        // Handle horizontal movement
        if (inputManager.isLeftPressed()) {
            transform.velocityX = -this.speed;
        } else if (inputManager.isRightPressed()) {
            transform.velocityX = this.speed;
        } else {
            transform.velocityX = 0;
        }

        // Clamp to screen bounds
        const halfWidth = transform.width / 2;
        if (transform.x < halfWidth) {
            transform.x = halfWidth;
            transform.velocityX = 0;
        } else if (transform.x > context.canvasWidth - halfWidth) {
            transform.x = context.canvasWidth - halfWidth;
            transform.velocityX = 0;
        }
    }
}
