import { Component } from './Component.js';

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

        if (inputManager.isLeft()) {
            transform.velocityX = -this.speed;
        } else if (inputManager.isRight()) {
            transform.velocityX = this.speed;
        } else {
            transform.velocityX = 0;
        }

        const touchX = inputManager.getTouchX();
        if (touchX !== null) {
            const diff = touchX - transform.x;
            if (Math.abs(diff) > 5) {
                transform.velocityX = diff * 10;
            }
        }

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
