import { GameConfig, GameState } from '../types/GameTypes';
import { UISystem } from '../systems/UISystem';
import { RenderSystem } from '../systems/RenderSystem';
import { InputSystem } from '../systems/InputSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { AlienGrid } from '../systems/AlienGrid';
import { BuildingManager } from '../systems/BuildingManager';
import { UFOSystem } from '../systems/UFOSystem';
import { BombSystem } from '../systems/BombSystem';
import { PlayerLifeManager } from '../systems/PlayerLifeManager';
import { ExplosionSystem } from '../systems/ExplosionSystem';
import { CollisionSystem } from '../core/CollisionSystem';
import { ScoringSystem } from '../systems/ScoringSystem';
import { GameStateManager } from './GameStateManager';
import { GAME_CONSTANTS } from '../utils/GameConstants';
import { BulletPool } from '../pools/BulletPool';
import { Player } from '../entities/Player';
import { GameObject } from '../core/GameObject';

export class Game {
    private canvas: HTMLCanvasElement;
    private config: GameConfig;
    private uiSystem!: UISystem;
    private renderSystem!: RenderSystem;
    private inputSystem!: InputSystem;
    private audioSystem!: AudioSystem;
    private alienGrid!: AlienGrid;
    private buildingManager!: BuildingManager;
    private ufoSystem!: UFOSystem;
    private bombSystem!: BombSystem;
    private playerLifeManager!: PlayerLifeManager;
    private explosionSystem!: ExplosionSystem;
    private collisionSystem!: CollisionSystem;
    private scoringSystem!: ScoringSystem;
    private gameStateManager!: GameStateManager;

    // Game state
    private score: number = 0;
    private level: number = 1;
    private isRunning: boolean = false;
    private state: GameState = 'menu';

    constructor(config: GameConfig) {
        this.canvas = config.canvas;
        this.config = config;
        this.setupCanvas();
    }

    public start(): void {
        this.createGame();
        this.isRunning = true;
        // Game starts in menu state, player needs to press Enter to start
        console.log('Game started in menu state. Press Enter to begin playing.');
    }

    public pause(): void {
        this.gameStateManager.pauseGame();
    }

    public resume(): void {
        this.gameStateManager.resumeGame();
    }

    public stop(): void {
        this.gameStateManager.returnToMenu();
        this.inputSystem.destroy();
    }

    public handleResize(): void {
        this.setupCanvas();
        if (this.renderSystem) {
            this.renderSystem.resize(this.canvas.width, this.canvas.height);
        }
    }

    private setupCanvas(): void {
        this.canvas.width = this.config.width || GAME_CONSTANTS.CANVAS_WIDTH;
        this.canvas.height = this.config.height || GAME_CONSTANTS.CANVAS_HEIGHT;
    }

    private bulletPool!: BulletPool;

    private createGame(): void {
        // Initialize game systems
        this.uiSystem = new UISystem(this.canvas);
        this.renderSystem = new RenderSystem(this.canvas);
        this.inputSystem = new InputSystem();
        this.audioSystem = new AudioSystem();
        this.alienGrid = new AlienGrid(this.audioSystem);
        this.buildingManager = new BuildingManager();
        this.ufoSystem = new UFOSystem();
        this.collisionSystem = new CollisionSystem();
        this.scoringSystem = new ScoringSystem();
        this.gameStateManager = new GameStateManager(this);
        this.bulletPool = new BulletPool();

        // Initialize player
        const player = new Player(GAME_CONSTANTS.PLAYER_START_X, GAME_CONSTANTS.PLAYER_Y);
        player.setInputSystem(this.inputSystem);
        player.setBulletPool(this.bulletPool);
        player.setAudioSystem(this.audioSystem);
        this.setPlayer(player);

        // Initialize bomb system
        this.bombSystem = new BombSystem(this.audioSystem);

        // Initialize player life manager
        this.playerLifeManager = new PlayerLifeManager(player, this.audioSystem);

        // Initialize explosion system
        this.explosionSystem = new ExplosionSystem();

        // Initialize audio (async)
        this.audioSystem.init().then(() => {
            console.log('Audio system initialized');
        });

        // Update UI with initial values
        this.uiSystem.setScore(this.scoringSystem.getScore());
        this.uiSystem.setLives(this.playerLifeManager.getRemainingLives());
        this.uiSystem.setLevel(this.level);

        // Start game loop
        this.startGameLoop();
    }

    private startGameLoop(): void {
        let lastTime = 0;

        const gameLoop = (timestamp: number) => {
            if (!this.isRunning) return;

            const deltaTime = lastTime ? timestamp - lastTime : 16.67;
            lastTime = timestamp;

            // Cap delta time to prevent spiral of death
            const cappedDelta = Math.min(deltaTime, 100);

            this.update(cappedDelta);
            this.render();

            requestAnimationFrame(gameLoop);
        };

        requestAnimationFrame(gameLoop);
    }

