import { CONFIG, GAME_STATES } from '../config/constants.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.setupHighDPI();

        this.scoreElement = document.getElementById('score');
        this.gameOverElement = document.getElementById('gameOver');

        this.lastScore = -1;
        this.lastGameOverState = false;
    }

    setupHighDPI() {
        const dpr = window.devicePixelRatio || 1;

        this.canvas.style.width = CONFIG.CANVAS_WIDTH + 'px';
        this.canvas.style.height = CONFIG.CANVAS_HEIGHT + 'px';

        this.canvas.width = CONFIG.CANVAS_WIDTH * dpr;
        this.canvas.height = CONFIG.CANVAS_HEIGHT * dpr;

        this.ctx.scale(dpr, dpr);
        this.ctx.imageSmoothingEnabled = false;
    }

    clear() {
        this.ctx.fillStyle = CONFIG.COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderEntities(entities) {
        entities.forEach(entity => {
            if (entity.active) {
                entity.draw(this.ctx);
            }
        });
    }

    renderUI(score, lives) {
        this.ctx.fillStyle = CONFIG.COLORS.UI_TEXT;
        this.ctx.font = '16px "Courier New"';

        this.ctx.fillText(`LIVES: ${lives}`, 10, CONFIG.CANVAS_HEIGHT - 10);

        if (score !== this.lastScore) {
            this.scoreElement.textContent = `SCORE: ${score}`;
            this.lastScore = score;
        }
    }

    renderGameOver() {
        if (!this.lastGameOverState) {
            this.gameOverElement.style.display = 'block';
            this.lastGameOverState = true;
        }
    }

    hideGameOver() {
        if (this.lastGameOverState) {
            this.gameOverElement.style.display = 'none';
            this.lastGameOverState = false;
        }
    }

    render(gameState) {
        this.clear();

        this.renderEntities([
            gameState.player,
            ...gameState.bullets,
            ...gameState.enemies,
            ...gameState.enemyBullets
        ]);

        this.renderUI(gameState.score, gameState.lives);

        if (gameState.state === GAME_STATES.GAME_OVER) {
            this.renderGameOver();
        } else {
            this.hideGameOver();
        }
    }
}
