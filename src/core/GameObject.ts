import { Rectangle, Velocity, RenderLayer } from '../types/GameTypes';

export abstract class GameObject {
    public id: string;
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public velocity: Velocity;
    public active: boolean;
    public layer: RenderLayer;
    public color: string;
    public type: string;

    constructor(x: number, y: number, width: number, height: number, type: string) {
        this.id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocity = { x: 0, y: 0 };
        this.active = true;
        this.layer = RenderLayer.BACKGROUND;
        this.color = '#ffffff';
        this.type = type;
    }

    public abstract update(deltaTime: number): void;
    public abstract render(ctx: CanvasRenderingContext2D): void;

    public getBounds(): Rectangle {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        };
    }

    public setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    public setVelocity(vx: number, vy: number): void {
        this.velocity.x = vx;
        this.velocity.y = vy;
    }

    public isColliding(other: GameObject): boolean {
        const bounds1 = this.getBounds();
        const bounds2 = other.getBounds();

        return !(
            bounds1.x + bounds1.width < bounds2.x ||
            bounds2.x + bounds2.width < bounds1.x ||
            bounds1.y + bounds1.height < bounds2.y ||
            bounds2.y + bounds2.height < bounds1.y
        );
    }

    public setColor(color: string): void {
        this.color = color;
    }

    public destroy(): void {
        this.active = false;
    }

    public isOffScreen(canvasWidth: number, canvasHeight: number): boolean {
        return (
            this.x + this.width < 0 ||
            this.x > canvasWidth ||
            this.y + this.height < 0 ||
            this.y > canvasHeight
        );
    }
}
