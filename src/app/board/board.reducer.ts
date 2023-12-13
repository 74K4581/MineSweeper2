import {createReducer, on} from "@ngrx/store";
import * as action from './board.action';

export const FeatureName = 'board';

export class BoardSize {
    rowCount: number = 10;
    colCount: number = 10;
    constructor(rowCount: number, colCount: number) {
        this.rowCount = rowCount;
        this.colCount = colCount;
    }
}

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

const addBomb = (cells: Cell[][], rowIndex: number, colIndex: number, rowCount: number, colCount: number) => {
    cells[rowIndex][colIndex].isBomb = true;

    if (0 < rowIndex) {
        // 左上
        if (0 < colIndex) {
            cells[rowIndex - 1][colIndex - 1].bombCount++;
        }
        // 左
        cells[rowIndex - 1][colIndex].bombCount++;
        // 左下
        if (colIndex < colCount - 1) {
            cells[rowIndex - 1][colIndex + 1].bombCount++;
        }
    }

    // 上
    if (0 < colIndex) {
        cells[rowIndex][colIndex - 1].bombCount++;
    }
    
    // 下
    if (colIndex < colCount - 1) {
        cells[rowIndex][colIndex + 1].bombCount++;
    }

    if (rowIndex < rowCount - 1) {
        // 右上
        if (0 < colIndex) {
            cells[rowIndex + 1][colIndex - 1].bombCount++;
        }
        // 右
        cells[rowIndex + 1][colIndex].bombCount++;
        // 右下
        if (colIndex < colCount - 1) {
            cells[rowIndex + 1][colIndex + 1].bombCount++;
        }
    }
    return cells;
}

const initializeCells = (rowCount: number, colCount: number):Cell[][] => {
    let cells: Cell[][] = new Array();
    for (let i = 0; i < rowCount; ++i) {
        cells[i] = new Array();
        for (let k = 0; k < colCount; ++k) {
            cells[i][k] = new Cell(i, k, false);
        }
    }

    for (let i = 0; i < rowCount; ++i) {
        for (let k = 0; k < colCount; ++k) {

            if (Math.random() > 0.8) {
                addBomb(cells, i, k, rowCount, colCount);
            }
        }
    }
    return cells;
}

const isOut = (rowIndex: number, colIndex: number, rowCount: number, colCount: number): boolean => {
    return rowIndex < 0 || rowCount <= rowIndex
        || colIndex < 0 || colCount <= colIndex;
}

const openZeroCell = (cells: Cell[][], rowIndex: number, colIndex: number, rowCount: number, colCount: number): Cell[][] => {
    if (isOut(rowIndex, colIndex, rowCount, colCount)) {
        return cells;
    }

    let cell = cells[rowIndex][colIndex];
    if (cell.isOpen) {
        return cells;
    }

    if (cell.bombCount != 0) {
        cell.isOpen = true;
        return cells;
    }

    cell.isOpen = true;

    cells = openZeroCell(cells, rowIndex, colIndex + 1, rowCount, colCount);
    cells = openZeroCell(cells, rowIndex, colIndex - 1, rowCount, colCount);
    cells = openZeroCell(cells, rowIndex + 1, colIndex, rowCount, colCount);
    cells = openZeroCell(cells, rowIndex - 1, colIndex, rowCount, colCount);
    cells = openZeroCell(cells, rowIndex - 1, colIndex - 1, rowCount, colCount);
    cells = openZeroCell(cells, rowIndex - 1, colIndex + 1, rowCount, colCount);
    cells = openZeroCell(cells, rowIndex + 1, colIndex - 1, rowCount, colCount);
    cells = openZeroCell(cells, rowIndex + 1, colIndex + 1, rowCount, colCount);
    return cells;
}

const cloneCells = (src: Cell[][]): Cell[][] => {        
    return src.map(srcRow => {
        return srcRow.map(srcCell => {
            let newCell = new Cell(srcCell.row, srcCell.col, srcCell.isBomb);
            newCell.bombCount = srcCell.bombCount;
            newCell.isFlag = srcCell.isFlag;
            newCell.isOpen = srcCell.isOpen;
            return newCell;
        });
    });
}

export let initial = {
    isEnd: false,
    cells: initializeCells(10, 10),
    boardSize: new BoardSize(10, 10)
 }

export const boardReducer = createReducer(
    initial,
    
    // セルを開ける
    on(action.open, (data, {rowIndex, columnIndex}) => {
        if (data.isEnd) {
            return data;
        }

        let newCells = cloneCells(data.cells);
        let isEnd = false;
        if (newCells[rowIndex][columnIndex].isBomb) {
            isEnd = true;

            // 爆弾を開けたら、全爆弾を開示する
            for (let row of newCells) {
                for (let cell of row) {
                    if (cell.isBomb) {
                        cell.isOpen = true;
                    }
                }
            }
        } else {
            // 指定セルを開く
            // 空白の場合、隣り合う空白セルを連鎖して開く
            newCells = openZeroCell(newCells, rowIndex, columnIndex, data.boardSize.rowCount, data.boardSize.colCount);
        }
        return {cells: newCells, boardSize: data.boardSize, isEnd: isEnd};
    }),

    // セルに旗を立てる
    on(action.setFlag, (data, {rowIndex, columnIndex}) => {
        let newCells = cloneCells(data.cells);
        newCells[rowIndex][columnIndex].isFlag = !newCells[rowIndex][columnIndex].isFlag;
        return {cells: newCells, boardSize: data.boardSize, isEnd: data.isEnd};
    }),

    // 盤面リセット
    on(action.reset, (data, {rowCount, colCount})=> {
        return {
            cells: initializeCells(rowCount, colCount),
            boardSize: new BoardSize(rowCount, colCount),
            isEnd: false,
         };
    }),

);