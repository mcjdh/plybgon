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
    }
};

export const GAME_STATES = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver'
};
