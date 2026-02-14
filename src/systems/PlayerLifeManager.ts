import { Player } from '../entities/Player';
import { GAME_CONSTANTS } from '../utils/GameConstants';
import { AudioSystem } from './AudioSystem';

export class PlayerLifeManager {
    private player: Player;
    private respawnDelay: number = 2000; // 2 seconds respawn delay
    private lastDeathTime: number = 0;
    private isRespawning: boolean = false;
    private audioSystem?: AudioSystem;

    constructor(player: Player, audioSystem?: AudioSystem) {
        this.player = player;
        this.audioSystem = audioSystem;
    }

    public setAudioSystem(audioSystem: AudioSystem): void {
        this.audioSystem = audioSystem;
    }

    public handlePlayerDeath(): void {
        if (this.isRespawning) {
            return; // Already respawning
        }

        this.lastDeathTime = Date.now();
        this.isRespawning = true;

        // Play death sound
        if (this.audioSystem) {
            this.audioSystem.playSound('player-death');
        }

        // Lose a life
        this.player.loseLife();

        // Schedule respawn if player still has lives
        if (this.player.getLives() > 0) {
            setTimeout(() => {
                this.respawnPlayer();
            }, this.respawnDelay);
        }
    }

    private respawnPlayer(): void {
        if (this.player.getLives() > 0) {
            this.player.respawn();
            this.isRespawning = false;

            // Play respawn sound
            if (this.audioSystem) {
                this.audioSystem.playSound('player-respawn');
            }
        } else {
            // Game over - player is out of lives
            this.isRespawning = false;
        }
    }

    public isPlayerRespawning(): boolean {
        return this.isRespawning;
    }

    public getRemainingLives(): number {
        return this.player.getLives();
    }

    public canRespawn(): boolean {
        return this.player.getLives() > 0 && !this.player.active;
    }

    public reset(): void {
        this.player.reset(GAME_CONSTANTS.PLAYER_START_X, GAME_CONSTANTS.PLAYER_Y);
        this.lastDeathTime = 0;
        this.isRespawning = false;
    }

    public setLives(lives: number): void {
        this.player.setLives(lives);
        if (lives <= 0) {
            this.isRespawning = false;
        }
    }

    public forceRespawn(): void {
        if (this.canRespawn()) {
            this.respawnPlayer();
        }
    }

    public setRespawnDelay(delay: number): void {
        this.respawnDelay = delay;
    }

    public getRespawnDelay(): number {
        return this.respawnDelay;
    }

    public getTimeSinceDeath(): number {
        return Date.now() - this.lastDeathTime;
    }

    public getRespawnProgress(): number {
        if (!this.isRespawning) {
            return 1.0; // Complete
        }
        return Math.min(1.0, this.getTimeSinceDeath() / this.respawnDelay);
    }
}
