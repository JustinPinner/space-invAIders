import { Alien } from '../entities/Alien';
import { Bomb } from '../entities/Bomb';
import { BombPool } from '../pools/BombPool';
import { AudioSystem } from './AudioSystem';

export interface BombDropper {
    alien: Alien;
    lastBombTime: number;
    bombCooldown: number;
}

export class BombSystem {
    private bombPool: BombPool;
    private bombDroppers: BombDropper[] = [];
    private maxSimultaneousBombs: number;
    private lastBombCheck: number = 0;
    private bombCheckInterval: number = 2000; // Check every 2 seconds
    private audioSystem?: AudioSystem;

    constructor(audioSystem?: AudioSystem) {
        this.bombPool = new BombPool();
        this.maxSimultaneousBombs = 4; // Maximum 3-4 bombs as per requirements
        this.audioSystem = audioSystem;
    }

    public setAudioSystem(audioSystem: AudioSystem): void {
        this.audioSystem = audioSystem;
    }

    public getBombPool(): BombPool {
        return this.bombPool;
    }

    public initializeBombDroppers(aliens: Alien[]): void {
        this.bombDroppers = [];
        const activeAliens = aliens.filter((alien) => alien.active);

        // Randomly select aliens that can drop bombs (start with a few)
        const dropperCount = Math.min(5, activeAliens.length);
        const shuffled = [...activeAliens].sort(() => Math.random() - 0.5);

        for (let i = 0; i < dropperCount; i++) {
            const alien = shuffled[i];
            this.bombDroppers.push({
                alien,
                lastBombTime: Date.now(),
                bombCooldown: this.getRandomBombCooldown(),
            });
        }
    }

    public update(aliens: Alien[]): void {
        // Update existing bombs
        this.bombPool.update(0);

        // Check if we need to add new bomb droppers or refresh existing ones
        const now = Date.now();
        if (now - this.lastBombCheck >= this.bombCheckInterval) {
            this.updateBombDroppers(aliens);
            this.lastBombCheck = now;
        }

        // Try to drop bombs from our droppers
        this.tryDropBombs();
    }

    private updateBombDroppers(aliens: Alien[]): void {
        const activeAliens = aliens.filter((alien) => alien.active);
        const currentBombCount = this.bombPool.getActiveBombCount();

        // Remove droppers for inactive aliens
        this.bombDroppers = this.bombDroppers.filter((dropper) => dropper.alien.active);

        // If we have fewer droppers than desired and have capacity for more bombs, add new ones
        if (this.bombDroppers.length < 5 && currentBombCount < this.maxSimultaneousBombs) {
            const availableAliens = activeAliens.filter(
                (alien) => !this.bombDroppers.some((dropper) => dropper.alien.id === alien.id)
            );

            if (availableAliens.length > 0) {
                const randomAlien =
                    availableAliens[Math.floor(Math.random() * availableAliens.length)];
                this.bombDroppers.push({
                    alien: randomAlien,
                    lastBombTime: Date.now() + Math.random() * 2000, // Random delay
                    bombCooldown: this.getRandomBombCooldown(),
                });
            }
        }
    }

    private tryDropBombs(): void {
        const now = Date.now();
        const currentBombCount = this.bombPool.getActiveBombCount();

        if (currentBombCount >= this.maxSimultaneousBombs) {
            return; // Max bombs already active
        }

        for (const dropper of this.bombDroppers) {
            if (!dropper.alien.active) {
                continue;
            }

            if (now - dropper.lastBombTime >= dropper.bombCooldown) {
                const bomb = this.dropBomb(dropper.alien);
                if (bomb) {
                    dropper.lastBombTime = now;
                    dropper.bombCooldown = this.getRandomBombCooldown();

                    // Play bomb drop sound
                    if (this.audioSystem) {
                        this.audioSystem.playSound('bomb-drop');
                    }

                    // Stop if we've reached max bombs
                    if (this.bombPool.getActiveBombCount() >= this.maxSimultaneousBombs) {
                        break;
                    }
                }
            }
        }
    }

    private dropBomb(alien: Alien): Bomb | null {
        const bombX = alien.x + alien.width / 2 - 2; // Center of alien
        const bombY = alien.y + alien.height; // Bottom of alien

        return this.bombPool.createBomb(bombX, bombY);
    }

    private getRandomBombCooldown(): number {
        // Random cooldown between 2-5 seconds
        return 2000 + Math.random() * 3000;
    }

    public getActiveBombs(): Bomb[] {
        return this.bombPool.getActiveBombs();
    }

    public reset(): void {
        this.bombPool.reset();
        this.bombDroppers = [];
        this.lastBombCheck = 0;
    }

    public clearBombs(): void {
        this.bombPool.reset();
    }

    // Set difficulty by adjusting bomb parameters
    public setDifficulty(level: number): void {
        // Increase max bombs and decrease cooldowns as level increases
        this.maxSimultaneousBombs = Math.min(4, 3 + Math.floor(level / 5));
        this.bombCheckInterval = Math.max(1000, 2000 - level * 100);

        // Update existing droppers with new cooldowns
        for (const dropper of this.bombDroppers) {
            dropper.bombCooldown = this.getRandomBombCooldown();
        }
    }
}
