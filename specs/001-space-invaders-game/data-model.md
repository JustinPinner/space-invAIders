# Data Model: Space InvAIders

**Date**: 2026-02-07  
**Feature**: Space InvAIders Browser Game  
**Entities**: Core game objects and their relationships

---

## Core Game Entities

### 1. Game (Root Entity)

**Description**: Main game controller managing overall game state, levels, and game flow.

**Fields**:
```typescript
interface Game {
  id: string;
  state: GameState;           // 'menu' | 'playing' | 'paused' | 'game-over' | 'victory'
  level: number;             // Current level (1-20)
  score: number;             // Current score
  lives: number;             // Player lives (3 initial)
  highScore: number;          // All-time high score
  settings: GameSettings;     // Audio volume, difficulty settings
  
  // Game entities
  player: Player;             // Player cannon
  aliens: Alien[];           // Enemy aliens (6x8 grid max)
  buildings: Building[];      // City buildings (5 max)
  bullets: Bullet[];          // Player projectiles
  bombs: Bomb[];             // Enemy projectiles
  ufo: UFO | null;          // Current UFO (null if none)
  particles: Particle[];       // Visual effects
  
  // Timing and spawning
  lastUfoSpawn: number;      // Last UFO spawn timestamp
  nextUfoSpawn: number;      // Next UFO spawn window (30-90s)
  alienMoveTimer: number;     // Timer for alien movement
  alienDropDistance: number;  // Pixels aliens drop per row
  
  // Performance tracking
  frameCount: number;         // Total frames rendered
  lastFrameTime: number;      // Last frame timestamp
  fps: number;              // Current FPS
}
```

**State Transitions**:
- `menu` → `playing` (user starts game)
- `playing` → `paused` (user presses pause)
- `paused` → `playing` (user resumes)
- `playing` → `game-over` (player loses all lives)
- `playing` → `victory` (player completes 20 levels)
- `game-over`/`victory` → `menu` (user returns to menu)

---

### 2. Player

**Description**: Player-controlled cannon that can move horizontally and shoot upward.

**Fields**:
```typescript
interface Player {
  id: string;
  x: number;                // Horizontal position
  y: number;                // Fixed vertical position
  width: number;             // Cannon width
  height: number;            // Cannon height
  
  // Movement
  speed: number;             // Horizontal movement speed
  movingLeft: boolean;       // Current movement state
  movingRight: boolean;
  
  // Shooting
  canShoot: boolean;         // Shoot cooldown state
  shootCooldown: number;      // Time between shots
  lastShotTime: number;      // Last shot timestamp
  
  // Visual
  color: string;             // Cannon color
  alive: boolean;            // Alive/death state
  
  // Collision
  hitbox: Rectangle;         // Collision boundary
}
```

**Validation Rules**:
- Position must stay within canvas bounds (0 to canvas.width - width)
- Shoot cooldown minimum: 250ms between shots
- Speed: 5-8 pixels per frame optimal for responsive control

---

### 3. Alien

**Description**: Enemy entities that move in formation and drop bombs.

**Fields**:
```typescript
interface Alien {
  id: string;
  x: number;                // Grid position x
  y: number;                // Grid position y
  width: number;             // Alien width
  height: number;            // Alien height
  
  // Grid formation
  row: number;              // Row in formation (0-5)
  column: number;           // Column in formation (0-7)
  type: AlienType;          // Visual type and point value
  
  // Movement
  speed: number;             // Current movement speed
  direction: number;          // -1 (left) or 1 (right)
  shouldMove: boolean;       // Movement synchronization flag
  
  // Bombing
  canBomb: boolean;          // Can drop bomb (random chance)
  lastBombTime: number;      // Last bomb drop timestamp
  bombCooldown: number;      // Minimum time between bombs
  
  // Visual
  color: string;             // Alien color
  frame: number;            // Animation frame
  alive: boolean;            // Alive state
  
  // Collision
  hitbox: Rectangle;         // Collision boundary
}

enum AlienType {
  BASIC = 'basic',          // 100 points
  FAST = 'fast',            // Variation (future expansion)
  ARMORED = 'armored'       // More hits to destroy (future)
}
```

