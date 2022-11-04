import res from './res.json';

import Jimp from 'jimp/browser/lib/jimp';
import { Tile, TileState, TileSuit } from "./Tile";

export class Splicer {
    private static readonly imageDict = new Map<string, string>();

    private static readonly stateChar = new Map<TileState, string>([
        [ TileState.Normal, '' ],
        [ TileState.Horizontal, '_' ],
        [ TileState.Stack, '=' ],
        [ TileState.Diff, 'v' ],
    ]);

    private static readonly suitChar = new Map<TileSuit, string>([
        [ TileSuit.Man, 'm' ],
        [ TileSuit.Pin, 'p' ],
        [ TileSuit.So, 's' ],
        [ TileSuit.Char, 'z' ],
    ]);

    private static readonly spaceName = 'space';

    static loadRes() {
        Splicer.imageDict.clear();
        for(const kv of res) {
            Splicer.imageDict.set(kv.k, kv.v);
        }
    }

    public async splice(tiles: ReadonlyArray<Tile>) {
        try {
            let width = 0;
            let height = 0;
            let pos = 0;

            const images = [];
            for(const tile of tiles) {
                const buffer = this.getImage(tile);
                const image = await Jimp.read(buffer);
                images.push(image);
            }

            for(const image of images) {
                width += image.getWidth();
                height = Math.max(height, image.getHeight());
            }

            const result = await Jimp.create(width, height, 0x00000000);
            for(const image of images) {
                result.blit(image, pos, height - image.getHeight());
                pos += image.getWidth();
            }

            return await result.getBase64Async(Jimp.MIME_PNG);
        } catch(e) {
            console.error(e);
        }

        return '';
    }

    private getImage(tile: Tile) {
        if(tile.suit === TileSuit.Space) {
            return Buffer.from(Splicer.imageDict.get(Splicer.spaceName)!, 'base64');
        }

        let prefix = Splicer.stateChar.get(tile.state)!;
        const postfix = Splicer.suitChar.get(tile.suit)!;
        let key = prefix + tile.num.toString() + postfix;
        if(!Splicer.imageDict.has(key)) {
            prefix = Splicer.stateChar.get(TileState.Stack)!;
            key = prefix + tile.num.toString() + postfix;
        }

        return Buffer.from(Splicer.imageDict.get(key)!, 'base64');
    }
}

Splicer.loadRes();
