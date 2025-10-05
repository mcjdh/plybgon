import { CONFIG } from '../config/constants.js';

// Manages score and lives
export class ScoreSystem {
    constructor() {
        this.score = 0;
        this.lives = CONFIG.PLAYER_START_LIVES;
        this.onLifeLost = null; // Callback when life is lost
        this.onGameOver = null; // Callback when game over
    }

    /**
     * Add points to score
     * @param {number} points - Points to add
     */
    addScore(points) {
        this.score += points;
    }

    /**
     * Player takes damage
     */
    loseLife() {
        this.lives--;

        if (this.onLifeLost) {
            this.onLifeLost(this.lives);
        }

        if (this.lives <= 0) {
            if (this.onGameOver) {
                this.onGameOver();
            }
        }
    }

    /**
     * Check if player is alive
     * @returns {boolean}
     */
    isAlive() {
        return this.lives > 0;
    }

    /**
     * Reset score and lives
     */
    reset() {
        this.score = 0;
        this.lives = CONFIG.PLAYER_START_LIVES;
    }

    /**
     * Get current state
     * @returns {Object} - {score, lives}
     */
    getState() {
        return {
            score: this.score,
            lives: this.lives
        };
    }
}
