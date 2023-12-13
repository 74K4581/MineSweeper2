import {createAction, props} from "@ngrx/store";

export const open = createAction('Open', props<{rowIndex: number, columnIndex: number}>());
export const setFlag = createAction('SetFlag', props<{rowIndex: number, columnIndex: number}>());
export const reset = createAction('Reset', props<{rowCount: number, colCount: number}>());