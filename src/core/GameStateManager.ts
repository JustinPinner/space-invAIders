import { GameState } from '../types/GameTypes';
import { Game } from './Game';

export class GameStateManager {
    private currentState: GameState = 'menu';
    private previousState: GameState = 'menu';
    private game: Game;

    // Level progression
    private currentLevel: number = 1;
    private maxLevel: number = 20;
    private aliensDestroyed: number = 0;
    private aliensPerLevel: number = 48; // 6x8 grid

    // Timing for state transitions
    private stateTimer: number = 0;
    private levelCompleteDelay: number = 2000; // 2 seconds before next level
    private gameOverDelay: number = 3000; // 3 seconds before returning to menu

    constructor(game: Game) {
        this.game = game;
    }

    public getCurrentState(): GameState {
        return this.currentState;
    }

    public getPreviousState(): GameState {
        return this.previousState;
    }

    public setCurrentState(newState: GameState): void {
        if (this.canTransitionTo(newState)) {
            this.previousState = this.currentState;
            this.currentState = newState;
            this.onStateEnter(newState);
        }
    }

    public update(deltaTime: number): void {
        // Update state timers for timed transitions
        if (this.stateTimer > 0) {
            this.stateTimer -= deltaTime;

            // Handle automatic state transitions
            if (this.stateTimer <= 0) {
                this.handleTimedTransition();
            }
        }

        // Update based on current state
        switch (this.currentState) {
            case 'playing':
                this.updatePlayingState(deltaTime);
                break;
            case 'level-complete':
                this.updateLevelCompleteState(deltaTime);
                break;
            case 'game-over':
                this.updateGameOverState(deltaTime);
                break;
            case 'victory':
                this.updateVictoryState(deltaTime);
                break;
        }
    }

    private canTransitionTo(newState: GameState): boolean {
        // Define valid state transitions
        const validTransitions: Record<GameState, GameState[]> = {
            menu: ['playing'],
            playing: ['paused', 'game-over', 'level-complete', 'victory'],
            paused: ['playing', 'menu'],
            'level-complete': ['playing', 'victory'],
            'game-over': ['menu'],
            victory: ['menu'],
        };

        return validTransitions[this.currentState]?.includes(newState) || false;
    }

    private onStateEnter(state: GameState): void {
        switch (state) {
            case 'menu':
                this.onEnterMenu();
                break;
            case 'playing':
                this.onEnterPlaying();
                break;
            case 'paused':
                this.onEnterPaused();
                break;
            case 'level-complete':
                this.onEnterLevelComplete();
                break;
            case 'game-over':
                this.onEnterGameOver();
                break;
            case 'victory':
                this.onEnterVictory();
                break;
        }
    }

    private onEnterMenu(): void {
        console.log('Entered menu state');
        // Reset game state for new game
        this.currentLevel = 1;
        this.aliensDestroyed = 0;
        this.game.setLevel(1);
        this.game.setLives(3);
        this.game.setScore(0);
    }

    private onEnterPlaying(): void {
        console.log('Entered playing state');
        // Resume game loop
        this.game.resume();
    }

    private onEnterPaused(): void {
        console.log('Entered paused state');
        // Pause game loop
        this.game.pause();
    }

    private onEnterLevelComplete(): void {
        console.log(`Level ${this.currentLevel} complete! Bonus UFO incoming!`);
        // Reset timer to 0, will be set after bonus UFO completes (in updateLevelCompleteState)
        this.stateTimer = 0;

        // Award level completion bonus
        const levelBonus = 1000 * this.currentLevel;
        this.game.setScore(this.game.getScore() + levelBonus);

        // Clear all bombs to prevent them from killing player during bonus UFO
        this.game.clearBombs();

        // Level complete sound will play after bonus UFO finishes
    }

    private onEnterGameOver(): void {
        console.log('Game over!');
        // Set timer for automatic transition to menu
        this.stateTimer = this.gameOverDelay;

        // Play game over sound
        this.game.getAudioSystem().playSound('game_over');
    }

    private onEnterVictory(): void {
        console.log('Victory! All 20 levels completed!');
        // Set timer for automatic transition to menu
        this.stateTimer = this.gameOverDelay;

        // Play victory sound
        this.game.getAudioSystem().playSound('victory');
    }