**Validation Rules**:
- Grid must maintain 6 rows × 8 columns maximum
- Movement synchronized across all aliens
- Only 3-4 aliens can drop bombs simultaneously
- Point value: 100 per alien destroyed

---

### 4. Building

**Description**: Protective buildings that absorb damage from both player and enemy projectiles.

**Fields**:
```typescript
interface Building {
  id: string;
  x: number;                // Horizontal position
  y: number;                // Vertical position (fixed row)
  width: number;             // Building width
  height: number;            // Building height
  
  // Damage system
  health: number;            // Current health (0-100)
  maxHealth: number;         // Maximum health
  damagePerHit: number;      // Damage taken per projectile
  
  // Visual
  color: string;             // Building color
  destroyed: boolean;        // Complete destruction state
  
  // Collision
  hitbox: Rectangle;         // Collision boundary
  
  // Damage visualization
  damageSections: Rectangle[]; // Visual damage areas
}
```

**Validation Rules**:
- 5 buildings evenly spaced across screen width
- Health: 100 initial, 0 means destroyed
- Each projectile hit: 20-25 damage
- Visual degradation based on health percentage

---

### 5. Bullet

**Description**: Player-fired projectiles that travel upward and destroy enemies.

**Fields**:
```typescript
interface Bullet {
  id: string;
  x: number;                // Horizontal position
  y: number;                // Vertical position
  width: number;             // Bullet width
  height: number;            // Bullet height
  
  // Movement
  speed: number;             // Upward velocity (negative y)
  active: boolean;           // Active state for pooling
  
  // Visual
  color: string;             // Bullet color
  
  // Collision
  hitbox: Rectangle;         // Collision boundary
}

// Pooling management
class BulletPool {
  private pool: Bullet[];
  private active: Bullet[];
  
  acquire(): Bullet | null;
  release(bullet: Bullet): void;
  update(deltaTime: number): void;
}
```

**Validation Rules**:
- Speed: -8 to -12 pixels per frame
- Maximum 10 concurrent bullets
- Auto-release when leaving screen bounds
- Instant destruction on collision

---

### 6. Bomb

**Description**: Enemy-dropped projectiles that travel downward and damage player/buildings.

**Fields**:
```typescript
interface Bomb {
  id: string;
  x: number;                // Horizontal position
  y: number;                // Vertical position
  width: number;             // Bomb width
  height: number;            // Bomb height
  
  // Movement
  speed: number;             // Downward velocity (positive y)
  active: boolean;           // Active state for pooling
  
  // Visual
  color: string;             // Bomb color
  
  // Collision
  hitbox: Rectangle;         // Collision boundary
}

class BombPool {
  private pool: Bomb[];
  private active: Bomb[];
  
  acquire(): Bomb | null;
  release(bomb: Bomb): void;
  update(deltaTime: number): void;
}
```

**Validation Rules**:
- Speed: 3-6 pixels per frame
- Maximum 5 concurrent bombs
- Auto-release when leaving screen bounds
- Gradual building damage (not instant destruction)

---

### 7. UFO

**Description**: Special enemy that crosses screen horizontally for bonus points.

**Fields**:
```typescript
interface UFO {
  id: string;
  x: number;                // Horizontal position
  y: number;                // Fixed vertical position (top block)
  width: number;             // UFO width
  height: number;            // UFO height
  
  // Movement
  speed: number;             // Horizontal velocity
  direction: number;         // -1 (left→right) or 1 (right→left)
  active: boolean;           // Active state
  
  // Scoring
  points: number;            // Point value (200 regular, 400 bonus)
  isBonus: boolean;          // Bonus UFO (double points)
  
  // Visual
  color: string;             // UFO color
  frame: number;            // Animation frame
  
  // Collision
  hitbox: Rectangle;         // Collision boundary
}

enum UFOState {
  INACTIVE = 'inactive',
  FLYING = 'flying',
  DESTROYED = 'destroyed'
}
```

