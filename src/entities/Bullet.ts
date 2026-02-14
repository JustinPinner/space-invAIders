import { GameObject } from '../core/GameObject';
import { GAME_CONSTANTS } from '../utils/GameConstants';

export class Bullet extends GameObject {
    constructor(x: number, y: number) {
        super(x, y, 4, 12, 'bullet');
        this.setColor(GAME_CONSTANTS.COLORS.BULLET);
    }

    public update(_deltaTime: number): void {
        // Move bullet upward
        this.y += GAME_CONSTANTS.BULLET_SPEED;

        // Check if off screen
        if (this.y < -20) {
            this.destroy();
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        // Draw bullet as small rectangle
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    public destroy(): void {
        super.destroy();
        // Remove from render system
        // This will be handled by the system
    }
}
