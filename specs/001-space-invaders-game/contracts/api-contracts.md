# Game API Contracts

**Date**: 2026-02-07  
**Feature**: Space InvAIders Browser Game  
**Purpose**: Define public interfaces and game APIs

---

## 1. Game Initialization API

### Game Constructor

```typescript
interface GameConfig {
  canvas: HTMLCanvasElement;           // Game canvas element
  width?: number;                     // Canvas width (default: 800)
  height?: number;                    // Canvas height (default: 600)
  audioEnabled?: boolean;              // Audio on/off (default: true)
  difficulty?: Difficulty;              // Game difficulty (default: normal)
}

class SpaceInvadersGame {
  constructor(config: GameConfig);
  
  // Lifecycle methods
  start(): void;                      // Start game from menu
  pause(): void;                      // Pause gameplay
  resume(): void;                     // Resume from pause
  stop(): void;                       // Stop and cleanup
  
  // State accessors
  getState(): GameState;               // Current game state
  getScore(): number;                  // Current score
  getLives(): number;                  // Remaining lives
  getLevel(): number;                  // Current level
  getHighScores(): HighScore[];       // Top 10 high scores
}

enum Difficulty {
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard'
}
```

---

## 2. Input System API

### Input Events

```typescript
interface InputSystem {
  // Keyboard input
  onKeyPressed(key: string, callback: () => void): void;
  onKeyReleased(key: string, callback: () => void): void;
  
  // Touch/mobile input
  onTouchStart(callback: (x: number, y: number) => void): void;
  onTouchMove(callback: (x: number, y: number) => void): void;
  onTouchEnd(callback: () => void): void;
  
  // Input state
  isKeyPressed(key: string): boolean;
  getMousePosition(): {x: number, y: number};
}

// Standard input mappings
const INPUT_KEYS = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight', 
  SHOOT: ' ',
  PAUSE: 'Escape',
  START: 'Enter'
} as const;
```

---

## 3. Audio System API

### Audio Management

```typescript
interface AudioSystem {
  // Initialization
  init(): Promise<void>;               // Load and initialize audio
  setVolume(volume: number): void;     // Master volume (0.0-1.0)
  mute(): void;                       // Mute all audio
  unmute(): void;                     // Unmute audio
  
  // Sound effects
  playSound(type: SoundType): void;    // Play one-shot sound
  stopSound(type: SoundType): void;    // Stop specific sound
  
  // Music
  playMusic(): void;                  // Start background music
  stopMusic(): void;                  // Stop background music
  setMusicVolume(volume: number): void; // Music volume (0.0-1.0)
  
  // Status
  isAudioEnabled(): boolean;           // Audio availability
  isMuted(): boolean;                 // Mute status
}

enum SoundType {
  LASER = 'laser',
  EXPLOSION = 'explosion',
  UFO = 'ufo',
  POWERUP = 'powerup',
  LEVEL_COMPLETE = 'level_complete',
  GAME_OVER = 'game_over',
  VICTORY = 'victory'
}
```

---

## 4. Rendering System API

### Rendering Interface

```typescript
interface RenderSystem {
  // Frame management
  beginFrame(): void;                // Prepare for new frame
  endFrame(): void;                  // Complete and present frame
  
  // Drawing operations
  clear(color?: string): void;        // Clear canvas
  drawRect(rect: Rectangle, color: string): void;
  drawSprite(sprite: Sprite, x: number, y: number): void;
  drawText(text: string, x: number, y: number, style: TextStyle): void;
  
  // Layers
  setLayer(layer: RenderLayer): void;  // Set active render layer
  clearLayer(layer: RenderLayer): void; // Clear specific layer
  
  // Camera/viewport
  setViewport(viewport: Viewport): void; // Set rendering viewport
}

enum RenderLayer {
  BACKGROUND = 0,     // Static background
  BUILDINGS = 1,      // City buildings
  ALIENS = 2,         // Enemy aliens
  UFO = 3,            // Bonus UFO
  PLAYER = 4,         // Player cannon
  PROJECTILES = 5,     // Bullets and bombs
  PARTICLES = 6,       // Visual effects
  UI = 7             // Score, lives, etc.
}

interface TextStyle {
  font: string;
  size: number;
  color: string;
  align?: 'left' | 'center' | 'right';
  baseline?: 'top' | 'middle' | 'bottom';
}
```

