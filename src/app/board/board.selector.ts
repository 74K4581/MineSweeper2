import { createFeatureSelector, createSelector } from "@ngrx/store";
import { BoardSize, Cell, FeatureName } from "./board.reducer";

export const state = createFeatureSelector<{isEnd: boolean, cells:Cell[][], boardSize:BoardSize}>(FeatureName);

export const selectAllCells = () => createSelector(
    state,
    cells => cells
);

export const rowCount = () => createSelector(
    state,
    (state) => state.boardSize.rowCount,
)
export const columnCount = () => createSelector(
    state,
    (state) => state.boardSize.colCount,
)

export const isEnd = () => createSelector(
    state,
    (state) => state.isEnd != true,
)

export const isOpen = (row: number, col: number) => createSelector(
    state,
    (state) => {
        if (!state.cells?.[row]?.[col]) {
            return false;
        }
        return state.cells[row][col].isOpen;
    }
);

export const isFlag = (row: number, col: number) => createSelector(
    state,
    (state) => {
        if (!state.cells?.[row]?.[col]) {
            return false;
        }
        return state.cells[row][col].isFlag;
    }
);

export const isBomb = (row: number, col: number) => createSelector(
    state,
    (state) => {
        if (!state.cells?.[row]?.[col]) {
            return false;
        }
        return state.cells[row][col].isBomb;
    }
);

export const getBombCount = (row: number, col: number) => createSelector(
    state,
    (state) => {
        if (!state.cells?.[row]?.[col]) {
            return 0;
        }
        return state.cells[row][col].bombCount;
    }
);