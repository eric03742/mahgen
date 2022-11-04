export enum TileState {
    Normal = 1,
    Horizontal,
    Stack,
    Diff,
}

export enum TileSuit {
    Man = 1,
    Pin,
    So,
    Char,
    Space,
}

export class Tile {
    constructor(public readonly num: number, public readonly suit: TileSuit, public readonly state: TileState) { }
}
