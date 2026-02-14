import { GAME_CONSTANTS } from '../utils/GameConstants';

export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    lifetime: number;
    maxLifetime: number;
    color: string;
    active: boolean;
}

export class ExplosionEffect {
    private particles: Particle[] = [];
    private x: number;
    private y: number;
    private isActive: boolean = true;

    constructor(x: number, y: number, particleCount: number = 20) {
        this.x = x;
        this.y = y;
        this.createExplosionParticles(particleCount);
    }

    private createExplosionParticles(count: number): void {
        const colors = [
            GAME_CONSTANTS.COLORS.EXPLOSION,
            '#ffaa00',
            '#ff6600',
            '#ff0000',
            '#ffff00',
        ];

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const speed = 2 + Math.random() * 4;
            const size = 2 + Math.random() * 4;
            const lifetime = 500 + Math.random() * 1000; // 0.5-1.5 seconds

            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                lifetime: lifetime,
                maxLifetime: lifetime,
                color: colors[Math.floor(Math.random() * colors.length)],
                active: true,
            });
        }
    }

    public update(deltaTime: number): void {
        let allParticlesDead = true;

        for (const particle of this.particles) {
            if (!particle.active) {
                continue;
            }

            allParticlesDead = false;

            // Update particle position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Apply gravity
            particle.vy += 0.1;

            // Apply friction
            particle.vx *= 0.98;
            particle.vy *= 0.98;

            // Update lifetime
            particle.lifetime -= deltaTime;

            if (particle.lifetime <= 0) {
                particle.active = false;
            }
        }

        if (allParticlesDead) {
            this.isActive = false;
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        for (const particle of this.particles) {
            if (!particle.active) {
                continue;
            }

            const alpha = particle.lifetime / particle.maxLifetime;
            const size = particle.size * alpha;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = particle.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = particle.color;

            // Draw particle as circle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    public isExpired(): boolean {
        return !this.isActive;
    }

    public getParticles(): Particle[] {
        return this.particles;
    }
}

export class ExplosionSystem {
    private explosions: ExplosionEffect[] = [];

    public createExplosion(
        x: number,
        y: number,
        size: 'small' | 'medium' | 'large' = 'medium'
    ): void {
        const particleCount = size === 'small' ? 10 : size === 'medium' ? 20 : 40;
        this.explosions.push(new ExplosionEffect(x, y, particleCount));
    }

    public createPlayerDeathExplosion(x: number, y: number): void {
        // Create a larger, more dramatic explosion for player death
        this.explosions.push(new ExplosionEffect(x, y, 30));

        // Add secondary explosion
        setTimeout(() => {
            this.explosions.push(new ExplosionEffect(x + 10, y + 5, 15));
        }, 100);

        setTimeout(() => {
            this.explosions.push(new ExplosionEffect(x - 10, y + 5, 15));
        }, 200);
    }

    public createAlienDeathExplosion(x: number, y: number): void {
        this.createExplosion(x, y, 'small');
    }

    public createBuildingHitExplosion(x: number, y: number): void {
        this.createExplosion(x, y, 'small');
    }

    public update(deltaTime: number): void {
        // Update all explosions
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const explosion = this.explosions[i];
            explosion.update(deltaTime);

            // Remove expired explosions
            if (explosion.isExpired()) {
                this.explosions.splice(i, 1);
            }
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        for (const explosion of this.explosions) {
            explosion.render(ctx);
        }
    }

    public clear(): void {
        this.explosions = [];
    }

    public getActiveExplosionCount(): number {
        return this.explosions.length;
    }

    public getTotalParticleCount(): number {
        return this.explosions.reduce((total, explosion) => {
            return total + explosion.getParticles().filter((p) => p.active).length;
        }, 0);
    }
}
