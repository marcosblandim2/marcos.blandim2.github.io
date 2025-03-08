export default class SquareClass {
  isBomb = false;
  isRevealed = false;
  isFlagged = false;
  neighbourBombsNumber = 0;
  x: number;
  y: number;
  id: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.id = `${this.x}-${this.y}`;
  }
}
