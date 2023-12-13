import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import * as selector from './board.selector';
import * as action from './board.action';

@Component({
    selector: 'app-board',
    standalone: true,
    imports: [CommonModule, RouterOutlet, StoreModule],
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})
export class BoardComponent {

    rowCount: number = 0;
    colCount: number = 0;
    isGameOver$ = this.store.select(selector.isEnd);


    constructor(private readonly store: Store) {
        this.store.dispatch(action.reset({rowCount: 10, colCount: 10}));
        this.store.select(selector.rowCount()).subscribe(x => {
            this.rowCount = x;
        });
        this.store.select(selector.columnCount()).subscribe(x => this.colCount = x);
    }

    reset() {
        const row: number = Math.floor(Math.random() * 20) + 5;
        const col: number = Math.floor(Math.random() * 20) + 5;
        this.store.dispatch(action.reset({rowCount: row, colCount: col}));
    }

    isOpenCell(row: number, col: number) {
        return this.store.select(selector.isOpen(row, col));
    }

    isFlagCell(row: number, col: number) {
        return this.store.select(selector.isFlag(row, col));
    }

    isBombCell(row: number, col: number) {
        return this.store.select(selector.isBomb(row, col));
    }
    getBombCount(row: number, col: number) {
        return this.store.select(selector.getBombCount(row, col));
    }

    arrayNumberLength(number: number): any[] {
        return [...Array(number)];
    }

    openCell(row:number, col:number) {
        return this.store.dispatch(action.open({rowIndex: row, columnIndex: col}));
    }
    flagCell(row:number, col:number) {
        this.store.dispatch(action.setFlag({rowIndex: row, columnIndex: col}))
        return false;
    }    
}
