import { Entity } from './Entity.js';
import { CONFIG } from '../config/constants.js';
import { TransformComponent } from '../components/TransformComponent.js';
import { SpriteComponent } from '../components/SpriteComponent.js';

export class Bullet extends Entity {
    constructor(x = 0, y = 0, direction = -1) {
        super(x, y, CONFIG.BULLET_WIDTH, CONFIG.BULLET_HEIGHT);

        this.direction = direction;

        // Add components
        const transform = new TransformComponent(
            this,
            x,
            y,
            CONFIG.BULLET_WIDTH,
            CONFIG.BULLET_HEIGHT
        );
        this.addComponent(transform);

        const color = direction === -1
            ? CONFIG.COLORS.PLAYER_BULLET
            : CONFIG.COLORS.ENEMY_BULLET;

        this.addComponent(new SpriteComponent(
            this,
            color,
            'rect'
        ));

        // Set velocity based on direction
        const speed = direction === -1
            ? CONFIG.BULLET_SPEED
            : CONFIG.ENEMY_BULLET_SPEED;

        transform.velocityY = direction * speed;
    }

    /**
     * Initialize/reset bullet (for object pooling)
     */
    init(x, y, direction) {
        this.direction = direction;
        this.active = true;

        const transform = this.getComponent('TransformComponent');
        if (transform) {
            transform.x = x;
            transform.y = y;

            const speed = direction === -1
                ? CONFIG.BULLET_SPEED
                : CONFIG.ENEMY_BULLET_SPEED;

            transform.velocityY = direction * speed;
        }

        const sprite = this.getComponent('SpriteComponent');
        if (sprite) {
            sprite.color = direction === -1
                ? CONFIG.COLORS.PLAYER_BULLET
                : CONFIG.COLORS.ENEMY_BULLET;
        }
    }
}