---

## 5. Persistence System API

### Data Storage

```typescript
interface PersistenceSystem {
  // High scores
  saveHighScore(score: HighScore): Promise<void>;
  getHighScores(): Promise<HighScore[]>;     // Top 10 scores
  clearHighScores(): Promise<void>;
  
  // Game settings
  saveSettings(settings: GameSettings): Promise<void>;
  getSettings(): Promise<GameSettings>;        // Load saved settings
  
  // Game state (optional - for save/load game)
  saveGameState(state: GameState): Promise<void>;
  loadGameState(): Promise<GameState | null>;
}

interface HighScore {
  name: string;
  score: number;
  date: string;                    // ISO timestamp
  level: number;                   // Level achieved
}

interface GameSettings {
  audioEnabled: boolean;
  musicVolume: number;              // 0.0-1.0
  soundVolume: number;              // 0.0-1.0
  difficulty: Difficulty;
  highScores: HighScore[];
}
```

---

## 6. Entity Component System API

### Entity Management

```typescript
interface Entity {
  id: string;                       // Unique identifier
  active: boolean;                  // Active state
  components: Map<string, Component>; // Entity components
}

interface Component {
  readonly type: string;
  entityId: string;
}

// Core components
interface PositionComponent extends Component {
  type: 'position';
  x: number;
  y: number;
}

interface VelocityComponent extends Component {
  type: 'velocity';
  vx: number;
  vy: number;
}

interface RenderComponent extends Component {
  type: 'render';
  sprite: Sprite | null;           // null for simple shapes
  color: string;                  // Shape color if no sprite
  width: number;
  height: number;
  layer: RenderLayer;
}

interface CollisionComponent extends Component {
  type: 'collision';
  hitbox: Rectangle;
  collidesWith: string[];         // Entity types to collide with
  onCollision: (other: Entity) => void;
}

interface HealthComponent extends Component {
  type: 'health';
  current: number;                // Current health
  max: number;                    // Maximum health
  onDamage: (amount: number) => void;
  onDestroy: () => void;
}

// Entity system
interface EntitySystem {
  createEntity(id: string): Entity;
  addComponent(entity: Entity, component: Component): void;
  removeComponent(entity: Entity, componentType: string): void;
  getComponent<T extends Component>(entity: Entity, type: string): T | null;
  destroyEntity(entity: Entity): void;
  
  // Queries
  getEntitiesWithComponent(type: string): Entity[];
  getEntitiesWithComponents(types: string[]): Entity[];
}
```

---

## 7. Event System API

### Game Events

```typescript
interface EventSystem {
  // Event registration
  on(event: GameEvent, callback: EventCallback): void;
  off(event: GameEvent, callback: EventCallback): void;
  emit(event: GameEvent, data?: any): void;
  
  // Event queueing
  queueEvent(event: GameEvent, data?: any): void;
  processEvents(): void;
}

type EventCallback = (data?: any) => void;

enum GameEvent {
  // Game flow
  GAME_STARTED = 'game_started',
  GAME_PAUSED = 'game_paused',
  GAME_RESUMED = 'game_resumed',
  GAME_OVER = 'game_over',
  VICTORY = 'victory',
  LEVEL_STARTED = 'level_started',
  LEVEL_COMPLETED = 'level_completed',
  
  // Player actions
  PLAYER_MOVED = 'player_moved',
  PLAYER_SHOT = 'player_shot',
  PLAYER_HIT = 'player_hit',
  PLAYER_DIED = 'player_died',
  
  // Combat
  ALIEN_HIT = 'alien_hit',
  ALIEN_DESTROYED = 'alien_destroyed',
  UFO_HIT = 'ufo_hit',
  UFO_DESTROYED = 'ufo_destroyed',
  BUILDING_HIT = 'building_hit',
  BUILDING_DESTROYED = 'building_destroyed',
  
  // Spawning
  UFO_SPAWNED = 'ufo_spawned',
  BOMB_SPAWNED = 'bomb_spawned',
  PARTICLE_EFFECT = 'particle_effect',
  
  // Scoring
  SCORE_CHANGED = 'score_changed',
  HIGH_SCORE_ACHIEVED = 'high_score_achieved'
}
```

---

## 8. Configuration API

### Game Constants