    private update(deltaTime: number): void {
        // Update game state manager
        this.gameStateManager.update(deltaTime);
        this.state = this.gameStateManager.getCurrentState();

        // Handle input for menu and state transitions
        this.handleMenuInput();

        // Update UI
        this.uiSystem.update(deltaTime);

        // Update UFO system, bullets, explosions, and collisions in both playing and level-complete states
        if (this.gameStateManager.isPlaying() || this.gameStateManager.isInLevelComplete()) {
            // Update UFO system (needed for bonus UFO in level-complete)
            // Only allow spawning during playing state, not during level-complete
            const allowSpawning = this.gameStateManager.isPlaying();
            this.ufoSystem.update(deltaTime, allowSpawning);

            // Update bullets (needed to shoot UFO)
            this.bulletPool.update(deltaTime);

            // Update explosion system
            this.explosionSystem.update(deltaTime);

            // Check collisions (needed for UFO shooting)
            this.checkCollisions();
        }

        // Only update game systems when playing
        if (this.gameStateManager.isPlaying()) {
            // Input system doesn't need to be reset every frame - it handles key states properly

            // Update aliens
            this.alienGrid.update(deltaTime);

            // Update buildings
            this.buildingManager.update(deltaTime);

            // Update bomb system
            this.bombSystem.update(this.alienGrid.getAliens());
        }

        // Update player
        const player = this.getPlayer();
        if (player) {
            player.update(deltaTime);
        }

        // Level completion is now handled by GameStateManager
    }

    private handleMenuInput(): void {
        const inputSystem = this.inputSystem;

        // Handle Enter key for starting game or returning to menu
        if (inputSystem.isKeyPressed('Enter')) {
            if (this.gameStateManager.isInMenu()) {
                this.gameStateManager.startGame();
            } else if (this.gameStateManager.isGameOver() || this.gameStateManager.isVictory()) {
                this.gameStateManager.returnToMenu();
            }
        }

        // Handle Escape key for pause/resume
        if (inputSystem.isKeyPressed('Escape')) {
            if (this.gameStateManager.isPlaying()) {
                this.gameStateManager.pauseGame();
            } else if (this.gameStateManager.isPaused()) {
                this.gameStateManager.resumeGame();
            }
        }
    }

    // Player entity
    private player: Player | null = null;

    public setPlayer(player: Player): void {
        this.player = player;
    }

    private getPlayer(): Player | null {
        return this.player;
    }

    private render(): void {
        // Begin frame
        this.renderSystem.beginFrame();

        // Render game entities when playing or in level-complete (for bonus UFO)
        if (this.gameStateManager.isPlaying() || this.gameStateManager.isInLevelComplete()) {
            this.renderEntities();
        }

        // Always render UI
        this.uiSystem.render();

        // Render game state overlays (menu, paused, game over, etc.)
        if (!this.gameStateManager.isPlaying()) {
            this.uiSystem.renderGameState(this.gameStateManager.getCurrentState());
        } else if (this.gameStateManager.isInLevelComplete()) {
            this.uiSystem.renderGameState('level-complete');
        }

        // Render system layers (for any additional objects)
        this.renderSystem.render();

        // End frame
        this.renderSystem.endFrame();
    }

    private renderEntities(): void {
        const ctx = this.renderSystem.getContext();

        // Render player
        const player = this.getPlayer();
        if (player && player.active) {
            player.render(ctx);
        }

        // Render aliens
        const aliens = this.alienGrid.getAliens();
        for (const alien of aliens) {
            if (alien.active) {
                alien.render(ctx);
            }
        }

        // Render buildings
        this.buildingManager.render(ctx);

        // Render UFO
        this.ufoSystem.render(ctx);

        // Render bullets
        const activeBullets = this.bulletPool.getActive();
        for (const bullet of activeBullets) {
            if (bullet.active) {
                bullet.render(ctx);
            }
        }

        // Render bombs
        const activeBombs = this.bombSystem.getActiveBombs();
        for (const bomb of activeBombs) {
            if (bomb.active) {
                bomb.render(ctx);
            }
        }

        // Render explosions
        this.explosionSystem.render(ctx);
    }

