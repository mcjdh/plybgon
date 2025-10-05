import { Component } from './Component.js';
import { CONFIG } from '../config/constants.js';

// Enemy Movement Component - Handles enemy-specific movement
export class EnemyMovementComponent extends Component {
    constructor(entity, speed = CONFIG.ENEMY_SPEED) {
        super(entity);
        this.baseSpeed = speed;
        this.speedMultiplier = 1.0;
    }

    update(deltaTime, context) {
        if (!this.enabled) return;

        const transform = this.entity.getComponent('TransformComponent');
        if (!transform || !context.enemyDirection) return;

        // Apply horizontal movement based on group direction
        const speed = this.baseSpeed * (this.entity.speedMultiplier || 1.0);
        transform.x += speed * context.enemyDirection * deltaTime * 60; // Scale to 60fps
    }
}
