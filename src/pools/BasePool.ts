import { GameObject } from '../core/GameObject';

export abstract class ObjectPool<T extends GameObject> {
    protected pool: T[] = [];
    protected active: T[] = [];
    protected readonly maxSize: number;
    protected readonly createFn: () => T;

    constructor(maxSize: number, createFn: () => T) {
        this.maxSize = maxSize;
        this.createFn = createFn;
        this.preWarm();
    }

    private preWarm(): void {
        for (let i = 0; i < this.maxSize; i++) {
            const obj = this.createFn();
            obj.active = false;
            this.pool.push(obj);
        }
    }

    public acquire(): T | null {
        let obj = this.pool.pop();

        if (!obj) {
            // Try to reuse from active if any are inactive
            const inactiveIndex = this.active.findIndex((o) => !o.active);
            if (inactiveIndex !== -1) {
                obj = this.active.splice(inactiveIndex, 1)[0];
                obj.active = true;
                return obj;
            }

            // Pool exhausted
            console.warn('Object pool exhausted');
            return null;
        }

        obj.active = true;
        this.active.push(obj);
        return obj;
    }

    public release(obj: T): void {
        if (!obj.active) {
            return; // Already released
        }

        obj.active = false;

        const index = this.active.indexOf(obj);
        if (index !== -1) {
            this.active.splice(index, 1);
        }

        // Reset object state
        this.resetObject(obj);

        // Return to pool if not at capacity
        if (this.pool.length < this.maxSize) {
            this.pool.push(obj);
        }
    }

    public update(deltaTime: number): void {
        // Update all active objects
        for (let i = this.active.length - 1; i >= 0; i--) {
            const obj = this.active[i];

            if (!obj.active) {
                this.release(obj);
                continue;
            }

            obj.update(deltaTime);

            // Auto-release if out of bounds
            if (obj.isOffScreen(800, 600)) {
                this.release(obj);
            }
        }
    }

    public renderAll(ctx: CanvasRenderingContext2D): void {
        // Render all active objects
        for (const obj of this.active) {
            if (obj.active) {
                obj.render(ctx);
            }
        }
    }

    public getActiveCount(): number {
        return this.active.length;
    }

    public getPoolSize(): number {
        return this.pool.length;
    }

    public clear(): void {
        // Release all active objects
        for (const obj of this.active) {
            this.release(obj);
        }
    }

    protected abstract resetObject(obj: T): void;
}
