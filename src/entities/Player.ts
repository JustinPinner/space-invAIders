import { GameObject } from '../core/GameObject';
import { GAME_CONSTANTS, INPUT_KEYS } from '../utils/GameConstants';
import { BulletPool } from '../pools/BulletPool';
import { InputSystem } from '../systems/InputSystem';
import { AudioSystem } from '../systems/AudioSystem';

export class Player extends GameObject {
    private speed: number;
    private canShoot: boolean;
    private shootCooldown: number;
    private lastShotTime: number;
    private lives: number;
    private bulletPool?: BulletPool;
    private inputSystem?: InputSystem;
    private audioSystem?: AudioSystem;

    constructor(x: number, y: number) {
        super(x, y, GAME_CONSTANTS.PLAYER_WIDTH, GAME_CONSTANTS.PLAYER_HEIGHT, 'player');
        this.speed = GAME_CONSTANTS.PLAYER_SPEED;
        this.canShoot = true;
        this.shootCooldown = GAME_CONSTANTS.SHOOT_COOLDOWN;
        this.lastShotTime = 0;
        this.lives = 3;
        this.setColor(GAME_CONSTANTS.COLORS.PLAYER);
    }

    public setInputSystem(inputSystem: InputSystem): void {
        this.inputSystem = inputSystem;
    }

    public setBulletPool(bulletPool: BulletPool): void {
        this.bulletPool = bulletPool;
    }

    public setAudioSystem(audioSystem: AudioSystem): void {
        this.audioSystem = audioSystem;
    }

    public update(_deltaTime: number): void {
        if (!this.inputSystem) {
            return;
        }

        // Handle movement based on input
        if (this.inputSystem.isKeyPressed(INPUT_KEYS.LEFT)) {
            this.moveLeft();
        }
        if (this.inputSystem.isKeyPressed(INPUT_KEYS.RIGHT)) {
            this.moveRight();
        }

        // Handle shooting
        if (this.inputSystem.isKeyPressed(INPUT_KEYS.SHOOT)) {
            this.shoot();
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        // Draw cannon as triangle pointing up
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y); // Top center
        ctx.lineTo(this.x, this.y + this.height); // Bottom left
        ctx.lineTo(this.x + this.width, this.y + this.height); // Bottom right
        ctx.closePath();
        ctx.fill();

        // Draw cannon base
        ctx.fillRect(this.x + this.width / 2 - 4, this.y + this.height - 4, 8, 4);
    }

    private moveLeft(): void {
        this.x -= this.speed;
        // Constrain to screen bounds
        this.x = Math.max(0, this.x);
    }

    private moveRight(): void {
        this.x += this.speed;
        // Constrain to screen bounds
        this.x = Math.min(GAME_CONSTANTS.CANVAS_WIDTH - this.width, this.x);
    }

    private shoot(): void {
        const now = Date.now();
        if (now - this.lastShotTime >= this.shootCooldown && this.canShoot && this.bulletPool) {
            const bullet = this.bulletPool.createBullet(
                this.x + this.width / 2 - 2, // Center of player
                this.y // Top of player
            );

            if (bullet) {
                this.lastShotTime = now;
                this.canShoot = false;

                // Play shooting sound
                if (this.audioSystem) {
                    this.audioSystem.playSound('shoot');
                }

                // Reset cooldown
                setTimeout(() => {
                    this.canShoot = true;
                }, this.shootCooldown);
            }
        }
    }

    public getLives(): number {
        return this.lives;
    }

    public loseLife(): void {
        this.lives = Math.max(0, this.lives - 1);
        this.active = false; // Player becomes inactive when hit
    }

    public reset(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.lives = 3;
        this.active = true;
        this.canShoot = true;
        this.lastShotTime = 0;
    }

    public respawn(): void {
        if (this.lives > 0) {
            this.active = true;
            this.canShoot = true;
            this.lastShotTime = 0;
            // Reset position to starting position
            this.x = GAME_CONSTANTS.PLAYER_START_X;
            this.y = GAME_CONSTANTS.PLAYER_Y;
        }
    }

    public isAlive(): boolean {
        return this.lives > 0;
    }

    public setLives(lives: number): void {
        this.lives = Math.max(0, lives);
        if (this.lives === 0) {
            this.active = false;
        }
    }

    public destroy(): void {
        this.active = false;
    }
}
