import {
    getResourceByShareToken,
    getFilesInFolderModel,
} from '../../models/storages/shareFileOrFolderModel.js';
import generateErrorUtils from '../../utils/helpersUtils.js';

export const getSharedFilesController = async (req, res, next) => {
    try {
        const { shareToken } = req.params;
        const resource = await getResourceByShareToken(shareToken);
        if (!resource) {
            throw generateErrorUtils(
                404,
                'NOT_FOUND',
                'El archivo/carpeta al que intenta acceder ya no está disponible'
            );
        }

        if (resource.type === 'folder') {
            const files = await getFilesInFolderModel(resource.id);
            return res.status(200).send({ data: resource, files });
        }

        res.status(200).send({ status: 'ok', resource });
    } catch (error) {
        next(error);
    }
};
