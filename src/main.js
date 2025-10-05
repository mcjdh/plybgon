import { Game } from './core/Game.js';

// Entry point - initialize game when DOM is ready
window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas');

    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    // Create and start the game
    const game = new Game(canvas);

    // Expose game to window for debugging (optional)
    window.game = game;

    console.log('Galagon game started!');
});
