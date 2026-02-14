import { Building } from '../entities/Building';
import { GAME_CONSTANTS } from '../utils/GameConstants';

export class BuildingManager {
    private buildings: Building[];

    constructor() {
        this.buildings = [];
        this.initializeBuildings();
    }

    private initializeBuildings(): void {
        this.buildings = [];

        for (let i = 0; i < GAME_CONSTANTS.BUILDING_COUNT; i++) {
            const x = GAME_CONSTANTS.BUILDING_START_X + i * GAME_CONSTANTS.BUILDING_SPACING_X;
            const y = GAME_CONSTANTS.BUILDING_Y;
            const building = new Building(x, y);
            this.buildings.push(building);
        }
    }

    public update(deltaTime: number): void {
        for (const building of this.buildings) {
            if (building.active) {
                building.update(deltaTime);
            }
        }

        // Remove destroyed buildings
        this.buildings = this.buildings.filter((building) => building.active);
    }

    public render(ctx: CanvasRenderingContext2D): void {
        for (const building of this.buildings) {
            if (building.active) {
                building.render(ctx);
            }
        }
    }

    public getBuildings(): Building[] {
        return this.buildings.filter((building) => building.active);
    }

    public getAllBuildings(): Building[] {
        return this.buildings;
    }

    public checkCollisionWithProjectile(
        x: number,
        y: number,
        width: number,
        height: number
    ): Building | null {
        for (const building of this.buildings) {
            if (!building.active) continue;

            const buildingBounds = building.getBounds();

            if (
                this.isColliding(
                    x,
                    y,
                    width,
                    height,
                    buildingBounds.x,
                    buildingBounds.y,
                    buildingBounds.width,
                    buildingBounds.height
                )
            ) {
                return building;
            }
        }
        return null;
    }

    private isColliding(
        x1: number,
        y1: number,
        w1: number,
        h1: number,
        x2: number,
        y2: number,
        w2: number,
        h2: number
    ): boolean {
        return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
    }

    public reset(): void {
        this.initializeBuildings();
    }

    public getBuildingCount(): number {
        return this.buildings.filter((building) => building.active).length;
    }

    public isAnyBuildingAtPosition(x: number, y: number): boolean {
        for (const building of this.buildings) {
            if (!building.active) continue;

            const bounds = building.getBounds();
            if (
                x >= bounds.x &&
                x <= bounds.x + bounds.width &&
                y >= bounds.y &&
                y <= bounds.y + bounds.height
            ) {
                return true;
            }
        }
        return false;
    }
}
