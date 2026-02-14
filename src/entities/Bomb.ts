import { GameObject } from '../core/GameObject';
import { GAME_CONSTANTS } from '../utils/GameConstants';

export class Bomb extends GameObject {
    constructor(x: number, y: number) {
        super(x, y, 4, 8, 'bomb');
        this.setColor(GAME_CONSTANTS.COLORS.BOMB);
        this.layer = 5; // Projectile layer
    }

    public update(_deltaTime: number): void {
        // Move bomb downward
        this.y += GAME_CONSTANTS.BOMB_SPEED;

        // Check if off screen
        if (this.y > GAME_CONSTANTS.CANVAS_HEIGHT + 20) {
            this.destroy();
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        // Draw bomb as small teardrop shape
        ctx.fillStyle = this.color;

        // Draw teardrop shape
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw pointed bottom
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2 - this.width / 2, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.lineTo(this.x + this.width / 2 + this.width / 2, this.y + this.height / 2);
        ctx.closePath();
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 4;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    public destroy(): void {
        super.destroy();
        // Remove from render system
        // This will be handled by the system
    }
}
