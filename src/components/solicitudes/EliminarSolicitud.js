import React, { useState } from 'react';
import axiosInstance from '../../axiosConfig';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_URL } from '../../config';

const EliminarSolicitud = ({ solicitudId, onSolicitudEliminada }) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleOpenDeleteDialog = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setError(null);
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await axiosInstance.delete(`${API_URL}/solicitudes/${solicitudId}`);
            onSolicitudEliminada(solicitudId);
            handleClose();
        } catch (error) {
            console.error('Hubo un error al eliminar la solicitud:', error.response?.data);
            setError('Hubo un error al eliminar la solicitud.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="outlined"
                color="secondary"
                onClick={handleOpenDeleteDialog}
                startIcon={<DeleteIcon />}
            >
                Eliminar
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Confirmación</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ¿Está seguro que desea eliminar esta solicitud?
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

export default EliminarSolicitud;