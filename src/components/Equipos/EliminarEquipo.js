import React, { useState } from 'react';
import axios from 'axios';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { API_URL } from '../../config';

const EliminarEquipo = ({ equipoId, onEquipoEliminado }) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null); // Estado para manejar errores

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await axios.delete(`${API_URL}/equipos/${equipoId}`);
            console.log('Equipo eliminado');
            onEquipoEliminado(equipoId); // Notificar al padre que un equipo ha sido eliminado
            setOpen(false); // Cerrar el diálogo de confirmación
            // Considera actualizar el estado localmente en lugar de recargar la página
        } catch (error) {
            console.error('Hubo un error al eliminar el equipo:', error.response ? error.response.data : error.message);
            setError('Error al eliminar el equipo'); // Manejo del estado de error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Button variant="contained" color="secondary" onClick={handleClickOpen}>
                Eliminar Equipo
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirmación"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ¿Está seguro que desea eliminar este equipo?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button disabled={isLoading} onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleDelete}
                        color="secondary"
                        autoFocus
                    >
                        {isLoading ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                </DialogActions>
            </Dialog>
            {error && <p>{error}</p>} {/* Mostrar mensaje de error si ocurre */}
        </div>
    );
};

export default EliminarEquipo;
