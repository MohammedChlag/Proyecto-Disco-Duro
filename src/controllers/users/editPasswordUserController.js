import validateSchemaUtil from '../../utils/validateSchemaUtil.js';
import editPasswordSchema from '../../schemas/users/editPasswordSchema.js';
import generateErrorUtils from '../../utils/helpersUtils.js';

// Importamos el Service
import { editPasswordUserService } from '../../services/users/editPasswordUserService.js';

export const editPasswordUserController = async (req, res, next) => {
    try {
        //  Obtiene id del usuario desde req.user
        const { id } = req.user;

        await validateSchemaUtil(editPasswordSchema, req.body);

        // Obtiene la info del req.body, si no hay info devuelve un error.
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            throw generateErrorUtils(
                400,
                'DATA_MISSING',
                'Faltan datos de contraseña'
            );
        }

        const user = await editPasswordUserService(
            id,
            oldPassword,
            newPassword,
            confirmNewPassword
        );

        // Responde con el usuario actualizado
        res.status(200).send({
            status: 'ok',
            message: 'Contraseña actualizada',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};
