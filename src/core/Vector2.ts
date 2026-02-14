export class Vector2 {
  public x: number;
  public y: number;
  
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
  
  public static zero(): Vector2 {
    return new Vector2(0, 0);
  }
  
  public static one(): Vector2 {
    return new Vector2(1, 1);
  }
  
  public static up(): Vector2 {
    return new Vector2(0, -1);
  }
  
  public static down(): Vector2 {
    return new Vector2(0, 1);
  }
  
  public static left(): Vector2 {
    return new Vector2(-1, 0);
  }
  
  public static right(): Vector2 {
    return new Vector2(1, 0);
  }
  
  public add(vector: Vector2): Vector2 {
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }
  
  public subtract(vector: Vector2): Vector2 {
    return new Vector2(this.x - vector.x, this.y - vector.y);
  }
  
  public multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }
  
  public divide(scalar: number): Vector2 {
    if (scalar === 0) {
      throw new Error('Cannot divide by zero');
    }
    return new Vector2(this.x / scalar, this.y / scalar);
  }
  
  public magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  
  public magnitudeSquared(): number {
    return this.x * this.x + this.y * this.y;
  }
  
  public normalize(): Vector2 {
    const mag = this.magnitude();
    if (mag === 0) {
      return Vector2.zero();
    }
    return this.divide(mag);
  }
  
  public dot(vector: Vector2): number {
    return this.x * vector.x + this.y * vector.y;
  }
  
  public distanceSquared(vector: Vector2): number {
    const dx = this.x - vector.x;
    const dy = this.y - vector.y;
    return dx * dx + dy * dy;
  }
  
  public distance(vector: Vector2): number {
    return Math.sqrt(this.distanceSquared(vector));
  }
  
  public clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }
  
  public equals(vector: Vector2): boolean {
    return this.x === vector.x && this.y === vector.y;
  }
  
  public toString(): string {
    return `Vector2(${this.x}, ${this.y})`;
  }
}