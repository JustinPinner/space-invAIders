import { GAME_CONSTANTS } from '../utils/GameConstants';
import { AlienGrid } from './AlienGrid';
import { BuildingManager } from './BuildingManager';
import { UFOSystem } from './UFOSystem';
import { ScoringSystem } from './ScoringSystem';

export interface LevelConfig {
    level: number;
    alienSpeed: number;
    alienBombFrequency: number;
    ufoSpawnChance: number;
    scoreMultiplier: number;
}

export class LevelManager {
    private currentLevel: number = 1;
    private maxLevel: number = GAME_CONSTANTS.MAX_LEVELS;
    private levelCompleted: boolean = false;
    private levelCompleteTime: number = 0;
    private levelCompleteDelay: number = 2000; // 2 seconds before next level

    constructor(
        private alienGrid: AlienGrid,
        private buildingManager: BuildingManager,
        private ufoSystem: UFOSystem,
        private scoringSystem: ScoringSystem
    ) {}

    public getCurrentLevel(): number {
        return this.currentLevel;
    }

    public getMaxLevel(): number {
        return this.maxLevel;
    }

    public isVictory(): boolean {
        return this.currentLevel > this.maxLevel;
    }

    public isLevelComplete(): boolean {
        return this.levelCompleted;
    }

    public getLevelConfig(): LevelConfig {
        const baseSpeed = GAME_CONSTANTS.ALIEN_BASE_SPEED;
        const speedIncrease = 0.2; // 20% speed increase per level

        return {
            level: this.currentLevel,
            alienSpeed: baseSpeed + (this.currentLevel - 1) * speedIncrease,
            alienBombFrequency: Math.min(0.1 + (this.currentLevel - 1) * 0.02, 0.5), // Max 50% chance
            ufoSpawnChance: Math.min(0.3 + (this.currentLevel - 1) * 0.05, 0.8), // Max 80% chance
            scoreMultiplier: 1 + (this.currentLevel - 1) * 0.1, // 10% score increase per level
        };
    }

    public update(deltaTime: number): void {
        // Check for level completion
        if (!this.levelCompleted && this.checkLevelCompletion()) {
            this.completeLevel();
        }

        // Handle level complete delay
        if (this.levelCompleted) {
            this.levelCompleteTime += deltaTime;
            if (this.levelCompleteTime >= this.levelCompleteDelay) {
                this.nextLevel();
            }
        }
    }

    public checkLevelCompletion(): boolean {
        // Level is complete when all aliens are destroyed
        return this.alienGrid.getActiveAlienCount() === 0;
    }

    public completeLevel(): void {
        this.levelCompleted = true;
        this.levelCompleteTime = 0;

        // Add level completion bonus
        const levelBonus = GAME_CONSTANTS.LEVEL_BONUS * this.currentLevel;
        this.scoringSystem.addScore(levelBonus, 'level-complete');

        // Spawn bonus UFO for completing the level
        this.ufoSystem.spawnBonusUFO();
    }

    public nextLevel(): void {
        if (this.isVictory()) {
            return; // Game already won
        }

        this.currentLevel++;
        this.levelCompleted = false;
        this.levelCompleteTime = 0;

        // Reset and respawn entities for new level
        this.setupLevel();
    }

    public setupLevel(): void {
        // Reset alien grid with new speed
        this.alienGrid.reset();
        const levelConfig = this.getLevelConfig();
        this.alienGrid.setMoveInterval(1000 / (1 + levelConfig.alienSpeed)); // Adjust move interval based on speed

        // Regenerate buildings
        this.buildingManager.reset();

        // Reset UFO system
        this.ufoSystem.reset();
    }

    public reset(): void {
        this.currentLevel = 1;
        this.levelCompleted = false;
        this.levelCompleteTime = 0;
        this.setupLevel();
    }

    public getProgress(): { current: number; total: number; percentage: number } {
        return {
            current: Math.min(this.currentLevel, this.maxLevel),
            total: this.maxLevel,
            percentage: (Math.min(this.currentLevel, this.maxLevel) / this.maxLevel) * 100,
        };
    }

    public getLevelCompleteProgress(): { completed: boolean; timeRemaining: number } {
        return {
            completed: this.levelCompleted,
            timeRemaining: Math.max(0, this.levelCompleteDelay - this.levelCompleteTime),
        };
    }
}
