import ImageKit, { toFile } from '@imagekit/nodejs';
import { config } from '@repo/config';

const imageKit = new ImageKit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

export const uploadImage = async (file: Express.Multer.File) => {
    const result = await imageKit.files.upload({
        file: await toFile(file.buffer, file.originalname),
        fileName: file.originalname
    });
    return result.url;
}