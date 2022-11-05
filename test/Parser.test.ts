import { Parser, ErrorCode } from "../src/Parser";
import { Tile, TileState, TileSuit } from "../src/Tile";

import { describe, expect, test } from "vitest";

function testPass(seq: string, tiles: Tile[]) {
    const parser = new Parser();
    const result = parser.parse(seq);

    test(seq, () => {
        expect(result.isOk).toBeTruthy();
        if(result.isOk) {
            expect(result.tiles).toEqual(tiles);
        }
    });
}

function testFail(seq: string, error: ErrorCode, errPos: number) {
    const parser = new Parser();
    const result = parser.parse(seq);

    test(seq, () => {
        expect(result.isOk).toBeFalsy();
        if(!result.isOk) {
            expect(result.error).toBe(error);
            expect(result.errorPos).toBe(errPos);
        }
    });
}

describe('Basic', () => {
    testPass('1m', [
        new Tile(1, TileSuit.Man, TileState.Normal),
    ]);
    testPass("1m2m3m", [
        new Tile(1, TileSuit.Man, TileState.Normal),
        new Tile(2, TileSuit.Man, TileState.Normal),
        new Tile(3, TileSuit.Man, TileState.Normal),
    ]);
    testPass("456m", [
        new Tile(4, TileSuit.Man, TileState.Normal),
        new Tile(5, TileSuit.Man, TileState.Normal),
        new Tile(6, TileSuit.Man, TileState.Normal),
    ]);
    testPass("78m9m", [
        new Tile(7, TileSuit.Man, TileState.Normal),
        new Tile(8, TileSuit.Man, TileState.Normal),
        new Tile(9, TileSuit.Man, TileState.Normal),
    ]);
    testPass("456s", [
        new Tile(4, TileSuit.So, TileState.Normal),
        new Tile(5, TileSuit.So, TileState.Normal),
        new Tile(6, TileSuit.So, TileState.Normal),
    ]);
    testPass("789p", [
        new Tile(7, TileSuit.Pin, TileState.Normal),
        new Tile(8, TileSuit.Pin, TileState.Normal),
        new Tile(9, TileSuit.Pin, TileState.Normal),
    ]);
    testPass("1z23z456z7z", [
        new Tile(1, TileSuit.Char, TileState.Normal),
        new Tile(2, TileSuit.Char, TileState.Normal),
        new Tile(3, TileSuit.Char, TileState.Normal),
        new Tile(4, TileSuit.Char, TileState.Normal),
        new Tile(5, TileSuit.Char, TileState.Normal),
        new Tile(6, TileSuit.Char, TileState.Normal),
        new Tile(7, TileSuit.Char, TileState.Normal),
    ]);
});

