import './simple.min.css';

import * as mg from "./Mahgen";

function format(ok: boolean, msg: string) {
    return `<blockquote><b>${ok ? 'Generated! ' : 'Failed! '}</b>${msg}</blockquote>`;
}

function render() {
    const div = document.querySelector<HTMLDivElement>('#msg')!;
    const img = document.querySelector<HTMLImageElement>('#tile')!;
    const it = document.querySelector<HTMLInputElement>('#seq')!;
    const seq = it.value;
    mg.render(seq)
        .then(result => {
            if(result.isOk) {
                div.style.display = 'block';
                div.innerHTML = format(true, '');
                img.src = result.image;
                img.style.display = 'block';
            } else {
                let msg = '';
                switch (result.error) {
                    case mg.ErrorCode.None:
                        msg = 'None!';
                        break;
                    case mg.ErrorCode.InputEmpty:
                        msg = 'Input sequence is empty!'
                        break;
                    case mg.ErrorCode.InputTooLong:
                        msg = 'Input sequence is too long!';
                        break;
                    case mg.ErrorCode.InvalidSuit:
                        msg = `Invalid mahjong suit at position: ${result.errorPos + 1}!`;
                        break;
                    case mg.ErrorCode.InvalidDigit:
                        msg = `Invalid mahjong number at position: ${result.errorPos + 1}!`;
                        break;
                    case mg.ErrorCode.MissingTile:
                        msg = `Missing mahjong tile at position: ${result.errorPos + 1}!`;
                        break;
                    case mg.ErrorCode.MissingSuit:
                        msg = `Missing mahjong suit at position: ${result.errorPos + 1}!`;
                        break;
                    case mg.ErrorCode.Unknown:
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

