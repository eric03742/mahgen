import ErrorCode from "./ErrorCode";
import Mahgen from "./Mahgen";
import MahgenElement from "./MahgenElement";
import ParseError from "./ParseError";

customElements.define('mah-gen', MahgenElement);

export { Mahgen, MahgenElement, ErrorCode, ParseError };