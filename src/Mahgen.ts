import { ParseError, Parser } from "./Parser";
import { Splicer } from "./Splicer";

class OkResult {
    readonly isOk = true;

    constructor(public readonly image: string) { }
}

class ErrResult {
    readonly isOk = false;

    constructor(public readonly error: ParseError, public readonly errorPos: number) { }
}

type RenderResult = OkResult | ErrResult;

export class Mahgen {
    private static readonly parser = new Parser();
    private static readonly splicer = new Splicer();

    static async render(seq: string): Promise<RenderResult> {
        const result = Mahgen.parser.parse(seq);
        if(!result.isOk) {
            return new ErrResult(result.error, result.errorPos);
        }

        const base64 = await Mahgen.splicer.splice(result.tiles);
        if(base64.length <= 0) {
            return new ErrResult(ParseError.Unknown, 0);
        }

        return new OkResult(base64);
    }
}
