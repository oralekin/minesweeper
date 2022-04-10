import Field from "./Field";

enum Display {
  CLOSED,
  FLAG,
  QUESTION,

  BOOM,
  MINE,
  OPEN,
}

interface Options {
  questions: boolean;
}

export default class Cell {
  private _display = Display.CLOSED;

  private field: Field;
  private x: number;
  private y: number;
  private value: number = 0;

  public readonly element: HTMLDivElement;
  private readonly options: Options; // TODO: ADD OPTIONS INTERFACE

  private active = true;

  constructor(
    field: Field,
    x: number,
    y: number,
    isBomb: boolean,
    options?: Options
  ) {
    this.field = field;
    this.x = x;
    this.y = y;

    this.value = isBomb ? -1 : 0;

    this.options = options ?? { questions: true };

    this.element = document.createElement("div");
    this.display = Display.CLOSED;

    this.element.addEventListener("mouseup", (e) => {
      if (!this.active) return;
      switch (e.button) {
        case 0:
          this.leftClick();
          break;
        case 2:
          this.rightClick();
          break;

        default:
          break;
      }
    });

    this.element.addEventListener(
      "contextmenu",
      (e) => {
        e.preventDefault();
      },
      false
    );
  }

  public reset(isBomb: boolean) {
    this.value = isBomb ? -1 : 0;
    return;
  }

  public get display() {
    return this._display;
  }

  private set display(state: Display) {
    this.element.className = "cell";
    this.element.textContent = "";
    this._display = state;
    switch (state) {
      case Display.OPEN:
        this.element.classList.add("open");

        switch (this.value) {
          case 0:
            this.element.classList.add("zero");
            break;
          case 1:
            this.element.classList.add("one");
            break;
          case 2:
            this.element.classList.add("two");
            break;
          case 3:
            this.element.classList.add("three");
            break;
          case 4:
            this.element.classList.add("four");
            break;
          case 5:
            this.element.classList.add("five");
            break;
          case 6:
            this.element.classList.add("six");
            break;
          case 7:
            this.element.classList.add("seven");
            break;
          case 8:
            this.element.classList.add("eight");
            break;
          default:
            break;
        }
        this.field.cellOpened();
        this.element.textContent = "" + this.value;
        break;

      case Display.CLOSED:
        this.element.classList.add("closed");
        break;

      case Display.FLAG:
        this.element.classList.add("closed");
        this.element.classList.add("flag");
        break;
      case Display.QUESTION:
        this.element.classList.add("closed");
        this.element.classList.add("question");
        this.element.textContent = "?";
        break;
      case Display.MINE:
        this.element.classList.add("open");
        this.element.classList.add("mine");
        break;
      case Display.BOOM:
        this.element.classList.add("open");
        this.element.classList.add("mine");
        this.element.classList.add("boom");
        break;

      default:
        break;
    }
  }

  get surrounding(): Array<Cell | void> {
    return [
      this.field.get(this.y - 1, this.x + 0), // top middle
      this.field.get(this.y - 1, this.x + 1), // top right
      this.field.get(this.y - 0, this.x + 1), // middle right
      this.field.get(this.y + 1, this.x + 1), // bottom right
      this.field.get(this.y + 1, this.x + 0), // bottom middle
      this.field.get(this.y + 1, this.x - 1), // bottom left
      this.field.get(this.y - 0, this.x - 1), // middle left
      this.field.get(this.y - 1, this.x - 1), // top left
    ];
  }

  private countAdjacentBombs(): number {
    return this.surrounding.reduce<number>(
      (prev, cell) => prev + (cell ? (cell.value < 0 ? 1 : 0) : 0),
      0
    );
  }

  private countAdjacentFlags(): number {
    return this.surrounding.reduce<number>(
      (prev, cell) =>
        prev + (cell ? (cell.display === Display.FLAG ? 1 : 0) : 0),
      0
    );
  }

  public setValue() {
    if (this.value !== -1) this.value = this.countAdjacentBombs();
  }

  public leftClick() {
    switch (this.display) {
      case Display.CLOSED:
        this.open();
        break;
      case Display.FLAG:
        break;
      case Display.OPEN:
        this.openAdjacents();
        break;
      default:
        break;
    }
  }

  public open() {
    if (this.display === Display.CLOSED) {
      if (this.value === -1) {
        this.die();
      } else {
        this.display = Display.OPEN;
        if (this.value === 0 || this.value === this.countAdjacentFlags())
          this.openAdjacents();
      }
    }
  }

  private openAdjacents() {
    if (this.countAdjacentFlags() === this.value) {
      this.surrounding.forEach((neighbour) => {
        if (neighbour) neighbour.open();
      });
    }
  }

  public reveal() {
    // reveal this as a mine at the end (if it was a mine)
    if (this.value < 0 && this.display === Display.CLOSED) {
      this.display = Display.MINE;
    }
  }

  public stopResponding() {
    this.active = false;
  }

  public die(): void {
    this.display = Display.BOOM;
    this.field.die();
    return;
  }

  public rightClick() {
    switch (this.display) {
      case Display.CLOSED:
        this.display = Display.FLAG;
        break;
      case Display.FLAG:
        this.display = this.options.questions
          ? Display.QUESTION
          : Display.CLOSED;
        break;
      case Display.QUESTION:
        this.display = Display.CLOSED;
        break;

      default:
        break;
    }
  }
}
