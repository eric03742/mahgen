import './simple.min.css';

import { ErrorCode, ParseError, Mahgen } from './index';

function format(ok: boolean, msg: string) {
    return `<blockquote><b>${ok ? 'Generated! ' : 'Failed! '}</b>${msg}</blockquote>`;
}

function render() {
    const div = document.querySelector<HTMLDivElement>('#msg')!;
    const img = document.querySelector<HTMLImageElement>('#tile')!;
    const it = document.querySelector<HTMLInputElement>('#seq')!;
    const seq = it.value;
    Mahgen.render(seq).then(base64 => {
        div.style.display = 'block';
        div.innerHTML = format(true, '');
        img.src = base64;
        img.style.display = 'block';
    }).catch(err => {
        if(err instanceof ParseError) {
            let msg = '';
            switch(err.code) {
                case ErrorCode.None:
                    msg = 'None!';
                    break;
                case ErrorCode.InputEmpty:
                    msg = 'Input sequence is empty!'
                    break;
                case ErrorCode.InputTooLong:
                    msg = 'Input sequence is too long!';
                    break;
                case ErrorCode.InvalidSuit:
                    msg = `Invalid mahjong suit at position: ${err.index + 1}!`;
                    break;
                case ErrorCode.InvalidDigit:
                    msg = `Invalid mahjong number at position: ${err.index + 1}!`;
                    break;
                case ErrorCode.MissingTile:
                    msg = `Missing mahjong tile at position: ${err.index + 1}!`;
                    break;
                case ErrorCode.MissingSuit:
                    msg = `Missing mahjong suit at position: ${err.index + 1}!`;
                    break;
                case ErrorCode.Unknown:
                    msg = 'Unknown error!';
                    break;
                default:
                    msg = '';
                    break;
            }
            div.style.display = 'block';
            div.innerHTML = format(false, msg);
            img.style.display = 'none';
        }
    });
}

const button = document.querySelector<HTMLButtonElement>('#btn')!;
button.addEventListener('click', render);

