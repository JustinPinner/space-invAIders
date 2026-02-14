import { GameObject } from '../core/GameObject';

export class RenderSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private layers: Map<number, GameObject[]>;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.layers = new Map();
    
    // Initialize all layers
    for (let layer = 0; layer <= 7; layer++) {
      this.layers.set(layer, []);
    }
  }
  
  public beginFrame(): void {
    // Clear canvas for new frame
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  public endFrame(): void {
    // Present the frame (browser handles this automatically)
  }
  
  public addGameObject(gameObject: GameObject, layer: number): void {
    const layerObjects = this.layers.get(layer) || [];
    layerObjects.push(gameObject);
    this.layers.set(layer, layerObjects);
  }
  
  public removeGameObject(gameObject: GameObject, layer: number): void {
    const layerObjects = this.layers.get(layer) || [];
    const index = layerObjects.indexOf(gameObject);
    if (index > -1) {
      layerObjects.splice(index, 1);
      this.layers.set(layer, layerObjects);
    }
  }
  
  public render(): void {
    // Render all layers in order
    for (let layer = 0; layer <= 7; layer++) {
      const objects = this.layers.get(layer) || [];
      for (const gameObject of objects) {
        if (gameObject.active) {
          this.renderGameObject(gameObject);
        }
      }
    }
  }
  
  private renderGameObject(gameObject: GameObject): void {
    this.ctx.save();
    
    // Set color
    this.ctx.fillStyle = gameObject.color;
    this.ctx.strokeStyle = gameObject.color;
    
    // Move to object position
    this.ctx.translate(gameObject.x, gameObject.y);
    
    // Delegate rendering to the game object
    gameObject.render(this.ctx);
    
    this.ctx.restore();
  }
  
  public clear(): void {
    // Clear all layers
    for (const layer of this.layers.keys()) {
      this.layers.set(layer, []);
    }
  }
  
  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }
  
  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }
  
  public resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}