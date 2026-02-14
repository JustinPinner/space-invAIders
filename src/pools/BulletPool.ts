import { ObjectPool } from './ObjectPool';
import { Bullet } from '../entities/Bullet';
import { GAME_CONSTANTS } from '../utils/GameConstants';

export class BulletPool extends ObjectPool<Bullet> {
    constructor() {
        super(() => new Bullet(0, 0), 5, GAME_CONSTANTS.MAX_BULLETS);
    }

    public createBullet(x: number, y: number): Bullet | null {
        const bullet = this.acquire();
        if (bullet) {
            bullet.setPosition(x, y);
            bullet.setColor(GAME_CONSTANTS.COLORS.BULLET);
            bullet.active = true;
        }
        return bullet;
    }

    public update(deltaTime: number): void {
        // Update all active bullets
        for (let i = this.active.length - 1; i >= 0; i--) {
            const bullet = this.active[i];
            bullet.update(deltaTime);

            // Remove bullets that are off screen or destroyed
            if (!bullet.active || bullet.y < -20) {
                this.release(bullet);
            }
        }
    }

    protected createObject(): Bullet {
        return new Bullet(0, 0);
    }

    protected resetObject(bullet: Bullet): void {
        bullet.active = false;
        bullet.setPosition(0, 0);
    }

    public reset(): void {
        // Release all active bullets back to pool
        for (let i = this.active.length - 1; i >= 0; i--) {
            this.release(this.active[i]);
        }
    }
}
