// Importamos el errors
import generateErrorUtils from '../../utils/helpersUtils.js';

//Importamos los models
import { SelectUserByRegCode } from '../../models/users/SelectUserByRegCode.js';
import { updateActiveUserModel } from '../../models/users/updateActiveUserModel.js';

// Importamos util
import { createUserPath } from '../../utils/foldersUtils.js';

// Service que se encarga de activar un user
export const activateUserServices = async (registrationCode) => {
    // Comprobar si el usuario ya existe por el código de registro
    const user = await SelectUserByRegCode(registrationCode);
    if (!user) {
        throw generateErrorUtils(400, 'USER_NOT_FOUND', 'El usuario no existe');
    }
    // Comprobar si el usuario ya está activado
    if (user.active === 1 || user.active === true) {
        throw generateErrorUtils(
            400,
            'USER_ACTIVE',
            'El usuario ya esta activo'
        );
    }
    // Actualizar el estado del usuario a activo
    const result = await updateActiveUserModel(user.id);
    if (result.affectedRows === 0) {
        throw generateErrorUtils(
            500,
            'ERROR_DB',
            'No se pudo activar el usuario'
        );
    }

    // Crear la carpeta raiz del usuario
    await createUserPath(user.id);

    return;
};
