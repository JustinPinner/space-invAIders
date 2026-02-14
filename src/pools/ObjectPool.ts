export abstract class ObjectPool<T> {
    protected pool: T[];
    protected active: T[];
    protected maxSize: number;

    constructor(createFn: () => T, initialSize: number = 10, maxSize: number = 50) {
        this.pool = [];
        this.active = [];
        this.maxSize = maxSize;

        // Pre-warm the pool
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(createFn());
        }
    }

    public acquire(): T | null {
        let obj: T | null = null;

        if (this.pool.length > 0) {
            obj = this.pool.pop()!;
        } else if (this.active.length < this.maxSize) {
            obj = this.createObject();
        }

        if (obj) {
            this.active.push(obj);
        }

        return obj;
    }

    public release(obj: T): void {
        const index = this.active.indexOf(obj);
        if (index > -1) {
            this.active.splice(index, 1);
            this.resetObject(obj);
            this.pool.push(obj);
        }
    }

    public update(_deltaTime: number): void {
        // Update all active objects - to be implemented by subclasses
    }

    public getActive(): readonly T[] {
        return this.active;
    }

    public getActiveCount(): number {
        return this.active.length;
    }

    public clear(): void {
        // Reset all active objects to pool
        for (const obj of this.active) {
            this.resetObject(obj);
            this.pool.push(obj);
        }
        this.active = [];
    }

    protected abstract createObject(): T;
    protected abstract resetObject(obj: T): void;
}
