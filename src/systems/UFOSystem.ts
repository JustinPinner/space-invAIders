import { UFO } from '../entities/UFO';
import { GAME_CONSTANTS } from '../utils/GameConstants';

export class UFOSystem {
    private ufo: UFO | null = null;
    private nextSpawnTime: number = 0;
    private gameTime: number = 0;

    constructor() {
        this.calculateNextSpawnTime();
    }

    public update(deltaTime: number, allowSpawning: boolean = true): void {
        this.gameTime += deltaTime;

        // Check if it's time to spawn a new UFO (only if spawning is allowed)
        if (allowSpawning && this.shouldSpawn()) {
            this.spawnUFO();
        }

        // Update existing UFO
        if (this.ufo && this.ufo.active) {
            this.ufo.update(deltaTime);

            // Check if UFO has left the screen
            if (!this.ufo.active) {
                this.ufo = null;
            }
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        if (this.ufo && this.ufo.active) {
            this.ufo.render(ctx);
        }
    }

    public spawnUFO(isBonus: boolean = false): void {
        if (this.ufo && this.ufo.active) {
            return; // UFO already active, don't spawn another
        }

        this.ufo = new UFO(0, GAME_CONSTANTS.UFO_Y, isBonus);

        // Randomly choose direction (50% chance each)
        const direction = Math.random() < 0.5 ? 1 : -1;

        if (direction === 1) {
            this.ufo.spawnFromLeft();
        } else {
            this.ufo.spawnFromRight();
        }

        this.calculateNextSpawnTime();
    }

    public spawnBonusUFO(): void {
        this.spawnUFO(true); // Spawn as bonus UFO
    }

    public destroyUFO(): number {
        if (!this.ufo || !this.ufo.active) {
            console.log('destroyUFO called but UFO is null or inactive');
            return 0;
        }

        const points = this.ufo.getPointValue();
        console.log('Destroying UFO, points:', points);
        this.ufo.destroy();
        this.ufo = null;
        console.log('UFO destroyed, ufoSystem.isActive():', this.isActive());

        return points;
    }

    public getUFO(): UFO | null {
        return this.ufo;
    }

    public isActive(): boolean {
        const active = this.ufo !== null && this.ufo.active;
        // console.log('isActive check - ufo:', this.ufo, 'active:', active);
        return active;
    }

    private shouldSpawn(): boolean {
        // Don't spawn if UFO is already active
        if (this.ufo && this.ufo.active) {
            return false;
        }

        // Check if enough time has passed
        return this.gameTime >= this.nextSpawnTime;
    }

    private calculateNextSpawnTime(): void {
        const minTime = GAME_CONSTANTS.UFO_MIN_SPAWN_TIME;
        const maxTime = GAME_CONSTANTS.UFO_MAX_SPAWN_TIME;

        // Random interval between min and max spawn time
        const randomInterval = minTime + Math.random() * (maxTime - minTime);

        this.nextSpawnTime = this.gameTime + randomInterval;
    }

    public reset(): void {
        this.ufo = null;
        this.nextSpawnTime = 0;
        this.gameTime = 0;
        this.calculateNextSpawnTime();
    }

    public getBounds(): { x: number; y: number; width: number; height: number } | null {
        if (!this.ufo || !this.ufo.active) {
            return null;
        }

        return this.ufo.getBounds();
    }
}
