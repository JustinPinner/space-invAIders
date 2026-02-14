# Quick Start Guide: Space InvAIders Development

**Date**: 2026-02-07  
**Feature**: Space InvAIders Browser Game  
**Purpose**: Rapid development setup and onboarding

---

## 1. Development Environment Setup

### Prerequisites
```bash
# Required tools
node --version    # Should be 18+ 
npm --version      # Should be 9+

# Optional but recommended
git --version     # For version control
code --version    # VS Code (or preferred editor)
```

### Project Initialization
```bash
# Create new project directory
mkdir space-invaders-game
cd space-invaders-game

# Initialize with Phaser + TypeScript + Vite
npm create vite@latest . -- --template phaser-typescript

# Install additional dependencies
npm install howler jest jest-canvas-mock @playwright/test canvest

# Install development dependencies
npm install -D @types/jest ts-jest eslint @typescript-eslint/eslint-plugin
```

### Development Scripts
```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",                    // Development server
    "build": "tsc && vite build",       // Production build
    "preview": "vite preview",          // Preview production build
    "test": "jest",                   // Run unit tests
    "test:watch": "jest --watch",       // Watch mode testing
    "test:coverage": "jest --coverage", // Coverage report
    "test:e2e": "playwright test",     // End-to-end tests
    "lint": "eslint src --ext .ts",    // Code linting
    "lint:fix": "eslint src --ext .ts --fix",
    "typecheck": "tsc --noEmit"       // Type checking
  }
}
```

---

## 2. Project Structure

### Basic Folder Layout
```text
space-invaders-game/
├── src/
│   ├── core/                  # Game engine components
│   │   ├── Game.ts           # Main game class
│   │   ├── GameObject.ts     # Base entity class
│   │   ├── Vector2.ts        # Math utilities
│   │   └── CollisionSystem.ts # Collision detection
│   ├── entities/               # Game entities
│   │   ├── Player.ts         # Player cannon
│   │   ├── Alien.ts          # Enemy aliens
│   │   ├── UFO.ts            # Bonus UFO
│   │   ├── Bullet.ts         # Player projectiles
│   │   ├── Bomb.ts           # Enemy projectiles
│   │   └── Building.ts       # City buildings
│   ├── systems/               # Game systems
│   │   ├── InputSystem.ts    # Input handling
│   │   ├── AudioSystem.ts    # Sound management
│   │   ├── RenderSystem.ts   # Canvas rendering
│   │   ├── PhysicsSystem.ts   # Movement and positioning
│   │   └── UISystem.ts       # HUD and UI
│   ├── utils/                 # Utilities
│   │   ├── SpriteRenderer.ts  # Shape-based rendering
│   │   ├── AssetLoader.ts     # Asset management
│   │   └── GameConstants.ts   # Configuration
│   ├── types/                 # TypeScript types
│   │   └── GameTypes.ts      # Core interfaces
│   ├── pools/                 # Object pools
│   │   ├── BulletPool.ts     # Bullet management
│   │   ├── BombPool.ts       # Bomb management
│   │   └── ParticlePool.ts   # Effect particles
│   └── main.ts               # Application entry point
├── tests/                    # Test files
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   └── e2e/                 # End-to-end tests
├── assets/                   # Game assets
│   ├── audio/                # Sound effects
│   ├── images/               # Image assets (future)
│   └── fonts/                # Custom fonts
├── public/                   # Static files
│   ├── index.html            # Main HTML file
│   └── favicon.ico           # Site icon
├── docs/                     # Documentation
│   ├── api.md                # API documentation
│   └── architecture.md       # System design
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite build config
├── jest.config.js            # Jest test config
├── playwright.config.ts       # E2E test config
└── README.md                 # Project README
```

---

## 3. Core Implementation Steps

### Step 1: Basic Game Setup
```typescript
// src/main.ts
import { Game } from './core/Game';
import './style.css';

// Initialize game
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const game = new Game({
  canvas,
  width: 800,
  height: 600,
  audioEnabled: true
});

// Start game
game.start();

// Handle window resize
window.addEventListener('resize', () => {
  game.handleResize();
});
```

### Step 2: Game Class Structure
```typescript
// src/core/Game.ts
import { Phaser } from 'phaser';
import { Player } from '../entities/Player';
import { Alien } from '../entities/Alien';
import { GameConstants } from '../utils/GameConstants';

export class Game extends Phaser.Scene {
  private player: Player;
  private aliens: Alien[];
  private score: number = 0;
  private lives: number = 3;
  
  constructor(config: GameConfig) {
    super('SpaceInvaders');
    this.config = config;
  }
  
  preload() {
    // Load assets (if any)
    // For shape-based rendering, this might be empty
  }
  
  create() {
    // Initialize game objects
    this.createPlayer();
    this.createAliens();
    this.createBuildings();
    this.setupInput();
    this.setupPhysics();
  }
  
  update(time: number, delta: number) {
    // Main game loop
    this.updatePlayer();
    this.updateAliens();
    this.checkCollisions();
    this.updateUI();
  }
}
```

