import ErrorCode from "./ErrorCode";

class ParseError extends Error {
    constructor(public readonly code: ErrorCode, public readonly index: number) {
        const msg = `Error: ${ErrorCode[code]} at pos '${index}'!`;
        super(msg);
        Object.setPrototypeOf(this, ParseError.prototype);
    }
}

export default ParseError;

