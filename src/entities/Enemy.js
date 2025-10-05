import { Entity } from './Entity.js';
import { CONFIG } from '../config/constants.js';
import { TransformComponent } from '../components/TransformComponent.js';
import { SpriteComponent } from '../components/SpriteComponent.js';
import { EnemyMovementComponent } from '../components/EnemyMovementComponent.js';

export class Enemy extends Entity {
    constructor(x, y, type = 0) {
        super(x, y, CONFIG.ENEMY_WIDTH, CONFIG.ENEMY_HEIGHT);

        this.type = type;
        this.points = CONFIG.POINTS[`ENEMY_TYPE_${type + 1}`] || 10;
        this.speedMultiplier = 1.0;

        // Add components
        this.addComponent(new TransformComponent(
            this,
            x,
            y,
            CONFIG.ENEMY_WIDTH,
            CONFIG.ENEMY_HEIGHT
        ));

        const color = this.getColorForType(type);
        this.addComponent(new SpriteComponent(
            this,
            color,
            'rect'
        ));

        this.addComponent(new EnemyMovementComponent(this));
    }

    getColorForType(type) {
        const colors = [
            CONFIG.COLORS.ENEMY_TYPE_1,
            CONFIG.COLORS.ENEMY_TYPE_2,
            CONFIG.COLORS.ENEMY_TYPE_3
        ];
        return colors[type] || CONFIG.COLORS.ENEMY_TYPE_1;
    }

    /**
     * Get bullet spawn position
     */
    getBulletSpawnPosition() {
        const transform = this.getComponent('TransformComponent');
        if (!transform) return null;

        return {
            x: transform.x,
            y: transform.y + transform.height / 2
        };
    }

    /**
     * Check if enemy is at edge of screen
     */
    isAtEdge() {
        const transform = this.getComponent('TransformComponent');
        if (!transform) return false;

        return transform.x < CONFIG.ENEMY_BOUNDARY_MARGIN ||
               transform.x > CONFIG.CANVAS_WIDTH - CONFIG.ENEMY_BOUNDARY_MARGIN;
    }

    /**
     * Move enemy down
     */
    moveDown() {
        const transform = this.getComponent('TransformComponent');
        if (transform) {
            transform.y += CONFIG.ENEMY_DROP_DISTANCE;
        }
    }
}
