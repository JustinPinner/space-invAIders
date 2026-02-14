import { Alien } from '../entities/Alien';
import { GAME_CONSTANTS } from '../utils/GameConstants';
import { AudioSystem } from '../systems/AudioSystem';

export class AlienGrid {
    private aliens: Alien[][];
    private movementDirection: number = 1; // 1 = right, -1 = left
    private lastMoveTime: number = 0;
    private moveInterval: number = 1000; // Move every 1 second initially
    private edgeReached: boolean = false;
    private audioSystem?: AudioSystem;

    constructor(audioSystem?: AudioSystem) {
        this.audioSystem = audioSystem;
        this.aliens = [];
        this.initializeGrid();
    }

    public setAudioSystem(audioSystem: AudioSystem): void {
        this.audioSystem = audioSystem;
    }

    private initializeGrid(): void {
        this.aliens = [];
        for (let row = 0; row < GAME_CONSTANTS.ALIEN_ROWS; row++) {
            this.aliens[row] = [];
            for (let col = 0; col < GAME_CONSTANTS.ALIEN_COLUMNS; col++) {
                const x = GAME_CONSTANTS.ALIEN_START_X + col * GAME_CONSTANTS.ALIEN_SPACING_X;
                const y = GAME_CONSTANTS.ALIEN_START_Y + row * GAME_CONSTANTS.ALIEN_SPACING_Y;
                const alien = new Alien(x, y, row, col);
                this.aliens[row][col] = alien;
            }
        }
    }

    public update(_deltaTime: number): void {
        const now = Date.now();
        if (now - this.lastMoveTime >= this.moveInterval) {
            this.moveAliens();
            this.lastMoveTime = now;
        }
    }

    private moveAliens(): void {
        this.edgeReached = this.checkEdgeCollision();

        if (this.edgeReached) {
            // Play edge reached sound
            if (this.audioSystem) {
                this.audioSystem.playSound('alien-edge');
            }
            // Move all aliens down and reverse direction
            this.moveAllAliensDown();
            this.movementDirection *= -1;
        } else {
            // Play movement sound
            if (this.audioSystem) {
                this.audioSystem.playSound('alien-move');
            }
            // Move all aliens horizontally
            this.moveAllAliensHorizontally();
        }
    }

    private checkEdgeCollision(): boolean {
        for (let row = 0; row < this.aliens.length; row++) {
            for (let col = 0; col < this.aliens[row].length; col++) {
                const alien = this.aliens[row][col];
                if (alien && alien.active) {
                    if (
                        this.movementDirection === 1 &&
                        alien.x + alien.width >= GAME_CONSTANTS.CANVAS_WIDTH - 20
                    ) {
                        return true;
                    }
                    if (this.movementDirection === -1 && alien.x <= 20) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private moveAllAliensHorizontally(): void {
        const moveSpeed = GAME_CONSTANTS.ALIEN_BASE_SPEED * 10; // Scaled for visible movement
        for (let row = 0; row < this.aliens.length; row++) {
            for (let col = 0; col < this.aliens[row].length; col++) {
                const alien = this.aliens[row][col];
                if (alien && alien.active) {
                    if (this.movementDirection === 1) {
                        alien.moveRight(moveSpeed);
                    } else {
                        alien.moveLeft(moveSpeed);
                    }
                }
            }
        }
    }

    private moveAllAliensDown(): void {
        for (let row = 0; row < this.aliens.length; row++) {
            for (let col = 0; col < this.aliens[row].length; col++) {
                const alien = this.aliens[row][col];
                if (alien && alien.active) {
                    alien.moveDown(GAME_CONSTANTS.ALIEN_SPACING_Y);
                }
            }
        }
    }

    public getAliens(): Alien[] {
        const allAliens: Alien[] = [];
        for (const row of this.aliens) {
            allAliens.push(...row);
        }
        return allAliens;
    }

    public reset(): void {
        this.initializeGrid();
        this.movementDirection = 1;
        this.lastMoveTime = 0;
        this.moveInterval = 1000;
        this.edgeReached = false;
    }

    public getActiveAlienCount(): number {
        return this.getAliens().filter((alien) => alien.active).length;
    }

    public setMovementDirection(direction: number): void {
        this.movementDirection = direction;
    }

    public getMovementDirection(): number {
        return this.movementDirection;
    }

    public setMoveInterval(interval: number): void {
        this.moveInterval = interval;
    }

    public getMoveInterval(): number {
        return this.moveInterval;
    }
}
