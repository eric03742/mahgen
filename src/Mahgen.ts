import ErrorCode from "./ErrorCode";
import ParseError from "./ParseError";
import Parser from "./Parser";
import Splicer from "./Splicer";

class Mahgen {
    private static readonly parser = new Parser();
    private static readonly splicer = new Splicer();

    private constructor() { }

    static async render(seq: string): Promise<string> {
        const tiles = Mahgen.parser.parse(seq);
        const base64 = await Mahgen.splicer.splice(tiles);
        if(base64.length <= 0) {
            throw new ParseError(ErrorCode.Unknown, 0);
        }

        return base64;
    }
}

export default Mahgen;