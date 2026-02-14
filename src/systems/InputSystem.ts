export class InputSystem {
    private keys: Map<string, boolean>;
    private keysPressed: Map<string, number>;

    constructor() {
        this.keys = new Map();
        this.keysPressed = new Map();
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    private handleKeyDown(event: KeyboardEvent): void {
        const key = event.key;
        if (!this.keys.get(key)) {
            this.keys.set(key, true);
            this.keysPressed.set(key, Date.now());
        }
    }

    private handleKeyUp(event: KeyboardEvent): void {
        const key = event.key;
        this.keys.set(key, false);
        this.keysPressed.delete(key);
    }

    public isKeyPressed(key: string): boolean {
        return this.keys.get(key) || false;
    }

    public isKeyJustPressed(key: string): boolean {
        const pressTime = this.keysPressed.get(key);
        if (!pressTime) return false;

        const now = Date.now();
        const justPressed = now - pressTime < 100; // Within 100ms
        if (justPressed) {
            this.keysPressed.delete(key);
        }

        return justPressed;
    }

    public getPressedKeys(): string[] {
        return Array.from(this.keys.keys()).filter((key) => this.keys.get(key));
    }

    public reset(): void {
        this.keys.clear();
        this.keysPressed.clear();
    }

    public destroy(): void {
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
        document.removeEventListener('keyup', this.handleKeyUp.bind(this));
    }
}
