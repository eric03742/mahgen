import fs from 'fs';
import path from 'path';

(function() {
    const dir = 'res';
    const ext = '.png';
    const dst = 'src/res.json';

    const result = [];

    const files = fs
        .readdirSync(dir)
        .filter((f) => path.extname(f) === ext);
    for(const f of files) {
        const bitmap = fs.readFileSync(path.join(dir, f));
        const base64 = bitmap.toString('base64');
        result.push({
            k: path.basename(f, ext),
            v: base64
        });
    }

    fs.writeFileSync(dst, JSON.stringify(result), 'utf-8');
})();