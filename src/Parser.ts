import { Tile, TileState, TileSuit } from "./Tile";

export enum ParseError {
    None,
    InputEmpty,
    InputTooLong,
    InvalidSuit,
    InvalidDigit,
    MissingTile,
    MissingSuit,
    Unknown
}

class OkResult {
    readonly isOk = true;

    constructor(public readonly tiles: ReadonlyArray<Tile>) { }
}

class ErrResult {
    readonly isOk = false;

    constructor(public readonly error: ParseError, public readonly errorPos: number) { }
}

type ParseResult = OkResult | ErrResult;

export class Parser {
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

    parse(seq: string): ParseResult {
        this.idx = 0;
        this.seq = seq.replace(/\s+/g, '') + Parser.restChar;
        if(this.seq.length > Parser.maxLength) {
            return new ErrResult(ParseError.InputTooLong, 0);
        }

        const tiles = new Array<Tile>();
        const error = this.parseSeq(tiles);
        return (error === ParseError.None) ? new OkResult(tiles) : new ErrResult(error, this.idx);
    }

    private parseSeq(tiles: Tile[]): ParseError {
        this.parseSpace(tiles);
        while(!this.eof()) {
            const error = this.parseSet(tiles);
            if(error !== ParseError.None) {
                return error;
            }

            this.parseSpace(tiles);
        }

        return tiles.length > 0 ? ParseError.None : ParseError.InputEmpty;
    }

    private parseSpace(tiles: Tile[]) {
        while(this.token === Parser.spaceChar) {
            const tile = new Tile(0, TileSuit.Space, TileState.Normal);
            tiles.push(tile);
            this.shift();
        }
    }

    private parseSet(tiles: Tile[]): ParseError {
        const list = new Array<[number, TileState]>();
        while(!Parser.postfixChar.has(this.token)) {
            if(this.eof()) {
                return ParseError.MissingSuit;
            }

            let state = TileState.Normal;
            if(Parser.prefixChar.has(this.token)) {
                state = Parser.prefixChar.get(this.token)!;
                this.shift();
            }

            const num = parseInt(this.token);
            if(isNaN(num)) {
                return ParseError.InvalidDigit;
            }

            list.push([num, state]);
            this.shift();
        }

        if(list.length <= 0) {
            return ParseError.MissingTile;
        }

        const suit = Parser.postfixChar.get(this.token)!;
        this.shift();

        for(const t of list) {
            const tile = new Tile(t[0], suit, t[1]);
            tiles.push(tile);
        }

        return ParseError.None;
    }
}