### Step 3: Entity Implementation
```typescript
// src/entities/Player.ts
import { GameObject } from '../core/GameObject';

export class Player extends GameObject {
  private speed: number = 6;
  private canShoot: boolean = true;
  private shootCooldown: number = 250;
  private lastShotTime: number = 0;
  
  constructor(x: number, y: number) {
    super(x, y, 32, 24, 'player');
    this.setColor('#00ff00'); // Green cannon
  }
  
  update(deltaTime: number) {
    // Handle movement
    if (this.input.isKeyPressed('ArrowLeft')) {
      this.x -= this.speed;
    }
    if (this.input.isKeyPressed('ArrowRight')) {
      this.x += this.speed;
    }
    
    // Constrain to screen bounds
    this.x = Math.max(0, Math.min(this.x, 800 - this.width));
    
    // Handle shooting
    if (this.input.isKeyPressed(' ') && this.canShoot) {
      this.shoot();
    }
  }
  
  private shoot() {
    const now = Date.now();
    if (now - this.lastShotTime >= this.shootCooldown) {
      // Create bullet
      this.game.createBullet(this.x + this.width/2, this.y);
      this.lastShotTime = now;
      this.canShoot = false;
      
      // Reset cooldown
      setTimeout(() => { this.canShoot = true; }, this.shootCooldown);
    }
  }
  
  render(ctx: CanvasRenderingContext2D) {
    // Draw cannon as triangle pointing up
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.x + this.width/2, this.y);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.closePath();
    ctx.fill();
  }
}
```

---

## 4. Development Workflow

### Daily Development Cycle
```bash
# 1. Start development server
npm run dev

# 2. Make changes with hot reload
# - Edit TypeScript files
# - Changes automatically reload in browser

# 3. Run tests frequently
npm run test:watch

# 4. Check types and linting
npm run typecheck
npm run lint

# 5. Commit work
git add .
git commit -m "Implement player movement and shooting"
```

### Testing Strategy
```bash
# Unit tests (Jest + jest-canvas-mock)
npm run test

# Integration tests (Canvest - browser testing)
npm run test:integration

# E2E tests (Playwright)
npm run test:e2e

# Coverage reporting
npm run test:coverage
```

### Performance Monitoring
```typescript
// Add performance monitoring during development
if (process.env.NODE_ENV === 'development') {
  const perfMonitor = new PerformanceMonitor();
  
  // Log performance issues
  perfMonitor.onPerformanceIssue((issue) => {
    console.warn('Performance Issue:', issue);
  });
}
```

---

## 5. Common Development Tasks

### Adding New Entity Type
```typescript
// 1. Create entity class
export class PowerUp extends GameObject {
  constructor(x: number, y: number, type: PowerUpType) {
    super(x, y, 24, 24, 'powerup');
    this.type = type;
    this.setupBehavior();
  }
  
  // 2. Implement update and render
  update(deltaTime: number) { /* behavior */ }
  render(ctx: CanvasRenderingContext2D) { /* visual */ }
  
  // 3. Add to game entity management
  // Update game.ts to include powerups
}

// 4. Add to type definitions
// Update GameTypes.ts with PowerUpType enum
```

### Adding New Sound Effect
```typescript
// 1. Add sound file to assets/audio/
// 2. Update AudioSystem.ts
class AudioSystem {
  private sounds = {
    // existing sounds...
    powerup: new Howl({
      src: ['audio/powerup.webm', 'audio/powerup.mp3'],
      volume: 0.5
    })
  };
  
  playSound(type: SoundType) {
    if (type === 'powerup') {
      this.sounds.powerup.play();
    }
  }
}

// 3. Update SoundType enum
enum SoundType {
  POWERUP = 'powerup'
  // existing types...
}
```

### Debugging Common Issues

#### Performance Problems
```typescript
// Check entity count
console.log(`Entities: ${this.game.entities.length}`);

// Monitor FPS
const fps = 1000 / deltaTime;
if (fps < 55) console.warn(`Low FPS: ${fps}`);

// Check memory usage
if (performance.memory) {
  console.log(`Memory: ${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
}
```

#### Collision Detection Issues
```typescript
// Enable debug rendering
if (this.debugMode) {
  ctx.strokeStyle = 'red';
  ctx.strokeRect(entity.x, entity.y, entity.width, entity.height);
}

// Log collision events
console.log(`Collision: ${entity1.type} + ${entity2.type}`);
```

---

## 6. Building for Production

### Production Build
```bash
# Create optimized build
npm run build

# Preview production build
npm run preview

# Build size analysis
npm run build -- --analyze
```

### Deployment Checklist
```bash
# 1. Run all tests
npm run test && npm run test:e2e

# 2. Type checking
npm run typecheck

# 3. Linting
npm run lint

# 4. Build verification
npm run build && npm run preview

# 5. Performance testing
# - Check 60 FPS on target devices
# - Verify memory usage < 50MB
# - Test load times < 3 seconds
```

---

## 7. Configuration Files

### TypeScript Config (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Vite Config (vite.config.ts)
```typescript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  optimizeDeps: {
    include: ['phaser'],
  },
});
```

### Jest Config (jest.config.js)
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['jest-canvas-mock'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

---

## 8. Next Steps

### After Basic Setup
1. **Implement Core Entities** - Player, Aliens, Buildings, Projectiles
2. **Add Collision Detection** - Entity interactions and scoring
3. **Implement Game States** - Menu, playing, game over, victory
4. **Add Audio System** - Sound effects and background music
5. **Polish & Effects** - Particles, animations, transitions
6. **Performance Optimization** - Object pooling, spatial partitioning
7. **Testing** - Unit tests, integration tests, E2E tests
8. **Documentation** - API docs, user guide, deployment

### Success Metrics
- ✅ Game runs at 60 FPS on target devices
- ✅ All 20 levels playable with increasing difficulty
- ✅ Responsive design works on different screen sizes
- ✅ Audio system functional across browsers
- ✅ 80%+ test coverage achieved
- ✅ Production build optimized and deployed
- ✅ Performance monitoring shows <50MB memory usage

This quickstart guide provides everything needed to get started with Space InvAIders development, from environment setup to production deployment, following modern web development best practices.