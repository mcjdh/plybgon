import { Component } from './Component.js';

// Health Component - Handles hit points and damage
export class HealthComponent extends Component {
    constructor(entity, maxHealth = 1) {
        super(entity);
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.invulnerable = false;
        this.invulnerabilityTimer = 0;
    }

    update(deltaTime, context) {
        if (!this.enabled) return;

        // Update invulnerability timer
        if (this.invulnerable && this.invulnerabilityTimer > 0) {
            this.invulnerabilityTimer -= deltaTime;
            if (this.invulnerabilityTimer <= 0) {
                this.invulnerable = false;
            }
        }
    }

    /**
     * Take damage
     * @param {number} amount - Damage amount
     * @returns {boolean} - True if entity died
     */
    takeDamage(amount = 1) {
        if (this.invulnerable) return false;

        this.currentHealth -= amount;
        if (this.currentHealth <= 0) {
            this.currentHealth = 0;
            this.entity.destroy();
            return true;
        }
        return false;
    }

    /**
     * Heal entity
     */
    heal(amount = 1) {
        this.currentHealth = Math.min(this.currentHealth + amount, this.maxHealth);
    }

    /**
     * Make entity invulnerable for duration
     */
    setInvulnerable(duration) {
        this.invulnerable = true;
        this.invulnerabilityTimer = duration;
    }

    /**
     * Check if entity is alive
     */
    isAlive() {
        return this.currentHealth > 0;
    }
}
