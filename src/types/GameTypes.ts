export interface GameConfig {
    canvas: HTMLCanvasElement;
    width?: number;
    height?: number;
    audioEnabled?: boolean;
}

export type GameState = 'menu' | 'playing' | 'paused' | 'level-complete' | 'game-over' | 'victory';

export interface GameSettings {
    audioEnabled: boolean;
    musicVolume: number;
    soundVolume: number;
    difficulty: 'easy' | 'normal' | 'hard';
}

export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Position {
    x: number;
    y: number;
}

export interface Velocity {
    x: number;
    y: number;
}

export enum CollisionType {
    NONE = 'none',
    PLAYER_ALIEN = 'player-alien',
    PLAYER_BOMB = 'player-bomb',
    BULLET_ALIEN = 'bullet-alien',
    BULLET_BUILDING = 'bullet-building',
    BOMB_BUILDING = 'bomb-building',
    BOMB_PLAYER = 'bomb-player',
    BULLET_UFO = 'bullet-ufo',
}

export enum SoundType {
    LASER = 'laser',
    EXPLOSION = 'explosion',
    UFO = 'ufo',
    POWERUP = 'powerup',
    LEVEL_COMPLETE = 'level_complete',
    GAME_OVER = 'game_over',
    VICTORY = 'victory',
}

export enum RenderLayer {
    BACKGROUND = 0,
    BUILDINGS = 1,
    ALIENS = 2,
    UFO = 3,
    PLAYER = 4,
    PROJECTILES = 5,
    PARTICLES = 6,
    UI = 7,
}