**Validation Rules**:
- Spawn intervals: 30-90 seconds random
- Speed: 2-4 pixels per frame
- Points: 200 (regular), 400 (bonus after level clear)
- One UFO active at a time
- Instant destruction on bullet hit

---

### 8. Particle

**Description**: Visual effects for explosions and impacts.

**Fields**:
```typescript
interface Particle {
  id: string;
  x: number;                // Particle position
  y: number;
  vx: number;               // Horizontal velocity
  vy: number;               // Vertical velocity
  size: number;             // Particle size
  lifetime: number;          // Time until removal
  maxLifetime: number;       // Maximum lifetime
  color: string;             // Particle color
  active: boolean;           // Active state for pooling
}

class ParticlePool {
  private pool: Particle[];
  private active: Particle[];
  
  acquire(config: ParticleConfig): Particle | null;
  release(particle: Particle): void;
  update(deltaTime: number): void;
}

interface ParticleConfig {
  x: number;
  y: number;
  count: number;            // Number of particles
  colors: string[];          // Color variety
  speed: {min: number, max: number};
  size: {min: number, max: number};
  lifetime: {min: number, max: number};
}
```

**Validation Rules**:
- 20-50 particles per explosion
- Random velocity patterns
- Lifetime: 0.5-2.0 seconds
- Performance limit: 200 max particles

---

## Game Systems & Relationships

### 1. Collision Detection System

**Entity Interactions**:
```
Bullet → Alien: Alien destroyed, +100 points, bullet destroyed
Bullet → Building: Building damaged, bullet destroyed
Bullet → UFO: UFO destroyed, +200/400 points, bullet destroyed
Bomb → Player: Player loses life, bomb destroyed
Bomb → Building: Building damaged, bomb destroyed
Alien → Building: Building destroyed (if aliens reach bottom)
Alien → Player: Player loses life (if aliens reach bottom)
```

**Spatial Optimization**: Grid-based collision detection with 64px cell size

### 2. Scoring System

**Point Values**:
- Alien destroyed: 100 points
- UFO destroyed: 200 points (regular), 400 points (bonus)
- Level completion: 1000 points bonus

**High Score Tracking**: Top 10 scores with player name and timestamp

### 3. Level Progression

**Level Structure**:
- Levels 1-20: Increasing difficulty
- Each level: Full alien grid (6×8), 5 buildings
- Alien movement speed increases per level
- Alien bomb frequency increases per level

**Victory Conditions**:
- Clear all aliens + UFO in current level
- Advance to next level with bonus UFO
- Complete 20 levels for game victory

### 4. Game States

**State Machine**:
```typescript
enum GameState {
  MENU = 'menu',           // Start screen, high scores
  PLAYING = 'playing',     // Active gameplay
  PAUSED = 'paused',       // Game paused
  LEVEL_COMPLETE = 'level-complete', // Between levels
  GAME_OVER = 'game-over', // Player lost
  VICTORY = 'victory'      // Player won (20 levels)
}
```

---

## Performance Considerations

### Entity Limits
- **Total entities**: Maximum 200 concurrent
- **Aliens**: 48 maximum (6×8 grid)
- **Bullets**: 10 maximum (pool-managed)
- **Bombs**: 5 maximum (pool-managed)
- **Particles**: 200 maximum (pool-managed)
- **Buildings**: 5 maximum (static)

### Memory Management
- Object pooling for all dynamic entities
- Spatial grid for collision detection
- Layered rendering for performance
- Automatic cleanup for off-screen entities

### Update Order (Per Frame)
1. Input processing
2. Game state updates
3. Entity movement (bullets, bombs, aliens, UFO)
4. Collision detection and resolution
5. Particle system updates
6. Audio management
7. Rendering

This data model provides a solid foundation for implementing the Space InvAIders game with clear entity relationships, validation rules, and performance considerations.