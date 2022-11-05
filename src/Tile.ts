import TileState from "./TileState";
import TileSuit from "./TileSuit";

class Tile {
    constructor(public readonly num: number, public readonly suit: TileSuit, public readonly state: TileState) { }
}

export default Tile;
