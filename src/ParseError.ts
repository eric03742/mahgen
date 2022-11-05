import ErrorCode from "./ErrorCode";

class ParseError extends Error {
    constructor(public readonly code: ErrorCode, public readonly index: number) {
        super(ErrorCode[code]);
        Object.setPrototypeOf(this, ParseError.prototype);
    }
}

export default ParseError;

