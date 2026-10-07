import ImageKit, { toFile } from '@imagekit/nodejs';
import { serverConfig } from '@repo/config/server';

const imageKit = new ImageKit({
    privateKey: serverConfig.IMAGEKIT_PRIVATE_KEY,
});

export const uploadImage = async (file: Express.Multer.File) => {
    const result = await imageKit.files.upload({
        file: await toFile(file.buffer, file.originalname),
        fileName: file.originalname
    });
    return result.url;
}