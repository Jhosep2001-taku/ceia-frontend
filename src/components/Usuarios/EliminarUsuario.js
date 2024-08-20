import React, { useState } from 'react';
import axiosInstance from '../../axiosConfig';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { API_URL } from '../../config';

const EliminarUsuario = ({ open, onClose, usuarioId, onUsuarioEliminado }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        setIsLoading(true); // Start loading state
        try {
            await axiosInstance.delete(`${API_URL}/usuarios/${usuarioId}`);
            console.log('Usuario eliminado');
            onUsuarioEliminado(usuarioId); // Notificar al padre que un usuario ha sido eliminado
            onClose(); // Close the dialog
        } catch (error) {
            console.error('Hubo un error al eliminar el usuario:', error.response?.data);
            setError('Hubo un error al eliminar el usuario.'); // Set error message
        } finally {
            setIsLoading(false); // End loading state
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Eliminar Usuario</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
                </DialogContentText>
                {error && (
                    <DialogContentText color="error">
                        {error}
                    </DialogContentText>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleDelete} color="secondary" disabled={isLoading}>
                    {isLoading ? 'Eliminando...' : 'Eliminar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EliminarUsuario;
