import seedrandom from "seedrandom";
import Cell from "./Cell";
import Naive from "./randomizers/Naive";
console.log(seedrandom.alea)
export default class Field {
    private width: number;
    private height: number;
    private mines: number;

    private fieldDiv: HTMLDivElement;

    // row-indexed (y, x), (h, w)
    private cells: Cell[][];
    private _openCount: number = 0;

    constructor(width: number, height: number, mines: number, fieldDiv: HTMLDivElement) {

        this.fieldDiv = fieldDiv;

        this.width = width;
        this.height = height;
        this.mines = mines;

        if (this.width < 1 || this.height < 1) throw new Error("we fucked up");

        this.cells = Array.from(Array(this.height)).map(() => Array(this.width).fill(undefined));

        this.setUpGame();
    }

    private setUpGame(): void {

      this.fieldDiv.classList.add("field");
      this.fieldDiv.style.gridTemplateRows = `repeat(${this.height}, 36px)`;
      this.fieldDiv.style.gridTemplateColumns = `repeat(${this.width }, 36px)`

      const minelayer = new Naive("my seed", seedrandom.alea)
      const mines = minelayer.generateBoard(this.height, this.width, this.mines);

      for (let y = 0; y < this.cells.length; y++) {
        const row = this.cells[y];
        for (let x = 0; x < row.length; x++) {
          const cell = row[x] = new Cell(this, x, y, mines[y][x]);
          this.fieldDiv.appendChild(cell.element);
        }
      }

      // update values inside cells
      this.cells.map(row => row.map(cell => cell.setValue()))
    }

    public get(y: number, x: number): Cell | void {
      if (
        x >= this.width || 
        x < 0 ||
        y >= this.height ||
        y < 0
        ) return;

      return this.cells[y][x];
    }

    public get openCount() { return this._openCount; }

    public cellOpened() {
      this._openCount++;
      if (this.width * this.height - this.mines  === this.openCount) alert("game over!");
    }

    private openAll() {
      this.cells.map(row => row.map(cell => cell.open()))
    }

    die() {
      console.log()
    }

}