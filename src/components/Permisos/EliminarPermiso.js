import React from 'react';
import axiosInstance from '../../axiosConfig';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_URL } from '../../config';

const EliminarPermiso = ({ id, onDelete, onClose }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await axiosInstance.delete(`${API_URL}/permisos/${id}`);
            onDelete(id);
            onClose();
        } catch (error) {
            console.error('Hubo un error al eliminar el permiso:', error.response?.data);
            setError('Hubo un error al eliminar el permiso.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            open
            onClose={onClose}
        >
            <DialogTitle>Eliminar Permiso</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    ¿Estás seguro de que deseas eliminar este permiso? Esta acción no se puede deshacer.
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

export default EliminarPermiso;
