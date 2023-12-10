import { Component, OnInit } from '@angular/core';
import { Cell } from '../model/cell'
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-board',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

    readonly RowCount: number = 10;
    readonly ColCount: number = 10;
    cells: Cell[][] = new Array();
    isGameOver: boolean = false;

    constructor() {

        for (let i = 0; i < this.RowCount; ++i) {
            this.cells[i] = new Array();
            for (let k = 0; k < this.ColCount; ++k) {
                this.cells[i][k] = new Cell(i, k, false);
            }
        }

        for (let i = 0; i < this.RowCount; ++i) {
            for (let k = 0; k < this.ColCount; ++k) {

                if (Math.random() > 0.9) {
                    this.addBomb(i, k);
                }
            }
        }
    }

    ngOnInit(): void {
    }

    private addBomb(row: number, col: number) {
        this.cells[row][col].isBomb = true;

        if (0 < row) {
            // 左上
            if (0 < col) this.cells[row - 1][col - 1].bombCount++;
            // 左
            this.cells[row - 1][col].bombCount++;
            // 左下
            if (col < this.ColCount - 1) this.cells[row - 1][col + 1].bombCount++;
        }

        // 上
        if (0 < col) this.cells[row][col - 1].bombCount++;
        // 下
        if (col < this.ColCount - 1) this.cells[row][col + 1].bombCount++;

        if (row < this.RowCount - 1) {
            // 右上
            if (0 < col) this.cells[row + 1][col - 1].bombCount++;
            // 右
            this.cells[row + 1][col].bombCount++;
            // 右下
            if (col < this.ColCount - 1) this.cells[row + 1][col + 1].bombCount++;
        }
    }

    onAlert() {
        alert("!");
    }

    openCell(cell: Cell) {
        this.openZeroCell(cell.row, cell.col);
        cell.isOpen = true;

        if (cell.isBomb) {
            this.gameOver();
        }
    }

    flagCell(cell: Cell): boolean {
        if (!cell.isOpen) {
            cell.isFlag = !cell.isFlag;
        }
        return false;
    }

    openZeroCell(row: number, col: number) {
        if (this.isOut(row, col)) {
            return;
        }

        let cell = this.cells[row][col];
        if (cell.isOpen) {
            return;
        }

        if (cell.bombCount != 0) {
            cell.isOpen = true;
            return;
        }

        cell.isOpen = true;

        this.openZeroCell(row, col + 1);
        this.openZeroCell(row, col - 1);
        this.openZeroCell(row + 1, col);
        this.openZeroCell(row - 1, col);

        this.openZeroCell(row - 1, col - 1);
        this.openZeroCell(row - 1, col + 1);
        this.openZeroCell(row + 1, col - 1);
        this.openZeroCell(row + 1, col + 1);

    }

    public gameOver() {
        this.isGameOver = true;

        for (let r of this.cells) {
            for (let c of r.filter(c => c.isBomb)) {
                c.isOpen = true;
            }
        }

    }

    private isOut(row: number, col: number) : boolean {
        return row < 0 || this.RowCount <= row
            || col < 0 || this.ColCount <= col;
    }
    
}
