import { GameObject } from '../core/GameObject';
import { GAME_CONSTANTS } from '../utils/GameConstants';

export class Alien extends GameObject {
    private row: number;
    private column: number;
    private direction: number = 1; // 1 = right, -1 = left

    constructor(x: number, y: number, row: number, column: number) {
        super(x, y, GAME_CONSTANTS.ALIEN_WIDTH, GAME_CONSTANTS.ALIEN_HEIGHT, 'alien');
        this.row = row;
        this.column = column;
        this.setColor(GAME_CONSTANTS.COLORS.ALIEN);
    }

    public update(_deltaTime: number): void {
        // Movement handled by game controller in User Story 3
    }

    public render(ctx: CanvasRenderingContext2D): void {
        // Draw alien as triangle/diamond shape pointing up
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y); // Top point
        ctx.lineTo(this.x + this.width, this.y + this.height / 2); // Right point
        ctx.lineTo(this.x + this.width / 2, this.y + this.height); // Bottom point
        ctx.lineTo(this.x, this.y + this.height / 2); // Left point
        ctx.closePath();
        ctx.fill();

        // Draw alien details (eyes)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 4, this.y + 6, 3, 2); // Left eye
        ctx.fillRect(this.x + this.width - 7, this.y + 6, 3, 2); // Right eye

        // Draw antennae
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2 - 2, this.y);
        ctx.lineTo(this.x + this.width / 2 - 2, this.y - 3);
        ctx.moveTo(this.x + this.width / 2 + 2, this.y);
        ctx.lineTo(this.x + this.width / 2 + 2, this.y - 3);
        ctx.stroke();
    }

    public setDirection(direction: number): void {
        this.direction = direction;
    }

    public getDirection(): number {
        return this.direction;
    }

    public getRow(): number {
        return this.row;
    }

    public getColumn(): number {
        return this.column;
    }

    public setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    public moveLeft(speed: number): void {
        this.x -= speed;
    }

    public moveRight(speed: number): void {
        this.x += speed;
    }

    public moveDown(distance: number): void {
        this.y += distance;
    }

    public destroy(): void {
        this.active = false;
    }
}
