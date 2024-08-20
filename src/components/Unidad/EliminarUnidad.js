import React, { useState } from 'react';
import axiosInstance from '../../axiosConfig';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_URL } from '../../config';

const EliminarUnidad = ({ unidadId, onUnidadEliminada, onClose }) => {
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    const handleDelete = async () => {
        try {
            const response = await axiosInstance.delete(`${API_URL}/unidades/${unidadId}`);
            
            if (response.status === 200 || response.status === 204) {
                onUnidadEliminada(unidadId);
                setSnackbarMessage('Unidad eliminada con éxito');
            } else {
                setSnackbarMessage('Error al eliminar la unidad: Respuesta inesperada del servidor');
            }
        } catch (error) {
            console.error('Hubo un error al eliminar la unidad:', error);
            console.error('Detalles del error:', error.response);
            setSnackbarMessage(`Error al eliminar la unidad: ${error.message}`);
        } finally {
            setOpen(false);
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div>
            <Button
                variant="outlined"
                color="secondary"
                onClick={handleClickOpen}
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
                        ¿Está seguro que desea eliminar esta unidad?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleDelete} color="secondary" autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </div>
    );
};

export default EliminarUnidad;
