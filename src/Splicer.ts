import Tile from "./Tile";
import TileState from "./TileState";
import TileSuit from "./TileSuit";
import res from './res.json';

import JimpWorker from './JimpWorker?worker&inline';

class Splicer {
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

    public async splice(tiles: ReadonlyArray<Tile>, river: boolean) {
        const images = new Array<string>();
        const cutters = new Array<boolean>();
        for(const tile of tiles) {
            const image = this.getImage(tile, river);
            images.push(image);
            cutters.push(river && (tile.state === TileState.Stack || tile.state === TileState.Diff));
        }

        return new Promise<string>((resolve, reject) => {
            const worker = new JimpWorker();
            worker.onerror = (err: any) => {
                reject(err);
            }
            worker.onmessage = (msg: MessageEvent<string>) => {
                resolve(msg.data);
            }

            worker.postMessage({
                images: images,
                cutters: cutters,
                river: river,
            });
        });
    }

    private getImage(tile: Tile, river: boolean) {
        if(tile.suit === TileSuit.Space) {
            return Splicer.imageDict.get(Splicer.spaceName)!;
        }

        let prefix = Splicer.stateChar.get(tile.state)!;
        if(river) {
            if(tile.state === TileState.Stack) {
                prefix = Splicer.stateChar.get(TileState.Normal)!;
            } else if(tile.state === TileState.Diff) {
                prefix = Splicer.stateChar.get(TileState.Horizontal)!;
            }
        }
        const postfix = Splicer.suitChar.get(tile.suit)!;
        let key = prefix + tile.num.toString() + postfix;
        if(!Splicer.imageDict.has(key)) {
            prefix = Splicer.stateChar.get(TileState.Stack)!;
            key = prefix + tile.num.toString() + postfix;
        }

        return Splicer.imageDict.get(key)!;
    }
}

Splicer.loadRes();

export default Splicer;
