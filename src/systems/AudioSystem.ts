export class AudioSystem {
    private masterVolume: number = 0.7;
    private isMuted: boolean = false;

    constructor() {
        this.init();
    }

    public async init(): Promise<void> {
        // Initialize audio system
        try {
            console.log('Audio system initialized');
        } catch (error) {
            console.warn('Audio initialization failed:', error);
        }
    }

    public playSound(type: string): void {
        if (!this.isMuted) {
            // Basic sound playing - will be enhanced when Howler is properly installed
            console.log(`Playing sound: ${type}`);

            // Handle bomb-related sounds
            switch (type) {
                case 'bomb-drop':
                    this.playBombDropSound();
                    break;
                case 'player-death':
                    this.playPlayerDeathSound();
                    break;
                case 'player-respawn':
                    this.playPlayerRespawnSound();
                    break;
                case 'explosion':
                    this.playExplosionSound();
                    break;
                default:
                    // Default sound handling
                    this.playDefaultSound(type);
                    break;
            }
        }
    }

    public stopSound(type: string): void {
        console.log(`Stopping sound: ${type}`);
    }

    public playMusic(): void {
        console.log('Playing music');
    }

    public stopMusic(): void {
        console.log('Stopping music');
    }

    public setMasterVolume(volume: number): void {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    public mute(): void {
        this.isMuted = true;
    }

    public unmute(): void {
        this.isMuted = false;
    }

    public isAudioEnabled(): boolean {
        return typeof AudioContext !== 'undefined';
    }

    public getVolume(): number {
        return this.masterVolume;
    }

    public getIsMuted(): boolean {
        return this.isMuted;
    }

    // User interaction required for autoplay policies
    public unlockAudio(): void {
        // Play a silent sound to unlock audio
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }

    // Sound effect methods for bomb system
    private playBombDropSound(): void {
        // Create a simple bomb drop sound using Web Audio API
        this.createTone(150, 0.1, 'sawtooth'); // Low frequency drop sound
    }

    private playPlayerDeathSound(): void {
        // Create a dramatic death sound
        this.createTone(300, 0.5, 'square'); // Start with medium tone
        setTimeout(() => this.createTone(150, 0.3, 'sawtooth'), 100); // Drop to lower tone
        setTimeout(() => this.createTone(75, 0.2, 'sine'), 200); // Final low tone
    }

    private playPlayerRespawnSound(): void {
        // Create a hopeful respawn sound
        this.createTone(200, 0.1, 'sine');
        setTimeout(() => this.createTone(400, 0.1, 'sine'), 100);
        setTimeout(() => this.createTone(600, 0.2, 'sine'), 200);
    }

    private playExplosionSound(): void {
        // Create a noise-based explosion sound
        this.createNoise(0.2);
    }

    private playDefaultSound(_type: string): void {
        // Default sound implementation for other types
        this.createTone(440, 0.1, 'square'); // Simple beep
    }

    // Web Audio API helper methods
    private createTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = type;
            oscillator.frequency.value = frequency;

            gainNode.gain.setValueAtTime(this.masterVolume * 0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Failed to play tone:', error);
        }
    }

    private createNoise(duration: number): void {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const bufferSize = audioContext.sampleRate * duration;
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const output = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }

            const whiteNoise = audioContext.createBufferSource();
            const gainNode = audioContext.createGain();

            whiteNoise.buffer = buffer;
            whiteNoise.connect(gainNode);
            gainNode.connect(audioContext.destination);

            gainNode.gain.setValueAtTime(this.masterVolume * 0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            whiteNoise.start(audioContext.currentTime);
            whiteNoise.stop(audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Failed to play noise:', error);
        }
    }
}