    private updatePlayingState(_deltaTime: number): void {
        const alienGrid = this.game.getAlienGrid();
        const ufoSystem = this.game.getUFOSystem();

        // Check if all aliens are destroyed
        if (alienGrid.getActiveAlienCount() === 0) {
            console.log('All aliens destroyed!');
            // If no bonus UFO is active, spawn one and transition to level-complete
            if (!ufoSystem.isActive()) {
                console.log('Spawning bonus UFO and transitioning to level-complete');
                this.game.getUFOSystem().spawnBonusUFO();
                this.setCurrentState('level-complete');
            } else {
                console.log('Bonus UFO already active, waiting...');
            }
        }

        // Check for game over
        if (this.game.getLives() <= 0) {
            this.setCurrentState('game-over');
        }

        // Check for victory (all 20 levels completed)
        if (this.currentLevel > this.maxLevel) {
            this.setCurrentState('victory');
        }
    }

    private updateLevelCompleteState(_deltaTime: number): void {
        // Wait for bonus UFO to complete (either be destroyed or leave screen)
        const ufoSystem = this.game.getUFOSystem();
        console.log(
            'Level-complete check - UFO active:',
            ufoSystem.isActive(),
            'State timer:',
            this.stateTimer
        );

        // If UFO is no longer active, start the timer for next level transition
        if (!ufoSystem.isActive() && this.stateTimer === 0) {
            console.log('Starting level transition timer');
            this.stateTimer = this.levelCompleteDelay;
            // Play level complete sound now that UFO is finished
            this.game.getAudioSystem().playSound('level_complete');
        }

        // Timer is updated in main update() method, not here
    }

    private updateGameOverState(_deltaTime: number): void {
        // State is handled by timer in handleTimedTransition
    }

    private updateVictoryState(_deltaTime: number): void {
        // State is handled by timer in handleTimedTransition
    }

    private handleTimedTransition(): void {
        switch (this.currentState) {
            case 'level-complete':
                this.startNextLevel();
                break;
            case 'game-over':
            case 'victory':
                this.setCurrentState('menu');
                break;
        }
    }

    private startNextLevel(): void {
        this.currentLevel++;
        this.aliensDestroyed = 0;

        if (this.currentLevel <= this.maxLevel) {
            // Update game with new level
            this.game.setLevel(this.currentLevel);

            // Reset and regenerate entities for new level
            this.game.startNewLevel();

            // Transition back to playing
            this.setCurrentState('playing');
        } else {
            // All levels completed - victory!
            this.setCurrentState('victory');
        }
    }

    // Public methods for game control
    public startGame(): void {
        if (this.currentState === 'menu') {
            this.setCurrentState('playing');
        }
    }

    public pauseGame(): void {
        if (this.currentState === 'playing') {
            this.setCurrentState('paused');
        }
    }

    public resumeGame(): void {
        if (this.currentState === 'paused') {
            this.setCurrentState('playing');
        }
    }

    public returnToMenu(): void {
        if (['paused', 'game-over', 'victory'].includes(this.currentState)) {
            this.setCurrentState('menu');
        }
    }

    // Getters for game state
    public getCurrentLevel(): number {
        return this.currentLevel;
    }

    public getMaxLevel(): number {
        return this.maxLevel;
    }

    public getAliensDestroyed(): number {
        return this.aliensDestroyed;
    }

    public getAliensPerLevel(): number {
        return this.aliensPerLevel;
    }

    public incrementAliensDestroyed(): void {
        this.aliensDestroyed++;
    }

    public getLevelProgress(): number {
        return this.aliensDestroyed / this.aliensPerLevel;
    }

    // Level difficulty scaling
    public getAlienSpeedMultiplier(): number {
        // Increase speed by 10% per level
        return 1 + (this.currentLevel - 1) * 0.1;
    }

    public getAlienFireRateMultiplier(): number {
        // Increase fire rate by 15% per level
        return 1 + (this.currentLevel - 1) * 0.15;
    }

    public getUfoSpawnChanceMultiplier(): number {
        // Increase UFO spawn chance by 20% per level
        return 1 + (this.currentLevel - 1) * 0.2;
    }

    // State utility methods
    public isPlaying(): boolean {
        return this.currentState === 'playing';
    }

    public isPaused(): boolean {
        return this.currentState === 'paused';
    }

    public isGameOver(): boolean {
        return this.currentState === 'game-over';
    }

    public isVictory(): boolean {
        return this.currentState === 'victory';
    }

    public isInMenu(): boolean {
        return this.currentState === 'menu';
    }

    public isInLevelComplete(): boolean {
        return this.currentState === 'level-complete';
    }
}
