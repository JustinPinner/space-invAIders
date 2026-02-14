import { GameObject } from '../core/GameObject';
import { GAME_CONSTANTS } from '../utils/GameConstants';

export class Building extends GameObject {
    private maxHealth: number = 100;
    private currentHealth: number = 100;
    private damageSections: boolean[][];

    constructor(x: number, y: number) {
        super(x, y, GAME_CONSTANTS.BUILDING_WIDTH, GAME_CONSTANTS.BUILDING_HEIGHT, 'building');
        this.setColor(GAME_CONSTANTS.COLORS.BUILDING);

        // Initialize damage grid (5x4 sections for visual damage representation)
        this.damageSections = [];
        for (let row = 0; row < 4; row++) {
            this.damageSections[row] = [];
            for (let col = 0; col < 5; col++) {
                this.damageSections[row][col] = false;
            }
        }
    }

    public update(_deltaTime: number): void {
        // Buildings don't move, just check health
        if (this.currentHealth <= 0) {
            this.active = false;
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        if (!this.active) return;

        const healthPercentage = this.currentHealth / this.maxHealth;
        const sectionWidth = this.width / 5;
        const sectionHeight = this.height / 4;

        // Draw building sections with damage
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 5; col++) {
                if (!this.damageSections[row][col]) {
                    // Calculate section color based on overall health
                    const damageIntensity = 1.0 - healthPercentage;
                    const red = Math.floor(0x00 + damageIntensity * 0xff);
                    const green = Math.floor(0x88 + damageIntensity * (0x00 - 0x88));
                    const blue = Math.floor(0xff + damageIntensity * (0x00 - 0xff));

                    ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
                    ctx.fillRect(
                        this.x + col * sectionWidth,
                        this.y + row * sectionHeight,
                        sectionWidth - 1,
                        sectionHeight - 1
                    );
                }
            }
        }

        // Draw building outline
        ctx.strokeStyle = GAME_CONSTANTS.COLORS.BUILDING;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Draw health bar above building
        this.renderHealthBar(ctx);
    }

    private renderHealthBar(ctx: CanvasRenderingContext2D): void {
        const barWidth = this.width;
        const barHeight = 4;
        const barY = this.y - 10;
        const healthPercentage = this.currentHealth / this.maxHealth;

        // Background
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x, barY, barWidth, barHeight);

        // Health
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x, barY, barWidth * healthPercentage, barHeight);

        // Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, barY, barWidth, barHeight);
    }

    public takeDamage(damage: number): void {
        this.currentHealth = Math.max(0, this.currentHealth - damage);
        this.applyVisualDamage();

        if (this.currentHealth <= 0) {
            this.destroy();
        }
    }

    private applyVisualDamage(): void {
        const damageLevel = 1.0 - this.currentHealth / this.maxHealth;
        const sectionsToDestroy = Math.floor(damageLevel * 20); // 20 total sections

        let destroyed = 0;
        for (let row = 0; row < 4 && destroyed < sectionsToDestroy; row++) {
            for (let col = 0; col < 5 && destroyed < sectionsToDestroy; col++) {
                if (!this.damageSections[row][col]) {
                    this.damageSections[row][col] = true;
                    destroyed++;
                }
            }
        }
    }

    public getHealth(): number {
        return this.currentHealth;
    }

    public getMaxHealth(): number {
        return this.maxHealth;
    }

    public getHealthPercentage(): number {
        return this.currentHealth / this.maxHealth;
    }

    public isDestroyed(): boolean {
        return this.currentHealth <= 0;
    }

    public repair(): void {
        this.currentHealth = this.maxHealth;
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 5; col++) {
                this.damageSections[row][col] = false;
            }
        }
    }

    public destroy(): void {
        this.active = false;
        this.currentHealth = 0;
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
