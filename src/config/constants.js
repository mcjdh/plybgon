// Game Configuration and Constants
export const CONFIG = {
    // Canvas settings
    CANVAS_WIDTH: 400,
    CANVAS_HEIGHT: 600,

    // Player settings
    PLAYER_SPEED: 6,
    PLAYER_WIDTH: 30,
    PLAYER_HEIGHT: 30,
    PLAYER_FIRE_RATE: 200, // ms between shots (faster firing)
    PLAYER_START_LIVES: 3,

    // Bullet settings
    BULLET_SPEED: 10,
    BULLET_WIDTH: 4,
    BULLET_HEIGHT: 12,

    // Enemy settings
    ENEMY_SPEED: 1, // Slower base speed
    ENEMY_WIDTH: 30,
    ENEMY_HEIGHT: 30,
    ENEMY_BULLET_SPEED: 3,
    ENEMY_FIRE_RATE: 1500, // ms between shots (enemies shoot less frequently)
    ENEMY_DROP_DISTANCE: 15, // Less aggressive drop
    ENEMY_BOUNDARY_MARGIN: 30,

    // Colors
    COLORS: {
        BACKGROUND: '#000',
        PLAYER: '#0f0',
        PLAYER_BULLET: '#0ff',
        ENEMY_BULLET: '#f00',
        ENEMY_TYPE_1: '#f0f',
        ENEMY_TYPE_2: '#ff0',
        ENEMY_TYPE_3: '#f80',
        UI_TEXT: '#0f0',
        GAME_OVER: '#f00'
    },

    // Scoring
    POINTS: {
        ENEMY_TYPE_1: 10,
        ENEMY_TYPE_2: 20,
        ENEMY_TYPE_3: 30
    },

    // Level progression
    DIFFICULTY_INCREASE_PER_LOOP: 0.15, // 15% faster each loop

    // Animation
    ENEMY_ANIMATION_SPEED: 300, // ms per frame
    EXPLOSION_DURATION: 500, // ms

    // Object pooling
    BULLET_POOL_SIZE: 100,

    // Sound
    SOUND_VOLUME: 0.3,

    // Touch/Mobile
    TOUCH_SMOOTHING: 0.1, // Lower = more responsive, higher = smoother
    TOUCH_DEAD_ZONE: 5, // pixels - ignore small movements

    // Level boundaries
    LEVEL_SAFE_X_MIN: 40,
    LEVEL_SAFE_X_MAX: 360
};

export const GAME_STATES = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver'
};
