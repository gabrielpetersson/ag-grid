// Type definitions for @ag-community/grid-core v22.0.0-beta.0
// Project: http://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { CellPosition } from "../entities/cellPosition";
import { CellComp } from "../rendering/cellComp";
export declare class MouseEventService {
    private gridOptionsWrapper;
    private eGridDiv;
    private static gridInstanceSequence;
    private static GRID_DOM_KEY;
    private gridInstanceId;
    private init;
    private stampDomElementWithGridInstance;
    getRenderedCellForEvent(event: Event): CellComp;
    isEventFromThisGrid(event: MouseEvent | KeyboardEvent): boolean;
    getCellPositionForEvent(event: MouseEvent | KeyboardEvent): CellPosition;
}