describe('Space', () => {
    testPass('123m|456s', [
        new Tile(1, TileSuit.Man, TileState.Normal),
        new Tile(2, TileSuit.Man, TileState.Normal),
        new Tile(3, TileSuit.Man, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(4, TileSuit.So, TileState.Normal),
        new Tile(5, TileSuit.So, TileState.Normal),
        new Tile(6, TileSuit.So, TileState.Normal),
    ]);
    testPass('123m|456s|789p', [
        new Tile(1, TileSuit.Man, TileState.Normal),
        new Tile(2, TileSuit.Man, TileState.Normal),
        new Tile(3, TileSuit.Man, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(4, TileSuit.So, TileState.Normal),
        new Tile(5, TileSuit.So, TileState.Normal),
        new Tile(6, TileSuit.So, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(7, TileSuit.Pin, TileState.Normal),
        new Tile(8, TileSuit.Pin, TileState.Normal),
        new Tile(9, TileSuit.Pin, TileState.Normal),
    ]);
    testPass('123m|456s|789p|1234z|5z6z7z', [
        new Tile(1, TileSuit.Man, TileState.Normal),
        new Tile(2, TileSuit.Man, TileState.Normal),
        new Tile(3, TileSuit.Man, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(4, TileSuit.So, TileState.Normal),
        new Tile(5, TileSuit.So, TileState.Normal),
        new Tile(6, TileSuit.So, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(7, TileSuit.Pin, TileState.Normal),
        new Tile(8, TileSuit.Pin, TileState.Normal),
        new Tile(9, TileSuit.Pin, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(1, TileSuit.Char, TileState.Normal),
        new Tile(2, TileSuit.Char, TileState.Normal),
        new Tile(3, TileSuit.Char, TileState.Normal),
        new Tile(4, TileSuit.Char, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(5, TileSuit.Char, TileState.Normal),
        new Tile(6, TileSuit.Char, TileState.Normal),
        new Tile(7, TileSuit.Char, TileState.Normal),
    ]);
    testPass('123m||456s', [
        new Tile(1, TileSuit.Man, TileState.Normal),
        new Tile(2, TileSuit.Man, TileState.Normal),
        new Tile(3, TileSuit.Man, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(4, TileSuit.So, TileState.Normal),
        new Tile(5, TileSuit.So, TileState.Normal),
        new Tile(6, TileSuit.So, TileState.Normal),
    ]);
    testPass('123m|||456s||||789p', [
        new Tile(1, TileSuit.Man, TileState.Normal),
        new Tile(2, TileSuit.Man, TileState.Normal),
        new Tile(3, TileSuit.Man, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(4, TileSuit.So, TileState.Normal),
        new Tile(5, TileSuit.So, TileState.Normal),
        new Tile(6, TileSuit.So, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(7, TileSuit.Pin, TileState.Normal),
        new Tile(8, TileSuit.Pin, TileState.Normal),
        new Tile(9, TileSuit.Pin, TileState.Normal),
    ]);
    testPass('|123m', [
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(1, TileSuit.Man, TileState.Normal),
        new Tile(2, TileSuit.Man, TileState.Normal),
        new Tile(3, TileSuit.Man, TileState.Normal),
    ]);
    testPass('123m||', [
        new Tile(1, TileSuit.Man, TileState.Normal),
        new Tile(2, TileSuit.Man, TileState.Normal),
        new Tile(3, TileSuit.Man, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
    ]);
    testPass('||123m||', [
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(1, TileSuit.Man, TileState.Normal),
        new Tile(2, TileSuit.Man, TileState.Normal),
        new Tile(3, TileSuit.Man, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
    ]);
});

describe('Red', () => {
    testPass('0m', [
        new Tile(0, TileSuit.Man, TileState.Normal),
    ]);

    testPass('0m|0s|0p|0z|89z', [
        new Tile(0, TileSuit.Man, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(0, TileSuit.So, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(0, TileSuit.Pin, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(0, TileSuit.Char, TileState.Normal),
        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(8, TileSuit.Char, TileState.Normal),
        new Tile(9, TileSuit.Char, TileState.Normal),
    ]);
});

describe('State', () => {
    testPass('_123m', [
        new Tile(1, TileSuit.Man, TileState.Horizontal),
        new Tile(2, TileSuit.Man, TileState.Normal),
        new Tile(3, TileSuit.Man, TileState.Normal),
    ]);
    testPass('_1_2_3m', [
        new Tile(1, TileSuit.Man, TileState.Horizontal),
        new Tile(2, TileSuit.Man, TileState.Horizontal),
        new Tile(3, TileSuit.Man, TileState.Horizontal),
    ]);
    testPass('_1m_2m_3p', [
        new Tile(1, TileSuit.Man, TileState.Horizontal),
        new Tile(2, TileSuit.Man, TileState.Horizontal),
        new Tile(3, TileSuit.Pin, TileState.Horizontal),
    ]);
    testPass('12_3m', [
        new Tile(1, TileSuit.Man, TileState.Normal),
        new Tile(2, TileSuit.Man, TileState.Normal),
        new Tile(3, TileSuit.Man, TileState.Horizontal),
    ]);
    testPass('1_23m', [
        new Tile(1, TileSuit.Man, TileState.Normal),
        new Tile(2, TileSuit.Man, TileState.Horizontal),
        new Tile(3, TileSuit.Man, TileState.Normal),
    ]);
    testPass('^456s', [
        new Tile(4, TileSuit.So, TileState.Stack),
        new Tile(5, TileSuit.So, TileState.Normal),
        new Tile(6, TileSuit.So, TileState.Normal),
    ]);
    testPass('4^56s', [
        new Tile(4, TileSuit.So, TileState.Normal),
        new Tile(5, TileSuit.So, TileState.Stack),
        new Tile(6, TileSuit.So, TileState.Normal),
    ]);
    testPass('v055s', [
        new Tile(0, TileSuit.So, TileState.Diff),
        new Tile(5, TileSuit.So, TileState.Normal),
        new Tile(5, TileSuit.So, TileState.Normal),
    ]);
    testPass('5v55s', [
        new Tile(5, TileSuit.So, TileState.Normal),
        new Tile(5, TileSuit.So, TileState.Diff),
        new Tile(5, TileSuit.So, TileState.Normal),
    ]);
    testPass('v7_89p', [
        new Tile(7, TileSuit.Pin, TileState.Diff),
        new Tile(8, TileSuit.Pin, TileState.Horizontal),
        new Tile(9, TileSuit.Pin, TileState.Normal),
    ]);
    testPass('v7_8^9p', [
        new Tile(7, TileSuit.Pin, TileState.Diff),
        new Tile(8, TileSuit.Pin, TileState.Horizontal),
        new Tile(9, TileSuit.Pin, TileState.Stack),
    ]);
    testPass('1m|_111p|5v05s|0z11s0z|55^5m', [
        new Tile(1, TileSuit.Man, TileState.Normal),

        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(1, TileSuit.Pin, TileState.Horizontal),
        new Tile(1, TileSuit.Pin, TileState.Normal),
        new Tile(1, TileSuit.Pin, TileState.Normal),

        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(5, TileSuit.So, TileState.Normal),
        new Tile(0, TileSuit.So, TileState.Diff),
        new Tile(5, TileSuit.So, TileState.Normal),

        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(0, TileSuit.Char, TileState.Normal),
        new Tile(1, TileSuit.So, TileState.Normal),
        new Tile(1, TileSuit.So, TileState.Normal),
        new Tile(0, TileSuit.Char, TileState.Normal),

        new Tile(0, TileSuit.Space, TileState.Normal),
        new Tile(5, TileSuit.Man, TileState.Normal),
        new Tile(5, TileSuit.Man, TileState.Normal),
        new Tile(5, TileSuit.Man, TileState.Stack),
    ]);
});

describe('Error', () => {
    testFail('', ErrorCode.InputEmpty, 0);
    testFail('   ', ErrorCode.InputEmpty, 0);
    testFail('  \t  ', ErrorCode.InputEmpty, 0);

    testFail('123', ErrorCode.MissingSuit, 3);
    testFail('12m3', ErrorCode.MissingSuit, 4);

    testFail('12m3|456p', ErrorCode.InvalidDigit, 4);
    testFail('12m3x', ErrorCode.InvalidDigit, 4);
    testFail('12m^|456p', ErrorCode.InvalidDigit, 4);
    testFail('12m^', ErrorCode.InvalidDigit, 4);
    testFail('12m^x', ErrorCode.InvalidDigit, 4);
    testFail('12m^^', ErrorCode.InvalidDigit, 4);
    testFail('12m^_', ErrorCode.InvalidDigit, 4);
    testFail('12m^_456s', ErrorCode.InvalidDigit, 4);
    testFail('12x3m', ErrorCode.InvalidDigit, 2);

    testFail('12m|m', ErrorCode.MissingTile, 4);
    testFail('12mm', ErrorCode.MissingTile, 3);
    testFail('123mp', ErrorCode.MissingTile, 4);
    testFail('123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m123m', ErrorCode.InputTooLong, 0);
});
