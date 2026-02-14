import { GameObject } from '../core/GameObject';
import { GAME_CONSTANTS } from '../utils/GameConstants';

export class UFO extends GameObject {
    private direction: number = 1; // 1 = right, -1 = left
    private pointValue: number = GAME_CONSTANTS.UFO_POINTS;
    private isBonus: boolean = false;

    constructor(x: number, y: number, isBonus: boolean = false) {
        super(x, y, GAME_CONSTANTS.UFO_WIDTH, GAME_CONSTANTS.UFO_HEIGHT, 'ufo');
        this.setColor(GAME_CONSTANTS.COLORS.UFO);
        this.isBonus = isBonus;
        this.pointValue = isBonus ? GAME_CONSTANTS.BONUS_UFO_POINTS : GAME_CONSTANTS.UFO_POINTS;
    }

    public update(deltaTime: number): void {
        // Move UFO horizontally
        this.x += (this.direction * GAME_CONSTANTS.UFO_SPEED * deltaTime) / 16.67;

        // Check if UFO has left the screen
        if (
            (this.direction === 1 && this.x > GAME_CONSTANTS.CANVAS_WIDTH + 50) ||
            (this.direction === -1 && this.x < -50)
        ) {
            this.active = false;
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        if (!this.active) return;

        // Draw UFO as flying saucer shape
        ctx.fillStyle = this.color;

        // Main saucer body (ellipse)
        ctx.beginPath();
        ctx.ellipse(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width / 2,
            this.height / 3,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Saucer dome (half circle on top)
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2,
            this.y + this.height / 3,
            this.width / 3,
            0,
            Math.PI,
            false
        );
        ctx.fill();

        // Add blinking lights for bonus UFO
        if (this.isBonus) {
            const time = Date.now();
            const blink = Math.sin(time / 200) > 0; // Blink every 200ms

            ctx.fillStyle = blink ? '#ff00ff' : '#ff8800';
            ctx.beginPath();
            ctx.arc(
                this.x + this.width / 2 - this.width / 4,
                this.y + this.height / 3,
                this.width / 4,
                0,
                Math.PI * 2,
                false
            );
            ctx.fill();

            ctx.beginPath();
            ctx.arc(
                this.x + this.width / 2 + this.width / 4,
                this.y + this.height / 3,
                this.width / 4,
                0,
                Math.PI * 2,
                false
            );
            ctx.fill();
        }

        // Draw point value above UFO for bonus
        if (this.isBonus) {
            ctx.fillStyle = '#ffff00';
            ctx.font = 'bold 12px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(this.pointValue.toString(), this.x + this.width / 2, this.y - 10);
        }

        // Draw point value above UFO for bonus
        if (this.isBonus) {
            ctx.fillStyle = '#ffff00';
            ctx.font = 'bold 12px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(this.pointValue.toString(), this.x + this.width / 2, this.y - 10);
        }
    }

    public setDirection(direction: number): void {
        this.direction = direction;
    }

    public getDirection(): number {
        return this.direction;
    }

    public getPointValue(): number {
        return this.pointValue;
    }

    public isBonusUFO(): boolean {
        return this.isBonus;
    }

    public spawnFromLeft(): void {
        this.x = -GAME_CONSTANTS.UFO_WIDTH;
        this.y = GAME_CONSTANTS.UFO_Y;
        this.direction = 1; // Move right
        this.active = true;
    }

    public spawnFromRight(): void {
        this.x = GAME_CONSTANTS.CANVAS_WIDTH + GAME_CONSTANTS.UFO_WIDTH;
        this.y = GAME_CONSTANTS.UFO_Y;
        this.direction = -1; // Move left
        this.active = true;
    }

    public destroy(): void {
        this.active = false;
    }

    public getBounds(): { x: number; y: number; width: number; height: number } {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        };
    }
}
