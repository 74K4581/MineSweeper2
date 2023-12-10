export class Cell {
    row: number = 0;
    col: number = 0;
    isBomb: boolean = false;
    isOpen: boolean = false;
    isFlag: boolean = false;
    bombCount: number = 0;

    constructor(row: number, col: number, isBomb: boolean) {
        this.row = row;
        this.col = col;
        this.isBomb = isBomb;
        this.isOpen = false;
        this.bombCount = 0;
    }
}