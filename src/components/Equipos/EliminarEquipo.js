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
import DeleteIcon from '@mui/icons-material/Delete';
import { API_URL } from '../../config';

const EliminarEquipo = ({ equipoId, onEquipoEliminado }) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await axiosInstance.delete(`${API_URL}/equipos/${equipoId}`);
            onEquipoEliminado(equipoId);
            handleClose();
        } catch (error) {
            setError('Hubo un error al eliminar el equipo. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button variant="outlined" color="secondary" onClick={handleClickOpen} startIcon={<DeleteIcon />}>
                Eliminar
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Eliminar Equipo</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar este equipo? Esta acción no se puede deshacer.
                    </DialogContentText>
                    {error && (
                        <DialogContentText color="error">
                            {error}
                        </DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleDelete} color="secondary" disabled={isLoading}>
                        {isLoading ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EliminarEquipo;
