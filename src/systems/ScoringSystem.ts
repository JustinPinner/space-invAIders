import { GAME_CONSTANTS } from '../utils/GameConstants';

export interface ScoreEvent {
    points: number;
    reason: string;
    timestamp: number;
}

export class ScoringSystem {
    private score: number = 0;
    private highScore: number = 0;
    private scoreHistory: ScoreEvent[] = [];
    private comboMultiplier: number = 1;
    private lastHitTime: number = 0;

    constructor() {
        this.loadHighScore();
    }

    public addScore(points: number, reason: string): void {
        const now = Date.now();

        // Check for combo (hits within 1 second)
        if (now - this.lastHitTime < 1000) {
            this.comboMultiplier = Math.min(this.comboMultiplier + 0.5, 3);
        } else {
            this.comboMultiplier = 1;
        }

        const finalPoints = Math.floor(points * this.comboMultiplier);
        this.score += finalPoints;
        this.lastHitTime = now;

        // Record score event
        const scoreEvent: ScoreEvent = {
            points: finalPoints,
            reason: `${reason} (${this.comboMultiplier}x)`,
            timestamp: now,
        };
        this.scoreHistory.push(scoreEvent);

        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
    }

    public addAlienScore(): void {
        this.addScore(GAME_CONSTANTS.ALIEN_POINTS, 'alien');
    }

    public addUFOScore(isBonus: boolean = false): void {
        const points = isBonus ? GAME_CONSTANTS.BONUS_UFO_POINTS : GAME_CONSTANTS.UFO_POINTS;
        const reason = isBonus ? 'bonus-ufo' : 'ufo';
        this.addScore(points, reason);
    }

    public addLevelBonus(): void {
        this.addScore(GAME_CONSTANTS.LEVEL_BONUS, 'level-complete');
    }

    public getScore(): number {
        return this.score;
    }

    public getHighScore(): number {
        return this.highScore;
    }

    public getComboMultiplier(): number {
        return this.comboMultiplier;
    }

    public getScoreHistory(): ScoreEvent[] {
        return [...this.scoreHistory];
    }

    public reset(): void {
        this.score = 0;
        this.comboMultiplier = 1;
        this.lastHitTime = 0;
        this.scoreHistory = [];
    }

    public getRecentScoreEvents(count: number = 5): ScoreEvent[] {
        return this.scoreHistory.slice(-count);
    }

    private loadHighScore(): void {
        try {
            const saved = localStorage.getItem('spaceInvaders_highScore');
            if (saved) {
                this.highScore = parseInt(saved, 10);
            }
        } catch (error) {
            console.warn('Failed to load high score:', error);
            this.highScore = 0;
        }
    }

    private saveHighScore(): void {
        try {
            localStorage.setItem('spaceInvaders_highScore', this.highScore.toString());
        } catch (error) {
            console.warn('Failed to save high score:', error);
        }
    }

    public getFormattedScore(): string {
        return this.score.toString().padStart(6, '0');
    }

    public getFormattedHighScore(): string {
        return this.highScore.toString().padStart(6, '0');
    }

    public setScore(score: number): void {
        this.score = score;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
    }

    public getStats(): {
        currentScore: number;
        highScore: number;
        comboMultiplier: number;
        recentHits: number;
    } {
        return {
            currentScore: this.score,
            highScore: this.highScore,
            comboMultiplier: this.comboMultiplier,
            recentHits: this.scoreHistory.length,
        };
    }
}
