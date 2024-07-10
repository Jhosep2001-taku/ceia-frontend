import React, { useState } from 'react';
import axios from 'axios';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress,
    Typography,
    Card,
    CardContent,
    CardMedia,
    CardActions
} from '@mui/material';
import { API_URL } from '../../config';

const EliminarImagenEquipo = ({ equipoId, imagen, onDelete }) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setError(null);
    };

    const handleDelete = async () => {
        if (!imagen || !imagen.IdImagen) {
            setError('No se ha proporcionado una imagen válida.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Llama a tu API para eliminar la imagen
            await axios.delete(`${API_URL}/equipos/${equipoId}/imagenes/${imagen.IdImagen}`);
            onDelete(imagen.IdImagen);
            handleClose();
        } catch (error) {
            console.error('Error al eliminar la imagen:', error);
            setError('Error al eliminar la imagen.');
        } finally {
            setIsLoading(false);
        }
    };

    // Construye la URL completa de la imagen en tu backend Laravel
    const imageUrl = `http://127.0.0.1:8000${imagen.Ruta}`;

    return (
        <Card>
            {imagen && (
                <CardMedia
                    component="img"
                    height="140"
                    image={imageUrl}
                    alt={`Imagen del equipo ${equipoId}`}
                />
            )}
            <CardContent>
                {/*
                <Typography variant="body1" color="textSecondary">
                    Equipo ID: {equipoId}
                </Typography>*/}
            </CardContent>
            <CardActions>
                <Button variant="contained" color="secondary" onClick={handleClickOpen}>
                    Eliminar Imagen
                </Button>
            </CardActions>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Confirmación</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ¿Está seguro que desea eliminar esta imagen?
                    </DialogContentText>
                    {error && <Typography color="error">{error}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="secondary"
                        autoFocus
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Eliminar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default EliminarImagenEquipo;