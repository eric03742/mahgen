import ErrorCode from "./ErrorCode";
import Tile from "./Tile";
import TileState from "./TileState";
import TileSuit from "./TileSuit";
import ParseError from "./ParseError";


class Parser {
    private idx = 0;
    private seq = '';

    private static readonly restChar = '\0';
    private static readonly spaceChar = '|';
    private static readonly maxLength = 200;

    private static readonly prefixChar = new Map<string, TileState>([
        [ '_', TileState.Horizontal ],
        [ '^', TileState.Stack ],
        [ 'v', TileState.Diff ],
    ]);

    private static readonly postfixChar = new Map<string, TileSuit>([
        [ 'm', TileSuit.Man ],
        [ 'p', TileSuit.Pin ],
        [ 's', TileSuit.So ],
        [ 'z', TileSuit.Char ],
    ]);

    constructor() { }

    private get token() {
        return this.seq.charAt(this.idx);
    }

    private shift() {
        ++this.idx;
    }

    private eof() {
        return this.token === Parser.restChar;
    }

    parse(seq: string, river: boolean): Tile[] {
        this.idx = 0;
        this.seq = seq.replace(/\s+/g, '') + Parser.restChar;
        if(this.seq.length > Parser.maxLength) {
            throw new ParseError(ErrorCode.InputTooLong, 0);
        }

        const tiles = new Array<Tile>();
        const error = river ?
            this.parseRiver(tiles) :
            this.parseSeq(tiles);
        if(error !== ErrorCode.None) {
            throw new ParseError(error, this.idx);
        }

        return tiles;
    }

    private parseSeq(tiles: Tile[]): ErrorCode {
        this.parseSpace(tiles);
        while(!this.eof()) {
            const error = this.parseSet(tiles);
            if(error !== ErrorCode.None) {
                return error;
            }

            this.parseSpace(tiles);
        }

        return tiles.length > 0 ? ErrorCode.None : ErrorCode.InputEmpty;
    }

    private parseRiver(tiles: Tile[]): ErrorCode {
        while(!this.eof()) {
            const error = this.parseSet(tiles);
            if(error !== ErrorCode.None) {
                return error;
            }
        }

        let reach = 0;
        for(const t of tiles) {
            if(t.state === TileState.Horizontal || t.state === TileState.Diff) {
                reach += 1;
            }
        }

        if(reach > 1) {
            return ErrorCode.TooManyReach;
        }

        return tiles.length > 0 ? ErrorCode.None : ErrorCode.InputEmpty;
    }

    private parseSpace(tiles: Tile[]) {
        while(this.token === Parser.spaceChar) {
            const tile = new Tile(0, TileSuit.Space, TileState.Normal);
            tiles.push(tile);
            this.shift();
        }
    }

    private parseSet(tiles: Tile[]): ErrorCode {
        const list = new Array<[number, TileState]>();
        while(!Parser.postfixChar.has(this.token)) {
            if(this.eof()) {
                return ErrorCode.MissingSuit;
            }

            let state = TileState.Normal;
            if(Parser.prefixChar.has(this.token)) {
                state = Parser.prefixChar.get(this.token)!;
                this.shift();
            }

            const num = parseInt(this.token);
            if(isNaN(num)) {
                return ErrorCode.InvalidDigit;
            }

            list.push([num, state]);
            this.shift();
        }

        if(list.length <= 0) {
            return ErrorCode.MissingTile;
        }

        const suit = Parser.postfixChar.get(this.token)!;
        this.shift();

        for(const t of list) {
            const tile = new Tile(t[0], suit, t[1]);
            tiles.push(tile);
        }

        return ErrorCode.None;
    }
}

export default Parser;
