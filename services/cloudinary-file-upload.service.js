import cloudinary from '../config/cloudinary.js';
import { ENV } from '../config/env.config.js';

const PROJECT_FOLDER = ENV.app.name?.replace(/\s+/g, '-').toLowerCase() || 'default-project';

export const uploadImage = async (file, folder = 'uploads') => {
    if (!file) return null;

    // Full folder path: project-name/folder
    const fullFolder = `${PROJECT_FOLDER}/${folder}`;

    const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        { folder: fullFolder }
    );

    return {
        url: result.secure_url,
        publicId: result.public_id
    };
};

export const destroyImage = async (publicId) => {
    if (!publicId) return null;

    return cloudinary.uploader.destroy(publicId);
};