```typescript
interface GameConstants {
  // Display
  CANVAS_WIDTH: number;             // Default: 800
  CANVAS_HEIGHT: number;            // Default: 600
  
  // Game entities
  PLAYER_WIDTH: number;             // Default: 32
  PLAYER_HEIGHT: number;            // Default: 24
  ALIEN_WIDTH: number;             // Default: 24
  ALIEN_HEIGHT: number;            // Default: 18
  BUILDING_WIDTH: number;           // Default: 48
  BUILDING_HEIGHT: number;          // Default: 36
  UFO_WIDTH: number;               // Default: 48
  UFO_HEIGHT: number;              // Default: 24
  
  // Grid layout
  ALIEN_ROWS: number;              // Default: 6
  ALIEN_COLUMNS: number;           // Default: 8
  BUILDING_COUNT: number;          // Default: 5
  
  // Movement speeds
  PLAYER_SPEED: number;            // Default: 6.0
  BULLET_SPEED: number;            // Default: -10.0
  BOMB_SPEED: number;              // Default: 4.0
  ALIEN_BASE_SPEED: number;        // Default: 1.0
  UFO_SPEED: number;               // Default: 3.0
  
  // Game limits
  MAX_BULLETS: number;            // Default: 10
  MAX_BOMBS: number;              // Default: 5
  MAX_PARTICLES: number;           // Default: 200
  INITIAL_LIVES: number;           // Default: 3
  MAX_LEVELS: number;             // Default: 20
  
  // Timing
  SHOOT_COOLDOWN: number;          // Default: 250 (ms)
  UFO_MIN_SPAWN_TIME: number;     // Default: 30000 (ms)
  UFO_MAX_SPAWN_TIME: number;     // Default: 90000 (ms)
  
  // Scoring
  ALIEN_POINTS: number;            // Default: 100
  UFO_POINTS: number;              // Default: 200
  BONUS_UFO_POINTS: number;       // Default: 400
  LEVEL_BONUS: number;            // Default: 1000
}
```

---

## 9. Performance Monitoring API

### Performance Tracking

```typescript
interface PerformanceMonitor {
  // Frame tracking
  beginFrame(): void;
  endFrame(): void;
  getFPS(): number;
  getFrameTime(): number;
  
  // Entity tracking
  trackEntity(): void;
  getEntityCount(): number;
  
  // Memory tracking
  getMemoryUsage(): number;        // MB
  checkMemoryLeaks(): boolean;
  
  // Performance warnings
  onPerformanceIssue(callback: (issue: PerformanceIssue) => void): void;
  
  // Benchmarking
  runBenchmark(): Promise<BenchmarkResult>;
}

interface PerformanceIssue {
  type: 'LOW_FPS' | 'HIGH_MEMORY' | 'MEMORY_LEAK' | 'SPAWN_LAG';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
}

interface BenchmarkResult {
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  frameTime: {average: number, min: number, max: number};
  memoryUsage: {average: number, peak: number};
  entityCount: number;
}
```

---

## 10. Testing API

### Test Interfaces

```typescript
interface TestGame {
  // Test state control
  setFrameTime(frameTime: number): void;     // Fixed timestep for testing
  setRandomSeed(seed: number): void;         // Reproducible randomness
  
  // Test utilities
  spawnEntity(type: string, config: any): Entity;
  triggerCollision(entity1: Entity, entity2: Entity): void;
  getGameState(): GameState;
  
  // Test assertions
  assertEntityCount(type: string, expected: number): void;
  assertScore(expected: number): void;
  assertLives(expected: number): void;
  assertLevel(expected: number): void;
}

interface MockCanvas {
  // Canvas API mocking for unit tests
  getContext(contextId: string): MockCanvas2DContext;
  width: number;
  height: number;
}

interface MockCanvas2DContext {
  // Drawing methods (track calls for assertions)
  fillRect(x: number, y: number, w: number, h: number): void;
  drawImage(image: any, x: number, y: number): void;
  fillText(text: string, x: number, y: number): void;
  
  // Test utilities
  getDrawCalls(): DrawCall[];
  clearDrawCalls(): void;
}
```

---

These API contracts provide a comprehensive foundation for implementing the Space InvAIders game with clean interfaces, proper separation of concerns, and testability. All systems are designed to work together while maintaining loose coupling for maintainability and extensibility.