    private checkCollisions(): void {
        // Get all active entities
        const activeBullets = this.bulletPool.getActive();
        const activeAliens = this.alienGrid.getAliens();

        // Get UFO for collision detection
        const ufoEntity = this.ufoSystem.getUFO();

        // Get active bombs for collision detection
        const activeBombs = this.bombSystem.getActiveBombs();

        // Check bullet-alien collisions using collision system
        const bulletAlienCollisions = this.collisionSystem.checkBulletAlienCollisions(
            Array.from(activeBullets) as GameObject[],
            activeAliens
        );

        for (const collision of bulletAlienCollisions) {
            if (collision.collided && collision.entity1 && collision.entity2) {
                // Remove bullet
                collision.entity1.destroy();

                // Remove alien
                collision.entity2.destroy();

                // Add score
                this.scoringSystem.addAlienScore();

                // Update UI
                this.uiSystem.setScore(this.scoringSystem.getScore());

                // Play sounds
                this.audioSystem.playSound('alien-hit');
            }
        }

        // Check bullet-building collisions
        for (const bullet of activeBullets) {
            if (!bullet.active) continue;

            const hitBuilding = this.buildingManager.checkCollisionWithProjectile(
                bullet.x,
                bullet.y,
                bullet.width,
                bullet.height
            );

            if (hitBuilding) {
                hitBuilding.takeDamage(25); // 25 damage per bullet hit
                bullet.active = false;

                // Play hit sound
                this.audioSystem.playSound('building-hit');
            }
        }

        // Check bullet-UFO collisions
        if (ufoEntity && ufoEntity.active) {
            for (const bullet of activeBullets) {
                if (!bullet.active) continue;

                // Simple AABB collision detection
                if (this.checkAABBCollision(bullet, ufoEntity)) {
                    // Destroy bullet
                    bullet.active = false;

                    // Destroy UFO and get points
                    const points = this.ufoSystem.destroyUFO();

                    // Add score
                    this.scoringSystem.addScore(points, 'ufo');

                    // Update UI
                    this.uiSystem.setScore(this.scoringSystem.getScore());

                    // Play sounds
                    this.audioSystem.playSound('ufo-hit');

                    break; // Only one bullet can hit UFO
                }
            }
        }

        // Check bomb-player collisions
        const player = this.getPlayer();
        if (player && player.active) {
            const bombPlayerCollisions = this.collisionSystem.checkBombPlayerCollisions(
                activeBombs as GameObject[],
                player as GameObject
            );

            for (const collision of bombPlayerCollisions) {
                if (collision.collided && collision.entity1 && collision.entity2) {
                    // Remove bomb
                    collision.entity1.destroy();

                    // Handle player death
                    if (!this.playerLifeManager.isPlayerRespawning()) {
                        // Create explosion at player position
                        this.explosionSystem.createPlayerDeathExplosion(
                            player.x + player.width / 2,
                            player.y + player.height / 2
                        );

                        // Handle player death through life manager
                        this.playerLifeManager.handlePlayerDeath();

                        // Update UI with new lives count
                        this.uiSystem.setLives(this.playerLifeManager.getRemainingLives());

                        // Play player death sound
                        this.audioSystem.playSound('player-death');
                    }
                }
            }
        }

        // Check bomb-building collisions
        for (const bomb of activeBombs) {
            if (!bomb.active) continue;

            const hitBuilding = this.buildingManager.checkCollisionWithProjectile(
                bomb.x,
                bomb.y,
                bomb.width,
                bomb.height
            );

            if (hitBuilding) {
                hitBuilding.takeDamage(20); // 20 damage per bomb hit
                bomb.active = false;

                // Create small explosion at hit point
                this.explosionSystem.createBuildingHitExplosion(bomb.x, bomb.y);

                // Play hit sound
                this.audioSystem.playSound('building-hit');
            }
        }
    }

    public getScore(): number {
        return this.score;
    }

    public getLives(): number {
        return this.playerLifeManager.getRemainingLives();
    }

    public getLevel(): number {
        return this.level;
    }

    public setScore(score: number): void {
        this.scoringSystem.setScore(score);
        this.uiSystem.setScore(this.scoringSystem.getScore());
    }

    public setLives(lives: number): void {
        this.playerLifeManager.setLives(lives);
        this.uiSystem.setLives(this.playerLifeManager.getRemainingLives());
    }

    public setLevel(level: number): void {
        this.level = level;
        this.uiSystem.setLevel(level);
    }

    public getState(): GameState {
        return this.state;
    }

    // Methods for GameStateManager access
    public getAudioSystem(): AudioSystem {
        return this.audioSystem;
    }

    public getAlienGrid(): AlienGrid {
        return this.alienGrid;
    }

    public getUFOSystem(): UFOSystem {
        return this.ufoSystem;
    }

    public startNewLevel(): void {
        // Reset alien grid for new level
        this.alienGrid.reset();

        // Reset buildings for new level
        this.buildingManager.reset();

        // Reset UFO system for new level
        this.ufoSystem.reset();

        // Clear bullets
        this.bulletPool.reset();

        // Reset bomb system
        this.bombSystem.reset();

        // Clear explosions
        this.explosionSystem.clear();
    }

    public clearBombs(): void {
        // Clear all active bombs
        this.bombSystem.reset();
    }

    private checkAABBCollision(obj1: GameObject, obj2: GameObject): boolean {
        return (
            obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y
        );
    }
}
