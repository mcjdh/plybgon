import { Entity } from './Entity.js';
import { CONFIG } from '../config/constants.js';
import { TransformComponent } from '../components/TransformComponent.js';
import { SpriteComponent } from '../components/SpriteComponent.js';
import { InputComponent } from '../components/InputComponent.js';
import { WeaponComponent } from '../components/WeaponComponent.js';
import { AnimationComponent } from '../components/AnimationComponent.js';

export class Player extends Entity {
    constructor(x, y) {
        super(x, y, CONFIG.PLAYER_WIDTH, CONFIG.PLAYER_HEIGHT);

        // Add components
        this.addComponent(new TransformComponent(
            this,
            x,
            y,
            CONFIG.PLAYER_WIDTH,
            CONFIG.PLAYER_HEIGHT
        ));

        this.addComponent(new SpriteComponent(
            this,
            CONFIG.COLORS.PLAYER,
            'triangle'
        ));

        this.addComponent(new InputComponent(
            this,
            CONFIG.PLAYER_SPEED
        ));

        this.addComponent(new WeaponComponent(
            this,
            1000 / CONFIG.PLAYER_FIRE_RATE // Convert ms to shots/sec
        ));

        const animationComp = new AnimationComponent(this);

        // Define explosion animation
        animationComp.addAnimation('explode', [
            { duration: 0.1, color: '#ff0', opacity: 1.0 },
            { duration: 0.1, color: '#f80', opacity: 0.9 },
            { duration: 0.1, color: '#f00', opacity: 0.7 },
            { duration: 0.1, color: '#800', opacity: 0.5 },
            { duration: 0.1, color: '#400', opacity: 0.3 }
        ], false);

        this.addComponent(animationComp);
    }

    /**
     * Trigger death animation
     */
    explode() {
        const anim = this.getComponent('AnimationComponent');
        if (anim) {
            anim.play('explode');
        }
    }

    /**
     * Check if player can shoot
     */
    canShoot() {
        const weapon = this.getComponent('WeaponComponent');
        return weapon ? weapon.canShoot() : false;
    }

    /**
     * Get bullet spawn position
     */
    getBulletSpawnPosition() {
        const weapon = this.getComponent('WeaponComponent');
        return weapon ? weapon.getBulletSpawnPosition() : null;
    }
}
