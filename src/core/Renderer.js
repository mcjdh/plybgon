import { CONFIG, GAME_STATES } from '../config/constants.js';

// Handles all rendering/drawing
export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Setup high-DPI canvas
        this.setupHighDPI();

        // Cache DOM elements
        this.scoreElement = document.getElementById('score');
        this.gameOverElement = document.getElementById('gameOver');

        // Track last rendered values to avoid unnecessary DOM updates
        this.lastScore = -1;
        this.lastGameOverState = false;
    }

    /**
     * Setup canvas for high-DPI displays
     */
    setupHighDPI() {
        const dpr = window.devicePixelRatio || 1;

        // Set display size (CSS pixels)
        this.canvas.style.width = CONFIG.CANVAS_WIDTH + 'px';
        this.canvas.style.height = CONFIG.CANVAS_HEIGHT + 'px';

        // Set actual size in memory (scaled for DPI)
        this.canvas.width = CONFIG.CANVAS_WIDTH * dpr;
        this.canvas.height = CONFIG.CANVAS_HEIGHT * dpr;

        // Scale context to match DPI
        this.ctx.scale(dpr, dpr);

        // Improve rendering quality
        this.ctx.imageSmoothingEnabled = false; // Crisp pixel art
    }

    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.fillStyle = CONFIG.COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Render all game entities
     * @param {Array} entities - Array of entities to render
     */
    renderEntities(entities) {
        entities.forEach(entity => {
            if (entity.active) {
                entity.draw(this.ctx);
            }
        });
    }

    /**
     * Render UI (score, lives)
     * @param {number} score - Current score
     * @param {number} lives - Remaining lives
     */
    renderUI(score, lives) {
        this.ctx.fillStyle = CONFIG.COLORS.UI_TEXT;
        this.ctx.font = '16px "Courier New"';

        // Lives at bottom left (canvas)
        this.ctx.fillText(`LIVES: ${lives}`, 10, CONFIG.CANVAS_HEIGHT - 10);

        // Score at top left (DOM - only update if changed)
        if (score !== this.lastScore) {
            this.scoreElement.textContent = `SCORE: ${score}`;
            this.lastScore = score;
        }
    }

    /**
     * Render game over screen
     */
    renderGameOver() {
        if (!this.lastGameOverState) {
            this.gameOverElement.style.display = 'block';
            this.lastGameOverState = true;
        }
    }

    /**
     * Hide game over screen
     */
    hideGameOver() {
        if (this.lastGameOverState) {
            this.gameOverElement.style.display = 'none';
            this.lastGameOverState = false;
        }
    }

    /**
     * Main render method
     * @param {Object} gameState - Current game state
     */
    render(gameState) {
        this.clear();

        // Render all entities in a single unified loop
        this.renderEntities([
            gameState.player,
            ...gameState.bullets,
            ...gameState.enemies,
            ...gameState.enemyBullets
        ]);

        // Render UI
        this.renderUI(gameState.score, gameState.lives);

        // Render game over if needed
        if (gameState.state === GAME_STATES.GAME_OVER) {
            this.renderGameOver();
        } else {
            this.hideGameOver();
        }
    }
}
