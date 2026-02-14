// Simple test to verify UFO system functionality
import { UFOSystem } from '../systems/UFOSystem';
import { GAME_CONSTANTS } from '../utils/GameConstants';

describe('UFO System Tests', () => {
    let ufoSystem: UFOSystem;

    beforeEach(() => {
        ufoSystem = new UFOSystem();
    });

    test('UFO system should initialize without active UFO', () => {
        expect(ufoSystem.isActive()).toBe(false);
        expect(ufoSystem.getUFO()).toBeNull();
    });

    test('UFO system should spawn UFO when requested', () => {
        ufoSystem.spawnUFO();
        expect(ufoSystem.isActive()).toBe(true);
        expect(ufoSystem.getUFO()).not.toBeNull();
    });

    test('UFO system should spawn bonus UFO when requested', () => {
        ufoSystem.spawnBonusUFO();
        expect(ufoSystem.isActive()).toBe(true);

        const ufo = ufoSystem.getUFO();
        expect(ufo).not.toBeNull();
        expect(ufo!.isBonusUFO()).toBe(true);
        expect(ufo!.getPointValue()).toBe(GAME_CONSTANTS.BONUS_UFO_POINTS);
    });

    test('UFO system should destroy UFO and return points', () => {
        ufoSystem.spawnUFO();
        const points = ufoSystem.destroyUFO();

        expect(points).toBe(GAME_CONSTANTS.UFO_POINTS);
        expect(ufoSystem.isActive()).toBe(false);
        expect(ufoSystem.getUFO()).toBeNull();
    });

    test('UFO system should return 0 points when no UFO active', () => {
        const points = ufoSystem.destroyUFO();
        expect(points).toBe(0);
    });

    test('UFO system should not spawn UFO when one is already active', () => {
        ufoSystem.spawnUFO();
        const initialUFO = ufoSystem.getUFO();

        ufoSystem.spawnUFO(); // Try to spawn another
        const currentUFO = ufoSystem.getUFO();

        expect(currentUFO).toBe(initialUFO); // Should be the same UFO
    });

    test('UFO system should reset properly', () => {
        ufoSystem.spawnUFO();
        ufoSystem.reset();

        expect(ufoSystem.isActive()).toBe(false);
        expect(ufoSystem.getUFO()).toBeNull();
    });
});
