import { ObjectPool } from './ObjectPool';
import { Bomb } from '../entities/Bomb';
import { GAME_CONSTANTS } from '../utils/GameConstants';

export class BombPool extends ObjectPool<Bomb> {
    constructor() {
        super(() => new Bomb(0, 0), 5, GAME_CONSTANTS.MAX_BOMBS);
    }

    public createBomb(x: number, y: number): Bomb | null {
        const bomb = this.acquire();
        if (bomb) {
            bomb.setPosition(x, y);
            bomb.setColor(GAME_CONSTANTS.COLORS.BOMB);
            bomb.active = true;
        }
        return bomb;
    }

    public update(deltaTime: number): void {
        // Update all active bombs
        for (let i = this.active.length - 1; i >= 0; i--) {
            const bomb = this.active[i];
            bomb.update(deltaTime);

            // Remove bombs that are off screen or destroyed
            if (!bomb.active || bomb.y > GAME_CONSTANTS.CANVAS_HEIGHT + 20) {
                this.release(bomb);
            }
        }
    }

    protected createObject(): Bomb {
        return new Bomb(0, 0);
    }

    protected resetObject(bomb: Bomb): void {
        bomb.active = false;
        bomb.setPosition(0, 0);
    }

    public reset(): void {
        // Release all active bombs back to pool
        for (let i = this.active.length - 1; i >= 0; i--) {
            this.release(this.active[i]);
        }
    }

    public getActiveBombs(): Bomb[] {
        return this.active as Bomb[];
    }

    public getActiveBombCount(): number {
        return this.active.length;
    }
}
