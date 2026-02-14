import { GAME_CONSTANTS } from '../utils/GameConstants';

export class UISystem {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private score: number = 0;
    private lives: number = 3;
    private level: number = 1;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
    }

    public update(_deltaTime: number): void {
        // UI update logic (minimal for basic UI)
    }

    public render(): void {
        // Clear UI area
        this.ctx.fillStyle = GAME_CONSTANTS.COLORS.UI_BACKGROUND;
        this.ctx.fillRect(0, 0, this.canvas.width, GAME_CONSTANTS.UI_HEIGHT);

        // Draw lives on the left
        this.renderLives();

        // Draw game title in the center
        this.renderTitle();

        // Draw score on the right
        this.renderScore();

        // Draw level below title
        this.renderLevel();
    }

    private renderLives(): void {
        // Draw text label
        this.ctx.fillStyle = GAME_CONSTANTS.COLORS.UI_TEXT;
        this.ctx.font = '16px "Courier New", monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('LIVES:', GAME_CONSTANTS.LIVES_OFFSET_X, GAME_CONSTANTS.LIVES_OFFSET_Y);

        // Draw life indicators as small cannons
        const startX = GAME_CONSTANTS.LIVES_OFFSET_X + 60;
        const startY = GAME_CONSTANTS.LIVES_OFFSET_Y - 10;

        for (let i = 0; i < this.lives; i++) {
            const x = startX + i * 25;
            this.drawLifeIndicator(x, startY);
        }

        // Draw empty indicators for lost lives
        for (let i = this.lives; i < GAME_CONSTANTS.INITIAL_LIVES; i++) {
            const x = startX + i * 25;
            this.drawEmptyLifeIndicator(x, startY);
        }
    }

    private drawLifeIndicator(x: number, y: number): void {
        // Draw small cannon shape to represent a life
        this.ctx.fillStyle = GAME_CONSTANTS.COLORS.PLAYER;
        this.ctx.beginPath();
        this.ctx.moveTo(x + 6, y); // Top center
        this.ctx.lineTo(x, y + 10); // Bottom left
        this.ctx.lineTo(x + 12, y + 10); // Bottom right
        this.ctx.closePath();
        this.ctx.fill();

        // Draw cannon base
        this.ctx.fillRect(x + 4, y + 8, 4, 2);
    }

    private drawEmptyLifeIndicator(x: number, y: number): void {
        // Draw empty outline for lost lives
        this.ctx.strokeStyle = '#444444';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(x + 6, y); // Top center
        this.ctx.lineTo(x, y + 10); // Bottom left
        this.ctx.lineTo(x + 12, y + 10); // Bottom right
        this.ctx.closePath();
        this.ctx.stroke();

        // Draw cannon base outline
        this.ctx.strokeRect(x + 4, y + 8, 4, 2);
    }

    private renderTitle(): void {
        this.ctx.fillStyle = GAME_CONSTANTS.COLORS.UI_TEXT;
        this.ctx.font = 'bold 24px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Space InvAIders', this.canvas.width / 2, GAME_CONSTANTS.LIVES_OFFSET_Y);
    }

    private renderScore(): void {
        this.ctx.fillStyle = GAME_CONSTANTS.COLORS.UI_TEXT;
        this.ctx.font = '18px "Courier New", monospace';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(
            `SCORE: ${this.score}`,
            this.canvas.width - GAME_CONSTANTS.SCORE_OFFSET_X,
            GAME_CONSTANTS.SCORE_OFFSET_Y
        );
    }

    private renderLevel(): void {
        this.ctx.fillStyle = GAME_CONSTANTS.COLORS.UI_TEXT;
        this.ctx.font = '16px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            `LEVEL: ${this.level}`,
            this.canvas.width / 2,
            GAME_CONSTANTS.LIVES_OFFSET_Y + 30
        );
    }

    public renderGameState(gameState: string): void {
        this.ctx.fillStyle = GAME_CONSTANTS.COLORS.UI_TEXT;
        this.ctx.font = 'bold 36px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        switch (gameState) {
            case 'menu':
                this.ctx.fillText(
                    'PRESS ENTER TO START',
                    this.canvas.width / 2,
                    this.canvas.height / 2
                );
                this.ctx.font = '20px "Courier New", monospace';
                this.ctx.fillText(
                    'USE ARROW KEYS TO MOVE, SPACE TO SHOOT',
                    this.canvas.width / 2,
                    this.canvas.height / 2 + 50
                );
                break;
            case 'paused':
                this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
                this.ctx.font = '20px "Courier New", monospace';
                this.ctx.fillText(
                    'PRESS ESC TO RESUME',
                    this.canvas.width / 2,
                    this.canvas.height / 2 + 50
                );
                break;
            case 'level-complete':
                this.ctx.fillText('LEVEL COMPLETE!', this.canvas.width / 2, this.canvas.height / 2);
                this.ctx.font = '20px "Courier New", monospace';
                this.ctx.fillText(
                    'PREPARING NEXT LEVEL...',
                    this.canvas.width / 2,
                    this.canvas.height / 2 + 50
                );
                break;
            case 'game-over':
                this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
                this.ctx.font = '20px "Courier New", monospace';
                this.ctx.fillText(
                    `FINAL SCORE: ${this.score}`,
                    this.canvas.width / 2,
                    this.canvas.height / 2 + 50
                );
                this.ctx.fillText(
                    'PRESS ENTER TO RETURN TO MENU',
                    this.canvas.width / 2,
                    this.canvas.height / 2 + 80
                );
                break;
            case 'victory':
                this.ctx.fillText('VICTORY!', this.canvas.width / 2, this.canvas.height / 2);
                this.ctx.font = '20px "Courier New", monospace';
                this.ctx.fillText(
                    'ALL 20 LEVELS COMPLETED!',
                    this.canvas.width / 2,
                    this.canvas.height / 2 + 50
                );
                this.ctx.fillText(
                    `FINAL SCORE: ${this.score}`,
                    this.canvas.width / 2,
                    this.canvas.height / 2 + 80
                );
                this.ctx.fillText(
                    'PRESS ENTER TO RETURN TO MENU',
                    this.canvas.width / 2,
                    this.canvas.height / 2 + 110
                );
                break;
        }
    }

    public setScore(score: number): void {
        this.score = score;
    }

    public setLives(lives: number): void {
        this.lives = lives;
    }

    public setLevel(level: number): void {
        this.level = level;
    }

    public getScore(): number {
        return this.score;
    }

    public getLives(): number {
        return this.lives;
    }

    public getLevel(): number {
        return this.level;
    }
}
