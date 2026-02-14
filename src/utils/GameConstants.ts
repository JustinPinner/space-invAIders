// Standard input mappings
export const INPUT_KEYS = {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    SHOOT: ' ',
    PAUSE: 'Escape',
    START: 'Enter',
} as const;

// Game display constants
export const GAME_CONSTANTS = {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,

    // Game entities
    PLAYER_WIDTH: 32,
    PLAYER_HEIGHT: 24,
    ALIEN_WIDTH: 24,
    ALIEN_HEIGHT: 18,
    BUILDING_WIDTH: 48,
    BUILDING_HEIGHT: 36,
    UFO_WIDTH: 48,
    UFO_HEIGHT: 24,

    // Grid layout
    ALIEN_ROWS: 6,
    ALIEN_COLUMNS: 8,
    BUILDING_COUNT: 5,

    // Movement speeds (pixels per frame)
    PLAYER_SPEED: 6.0,
    BULLET_SPEED: -10.0,
    BOMB_SPEED: 4.0,
    ALIEN_BASE_SPEED: 1.0,
    UFO_SPEED: 3.0,

    // Game limits
    MAX_BULLETS: 10,
    MAX_BOMBS: 5,
    MAX_PARTICLES: 50,
    MAX_ALIENS: 55,
    INITIAL_LIVES: 3,
    MAX_LEVELS: 20,

    // Timing (milliseconds)
    SHOOT_COOLDOWN: 250,
    UFO_MIN_SPAWN_TIME: 30000, // 30 seconds
    UFO_MAX_SPAWN_TIME: 90000, // 90 seconds

    // Scoring
    ALIEN_POINTS: 100,
    UFO_POINTS: 200,
    BONUS_UFO_POINTS: 400,
    LEVEL_BONUS: 1000,

    // Performance targets
    TARGET_FPS: 60,
    MAX_FRAME_TIME: 16.67, // 1000ms / 60fps
    TARGET_STARTUP_TIME: 3000, // 3 seconds

    // Memory targets (MB)
    TARGET_MEMORY_USAGE: 50,
    MAX_MEMORY_USAGE: 256,

    // UI layout constants
    UI_MARGIN: 20,
    UI_HEIGHT: 60,
    SCORE_OFFSET_X: 20,
    LIVES_OFFSET_X: 20,
    TITLE_CENTER_X: 400,
    SCORE_OFFSET_Y: 30,
    LIVES_OFFSET_Y: 30,

    // Grid positioning
    ALIEN_START_X: 100,
    ALIEN_START_Y: 100,
    ALIEN_SPACING_X: 40,
    ALIEN_SPACING_Y: 30,

    // Building positioning
    BUILDING_Y: 500,
    BUILDING_START_X: 150,
    BUILDING_SPACING_X: 100,

    // Player positioning
    PLAYER_Y: 550,
    PLAYER_START_X: 384, // Center

    // UFO positioning
    UFO_Y: 50,
    UFO_SPAWN_HEIGHT: 60,

    // Colors
    COLORS: {
        PLAYER: '#00ff00',
        ALIEN: '#ff0000',
        BUILDING: '#0088ff',
        UFO: '#ffff00',
        BULLET: '#00ff00',
        BOMB: '#ff8800',
        EXPLOSION: '#ff6600',
        BACKGROUND: '#000033',
        UI_TEXT: '#ffffff',
        UI_BACKGROUND: '#111111',
    },
} as const;

// Export individual constants for easier access
export const {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
    ALIEN_WIDTH,
    ALIEN_HEIGHT,
    BUILDING_WIDTH,
    BUILDING_HEIGHT,
    UFO_WIDTH,
    UFO_HEIGHT,
    ALIEN_ROWS,
    ALIEN_COLUMNS,
    BUILDING_COUNT,
    PLAYER_SPEED,
    BULLET_SPEED,
    BOMB_SPEED,
    ALIEN_BASE_SPEED,
    UFO_SPEED,
    MAX_BULLETS,
    MAX_BOMBS,
    INITIAL_LIVES,
    MAX_LEVELS,
    SHOOT_COOLDOWN,
    UFO_MIN_SPAWN_TIME,
    UFO_MAX_SPAWN_TIME,
    ALIEN_POINTS,
    UFO_POINTS,
    BONUS_UFO_POINTS,
    LEVEL_BONUS,
    TARGET_FPS,
    MAX_FRAME_TIME,
    COLORS,
} = GAME_CONSTANTS;
