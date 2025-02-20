import generateErrorUtils from '../../utils/helpersUtils.js';

// Importamos el Service
import { editAvatarService } from '../../services/users/editAvatarService.js';

export const editAvatarUserController = async (req, res, next) => {
    try {
        if (!req.file) {
            throw generateErrorUtils(
                400,
                'AVATAR_MISSING',
                'Debes enviar un avatar'
            );
        }

        const userId = req.user.id;
        const avatarFileName = req.file.filename;
        const fileBuffer = req.file.buffer;

        // Llama al service para actualizar el avatar
        const updatedUser = await editAvatarService(
            userId,
            avatarFileName,
            fileBuffer
        );

        res.status(201).send({
            status: 'ok',
            message: 'Avatar actualizado correctamente',
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};
