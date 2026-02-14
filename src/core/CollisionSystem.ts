import { GameObject } from './GameObject';

export interface CollisionResult {
    collided: boolean;
    entity1?: GameObject;
    entity2?: GameObject;
}

export class CollisionSystem {
    private spatialGrid: Map<string, GameObject[]>;
    private cellSize: number;

    constructor() {
        this.spatialGrid = new Map();
        this.cellSize = 50; // 50px grid cells for efficiency
    }

    public update(_entities: GameObject[]): void {
        this.clearGrid();
        this.populateGrid(_entities);
    }

    private clearGrid(): void {
        this.spatialGrid.clear();
    }

    private populateGrid(entities: GameObject[]): void {
        for (const entity of entities) {
            if (!entity.active) continue;

            const cells = this.getCellsForEntity(entity);
            for (const cellKey of cells) {
                if (!this.spatialGrid.has(cellKey)) {
                    this.spatialGrid.set(cellKey, []);
                }
                this.spatialGrid.get(cellKey)!.push(entity);
            }
        }
    }

    private getCellsForEntity(entity: GameObject): string[] {
        const cells: string[] = [];
        const startX = Math.floor(entity.x / this.cellSize);
        const endX = Math.floor((entity.x + entity.width) / this.cellSize);
        const startY = Math.floor(entity.y / this.cellSize);
        const endY = Math.floor((entity.y + entity.height) / this.cellSize);

        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                cells.push(`${x},${y}`);
            }
        }

        return cells;
    }

    public checkAABBCollision(obj1: GameObject, obj2: GameObject): boolean {
        return (
            obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y
        );
    }

    public checkEntityCollisions(entity: GameObject, _entities: GameObject[]): GameObject[] {
        const collidingEntities: GameObject[] = [];
        const cells = this.getCellsForEntity(entity);
        const checkedEntities = new Set<GameObject>();

        for (const cellKey of cells) {
            const cellEntities = this.spatialGrid.get(cellKey) || [];

            for (const otherEntity of cellEntities) {
                if (
                    otherEntity === entity ||
                    otherEntity.type === entity.type ||
                    checkedEntities.has(otherEntity)
                )
                    continue;

                if (this.checkAABBCollision(entity, otherEntity)) {
                    collidingEntities.push(otherEntity);
                    checkedEntities.add(otherEntity);
                }
            }
        }

        return collidingEntities;
    }

    public checkBulletAlienCollisions(
        bullets: GameObject[],
        aliens: GameObject[]
    ): CollisionResult[] {
        const results: CollisionResult[] = [];

        for (const bullet of bullets) {
            if (!bullet.active) continue;

            this.update(aliens);
            const collidingAliens = this.checkEntityCollisions(bullet, aliens);
            for (const alien of collidingAliens) {
                results.push({
                    collided: true,
                    entity1: bullet,
                    entity2: alien,
                });
            }
        }

        return results;
    }

    public checkBombCollisions(bombs: GameObject[], targets: GameObject[]): CollisionResult[] {
        const results: CollisionResult[] = [];

        for (const bomb of bombs) {
            if (!bomb.active) continue;

            const collidingTargets = this.checkEntityCollisions(bomb, targets);
            for (const target of collidingTargets) {
                results.push({
                    collided: true,
                    entity1: bomb,
                    entity2: target,
                });
            }
        }

        return results;
    }

    public checkBombPlayerCollisions(bombs: GameObject[], player: GameObject): CollisionResult[] {
        const results: CollisionResult[] = [];

        if (!player.active) {
            return results;
        }

        for (const bomb of bombs) {
            if (!bomb.active) continue;

            if (this.checkAABBCollision(bomb, player)) {
                results.push({
                    collided: true,
                    entity1: bomb,
                    entity2: player,
                });
            }
        }

        return results;
    }

    public getCellSize(): number {
        return this.cellSize;
    }
}
