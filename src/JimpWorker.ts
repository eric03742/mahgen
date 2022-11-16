import Jimp from 'jimp/browser/lib/jimp';

interface MsgPack {
    images: string[]
}

self.onmessage = async (e: MessageEvent<MsgPack>) => {
    let width = 0;
    let height = 0;
    let pos = 0;

    const pack = e.data;
    const promises = [];
    for(const str of pack.images) {
        const buffer = Buffer.from(str, 'base64');
        const promise = Jimp.read(buffer);
        promises.push(promise);
    }

    const images = await Promise.all(promises);

    for(const image of images) {
        width += image.getWidth();
        height = Math.max(height, image.getHeight());
    }

    const result = await Jimp.create(width, height, 0x00000000);
    for(const image of images) {
        result.blit(image, pos, height - image.getHeight());
        pos += image.getWidth();
    }

    const base64 = await result.getBase64Async(Jimp.MIME_PNG);
    self.postMessage(base64);
    self.close();
}
