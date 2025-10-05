import { CONFIG, GAME_STATES } from '../config/constants.js';
import { Player } from '../entities/Player.js';
import { Renderer } from './Renderer.js';
import { InputManager } from './InputManager.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { SpawnSystem } from '../systems/SpawnSystem.js';
import { ScoreSystem } from '../systems/ScoreSystem.js';
import { LevelManager } from '../levels/levelManager.js';
import { SoundManager } from '../utils/SoundManager.js';
import { EntityManager } from '../systems/EntityManager.js';

// Main Game class - orchestrates everything with centralized entity management
export class Game {
    constructor(canvas) {
        this.canvas = canvas;

        // Core systems
        this.renderer = new Renderer(canvas);
        this.inputManager = new InputManager(canvas);
        this.entityManager = new EntityManager(); // Centralized entity management
        this.collisionSystem = new CollisionSystem(this.entityManager);
        this.spawnSystem = new SpawnSystem(this.entityManager);
        this.scoreSystem = new ScoreSystem();
        this.levelManager = new LevelManager();
        this.soundManager = new SoundManager();

        // Game state
        this.state = GAME_STATES.PLAYING;

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
        // Create player and add to entity manager
        const player = new Player(
            CONFIG.CANVAS_WIDTH / 2,
            CONFIG.CANVAS_HEIGHT - 50
        );
        this.entityManager.add(player, this.entityManager.entityTypes.PLAYER);

        // Spawn first wave
        const enemies = this.levelManager.spawnEnemies();
        enemies.forEach(enemy =>
            this.entityManager.add(enemy, this.entityManager.entityTypes.ENEMY)
        );

        // Process additions
        this.entityManager.processPendingAdditions();

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

        const player = this.entityManager.getPlayer();
        if (!player) return;

        // Auto-fire
        if (this.spawnSystem.trySpawnPlayerBullet(player, deltaTime)) {
            this.soundManager.play('shoot');
        }

        // Spawn enemy bullets
        this.spawnSystem.spawnEnemyBullets(deltaTime);

        // Update all entities (unified system)
        this.entityManager.update(deltaTime, {
            inputManager: this.inputManager,
            enemyDirection: this.levelManager.enemyDirection,
            canvasWidth: CONFIG.CANVAS_WIDTH,
            canvasHeight: CONFIG.CANVAS_HEIGHT
        });

        // Update enemy group movement
        const enemies = this.entityManager.getByType(this.entityManager.entityTypes.ENEMY);
        this.levelManager.updateEnemies(enemies, deltaTime);

        // Process pending additions
        this.entityManager.processPendingAdditions();

        // Check collisions (EntityManager-based)
        const collisionResults = this.collisionSystem.checkAllCollisions();

        // Handle collision results
        if (collisionResults.scoreGained > 0) {
            this.scoreSystem.addScore(collisionResults.scoreGained);
            this.soundManager.play('enemyHit');
        }

        if (collisionResults.playerHit || collisionResults.enemyReachedPlayer) {
            player.explode();
            this.scoreSystem.loseLife();
            this.soundManager.play('playerHit');
        }

        // Clean up inactive entities
        this.entityManager.cleanup((bullets) => {
            this.spawnSystem.releaseBullets(bullets);
        });

        // Check if wave is cleared
        if (this.entityManager.countByType(this.entityManager.entityTypes.ENEMY) === 0) {
            this.soundManager.play('levelComplete');
            this.nextWave();
        }
    }

    nextWave() {
        this.levelManager.nextLevel();
        const enemies = this.levelManager.spawnEnemies();
        enemies.forEach(enemy =>
            this.entityManager.add(enemy, this.entityManager.entityTypes.ENEMY)
        );
        this.entityManager.processPendingAdditions();
    }

    render() {
        const gameState = {
            state: this.state,
            player: this.entityManager.getPlayer(),
            bullets: this.entityManager.getByType(this.entityManager.entityTypes.BULLET),
            enemies: this.entityManager.getByType(this.entityManager.entityTypes.ENEMY),
            enemyBullets: this.entityManager.getByType(this.entityManager.entityTypes.ENEMY_BULLET),
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

        // Clear entity manager
        this.entityManager.clear();

        // Recreate player
        const player = new Player(
            CONFIG.CANVAS_WIDTH / 2,
            CONFIG.CANVAS_HEIGHT - 50
        );
        this.entityManager.add(player, this.entityManager.entityTypes.PLAYER);

        // Spawn enemies
        const enemies = this.levelManager.spawnEnemies();
        enemies.forEach(enemy =>
            this.entityManager.add(enemy, this.entityManager.entityTypes.ENEMY)
        );

        // Process additions
        this.entityManager.processPendingAdditions();

        // Hide game over screen
        this.renderer.hideGameOver();
    }
}
