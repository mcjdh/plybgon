import { CONFIG, GAME_STATES } from '../config/constants.js';
import { Player } from '../entities/Player.js';
import { Renderer } from './Renderer.js';
import { InputManager } from './InputManager.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { SpawnSystem } from '../systems/SpawnSystem.js';
import { ScoreSystem } from '../systems/ScoreSystem.js';
import { LevelManager } from '../levels/levelManager.js';
import { SoundManager } from '../utils/SoundManager.js';

// Main Game class - orchestrates everything
export class Game {
    constructor(canvas) {
        this.canvas = canvas;

        // Core systems
        this.renderer = new Renderer(canvas);
        this.inputManager = new InputManager(canvas);
        this.collisionSystem = new CollisionSystem();
        this.spawnSystem = new SpawnSystem();
        this.scoreSystem = new ScoreSystem();
        this.levelManager = new LevelManager();
        this.soundManager = new SoundManager();

        // Game state
        this.state = GAME_STATES.PLAYING;
        this.player = null;
        this.bullets = [];
        this.enemies = [];
        this.enemyBullets = [];

        // Timing
        this.lastFrameTime = 0;

        // Setup callbacks
        this.setupCallbacks();

        // Initialize game
        this.init();
    }

    setupCallbacks() {
        // Input callbacks
        this.inputManager.onRestart = () => {
            if (this.state === GAME_STATES.GAME_OVER) {
                this.restart();
            }
        };

        // Score callbacks
        this.scoreSystem.onGameOver = () => {
            this.gameOver();
        };
    }

    init() {
        // Create player
        this.player = new Player(
            CONFIG.CANVAS_WIDTH / 2,
            CONFIG.CANVAS_HEIGHT - 50
        );

        // Spawn first wave
        this.enemies = this.levelManager.spawnEnemies();

        // Start game loop
        this.lastFrameTime = performance.now();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    gameLoop(currentTime) {
        const deltaTime = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
        this.lastFrameTime = currentTime;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        if (this.state !== GAME_STATES.PLAYING) return;

        // Update player
        this.player.update(deltaTime, this.inputManager);

        // Auto-fire
        const newBullet = this.spawnSystem.spawnPlayerBullet(this.player);
        if (newBullet) {
            this.bullets.push(newBullet);
            this.soundManager.play('shoot');
        }

        // Update all bullets and enemies in unified loops
        this.updateEntities([
            ...this.bullets,
            ...this.enemyBullets
        ], deltaTime);

        this.levelManager.updateEnemies(this.enemies, deltaTime);

        // Spawn enemy bullets
        const newEnemyBullets = this.spawnSystem.spawnEnemyBullets(this.enemies, deltaTime);
        this.enemyBullets.push(...newEnemyBullets);

        // Check collisions in single optimized pass
        const collisionResults = this.collisionSystem.checkAllCollisions({
            bullets: this.bullets,
            enemies: this.enemies,
            enemyBullets: this.enemyBullets,
            player: this.player
        });

        // Handle collision results
        if (collisionResults.scoreGained > 0) {
            this.scoreSystem.addScore(collisionResults.scoreGained);
            this.soundManager.play('enemyHit');
        }

        if (collisionResults.playerHit || collisionResults.enemyReachedPlayer) {
            this.player.explode();
            this.scoreSystem.loseLife();
            this.soundManager.play('playerHit');
        }

        // Clean up inactive entities in single pass
        this.cleanupInactiveEntities();

        // Check if wave is cleared
        if (this.enemies.length === 0) {
            this.soundManager.play('levelComplete');
            this.nextWave();
        }
    }

    /**
     * Update all entities in a single loop
     * @param {Array} entities - Array of entities to update
     * @param {number} deltaTime - Time delta
     */
    updateEntities(entities, deltaTime) {
        for (const entity of entities) {
            if (!entity.active) continue;

            entity.update(deltaTime);
            if (entity.isOffScreen && entity.isOffScreen(CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT)) {
                entity.destroy();
            }
        }
    }

    /**
     * Clean up all inactive entities and return bullets to pool
     */
    cleanupInactiveEntities() {
        // Return bullets to pool first
        this.spawnSystem.releaseBullets(this.bullets);
        this.spawnSystem.releaseBullets(this.enemyBullets);

        // Filter out inactive entities
        this.bullets = this.bullets.filter(b => b.active);
        this.enemies = this.enemies.filter(e => e.active);
        this.enemyBullets = this.enemyBullets.filter(b => b.active);
    }

    nextWave() {
        this.levelManager.nextLevel();
        this.enemies = this.levelManager.spawnEnemies();
    }

    render() {
        const gameState = {
            state: this.state,
            player: this.player,
            bullets: this.bullets,
            enemies: this.enemies,
            enemyBullets: this.enemyBullets,
            score: this.scoreSystem.score,
            lives: this.scoreSystem.lives
        };

        this.renderer.render(gameState);
    }

    gameOver() {
        this.state = GAME_STATES.GAME_OVER;
    }

    restart() {
        this.state = GAME_STATES.PLAYING;

        // Reset systems
        this.scoreSystem.reset();
        this.spawnSystem.reset();
        this.levelManager.reset();

        // Clear entities
        this.bullets = [];
        this.enemyBullets = [];

        // Recreate player
        this.player = new Player(
            CONFIG.CANVAS_WIDTH / 2,
            CONFIG.CANVAS_HEIGHT - 50
        );

        // Spawn enemies
        this.enemies = this.levelManager.spawnEnemies();

        // Hide game over screen
        this.renderer.hideGameOver();
    }
}
