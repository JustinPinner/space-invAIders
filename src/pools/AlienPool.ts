import { ObjectPool } from '../pools/ObjectPool';
import { Alien } from '../entities/Alien';
import { GAME_CONSTANTS } from '../utils/GameConstants';

export class AlienPool extends ObjectPool<Alien> {
    constructor() {
        super(
            () => new Alien(0, 0, 0, 0),
            GAME_CONSTANTS.ALIEN_ROWS * GAME_CONSTANTS.ALIEN_COLUMNS,
            GAME_CONSTANTS.MAX_ALIENS
        );
    }

    protected createObject(): Alien {
        return new Alien(0, 0, 0, 0);
    }

    protected resetObject(alien: Alien): void {
        alien.setPosition(0, 0);
        alien.setDirection(1);
        alien.destroy();
    }

    public updateAliens(_deltaTime: number): void {
        // Update all aliens - to be implemented in User Story 3
    }

    public createAlienGrid(rows: number, columns: number, startX: number, startY: number): Alien[] {
        const aliens: Alien[] = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const alien = this.acquire();
                if (alien) {
                    alien.setPosition(
                        startX + col * GAME_CONSTANTS.ALIEN_SPACING_X,
                        startY + row * GAME_CONSTANTS.ALIEN_SPACING_Y
                    );
                    aliens.push(alien);
                }
            }
        }

        return aliens;
    }

    public getAllAliens(): Alien[] {
        return [...this.getActive()];
    }

    public removeAlien(alien: Alien): void {
        this.release(alien);
    }
}
