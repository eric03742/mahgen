import { ErrorCode, Parser } from "./Parser";
import { Splicer } from "./Splicer";

export { ErrorCode };

export class Ok {
    readonly isOk = true;

    constructor(public readonly image: string) { }
}

export class Err {
    readonly isOk = false;

    constructor(public readonly error: ErrorCode, public readonly errorPos: number) { }
}

export type Result = Ok | Err;

const parser = new Parser();
const splicer = new Splicer();

export async function render(seq: string): Promise<Result> {
    const result = parser.parse(seq);
    if(!result.isOk) {
        return new Err(result.error, result.errorPos);
    }

    const base64 = await splicer.splice(result.tiles);
    if(base64.length <= 0) {
        return new Err(ErrorCode.Unknown, 0);
    }

    return new Ok(base64);
}
