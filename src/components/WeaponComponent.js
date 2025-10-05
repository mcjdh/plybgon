import { Component } from './Component.js';

// Weapon Component - Handles shooting
export class WeaponComponent extends Component {
    constructor(entity, fireRate = 0.5) {
        super(entity);
        this.fireRate = fireRate; // Shots per second
        this.timeSinceLastShot = 0;
    }

    update(deltaTime, context) {
        if (!this.enabled) return;

        this.timeSinceLastShot += deltaTime;
    }

    /**
     * Check if can shoot
     */
    canShoot() {
        return this.timeSinceLastShot >= 1 / this.fireRate;
    }

    /**
     * Attempt to shoot
     * @returns {boolean} - True if shot was fired
     */
    shoot() {
        if (this.canShoot()) {
            this.timeSinceLastShot = 0;
            return true;
        }
        return false;
    }

    /**
     * Get bullet spawn position
     */
    getBulletSpawnPosition() {
        const transform = this.entity.getComponent('TransformComponent');
        if (!transform) return null;

        return {
            x: transform.x,
            y: transform.y - transform.height / 2
        };
    }
}
