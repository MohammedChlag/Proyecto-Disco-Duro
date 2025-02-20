// Importamos los utils
import { renameFileUtil } from '../../utils/fileUtils.js';
import { renameFolderUtil } from '../../utils/foldersUtils.js';

// Importamos el errors
import generateErrorUtils from '../../utils/helpersUtils.js';

// Importamos los models
import { selectFileByIdModel } from '../../models/storages/selectFileByIdModel.js';
import { selectFolderByIdModel } from '../../models/storages/selectFolderByIdModel.js';
import {
    updateFileModel,
    updateFolderModel,
} from '../../models/storages/updateFileOrFolderModel.js';

// Service que se encarga de actualizar el nombre de un archivo
export const updateFileNameService = async (id, newName) => {
    // Verificamos que el archivo existe
    const file = await selectFileByIdModel(id);
    if (!file) {
        throw generateErrorUtils(404, 'FILE_NOT_FOUND', 'El archivo no existe');
    }
    const oldName = file.name;
    const userId = file.userId;
    const folderId = file.folderId || '';

    let folderName = null;
    if (folderId) {
        const folder = await selectFolderByIdModel(folderId);
        if (!folder) {
            throw generateErrorUtils(
                404,
                'FOLDER_NOT_FOUND',
                'La carpeta no existe no existe'
            );
        }
        folderName = folder.name;
    }

    // Renombrar en el sistema de archivos
    const renamedFile = await renameFileUtil(
        userId,
        folderName,
        oldName,
        newName
    );
    const { newFileName } = renamedFile;

    // Llamamos al model que actualiza el file
    const updatedFile = await updateFileModel(id, newFileName);
    // Si no llega updtatedFile, lanzamos un error
    if (!updatedFile) {
        throw generateErrorUtils(
            500,
            'FAIL_UPDATING',
            'Error al actualizar el archivo'
        );
    }

    return updatedFile;
};

// Service que se encarga de actualizar el nombre de una carpeta
export const updateFolderNameService = async (id, newName) => {
    // Verificamos que la carpeta existe
    const folder = await selectFolderByIdModel(id);
    if (!folder) {
        throw generateErrorUtils(
            404,
            'FOLDER_NOT_FOUND',
            'La carpeta no existe.'
        );
    }
    const oldName = folder.name;
    const userId = folder.userId;
    // Renombrar en el sistema de archivos
    const renamedFolder = await renameFolderUtil(userId, oldName, newName);
    const { newNameFolder } = renamedFolder;
    // Llamamos al model que actualiza el folder
    const updatedFolder = await updateFolderModel(id, newNameFolder);
    // Si no llega updtatedFolder, lanzamos un error
    if (!updatedFolder) {
        throw generateErrorUtils(
            500,
            'FAIL_UPDATING',
            'Error al actualizar la carpeta'
        );
    }
    return updatedFolder;
};
