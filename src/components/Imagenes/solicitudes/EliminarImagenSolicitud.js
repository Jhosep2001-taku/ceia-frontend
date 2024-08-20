import React, { useState } from 'react';
import axiosInstance from '../../../axiosConfig';
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
    CardActions,
    IconButton,
    Modal,
    Fade,
    Backdrop
} from '@mui/material';
import { API_URL } from '../../../config';
import DeleteIcon from '@mui/icons-material/Delete';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';

const EliminarImagenSolicitud = ({ solicitudId, imagen, onDelete }) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fullscreenOpen, setFullscreenOpen] = useState(false);

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
            await axiosInstance.delete(`${API_URL}/solicitudes/${solicitudId}/imagenes/${imagen.IdImagen}`);
            onDelete(imagen.IdImagen);
            handleClose();
        } catch (error) {
            console.error('Error al eliminar la imagen:', error);
            setError('Error al eliminar la imagen.');
        } finally {
            setIsLoading(false);
        }
    };

    const imageUrl = `${API_URL.replace('/api', '')}${imagen.Ruta}`;

    const handleFullscreenOpen = () => {
        setFullscreenOpen(true);
    };

    const handleFullscreenClose = () => {
        setFullscreenOpen(false);
    };

    return (
        <Card>
            {imagen && (
                <CardMedia
                    component="img"
                    height="200"
                    image={imageUrl}
                    alt={`Imagen de la solicitud ${solicitudId}`}
                    sx={{ cursor: 'pointer' }}
                    onDoubleClick={handleFullscreenOpen}
                />
            )}
            <CardActions>
                <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={handleClickOpen} 
                    startIcon={<DeleteIcon />} 
                    disabled={isLoading}
                >
                    {isLoading ? 'Eliminando...' : 'Eliminar'}
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

            <Modal
                open={fullscreenOpen}
                onClose={handleFullscreenClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={fullscreenOpen}>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        height: '90%',
                        backgroundColor: 'black',
                        boxShadow: 24,
                        outline: 'none',
                    }}>
                        <IconButton
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                color: 'white',
                            }}
                            onClick={handleFullscreenClose}
                        >
                            <CloseIcon />
                        </IconButton>
                        <img
                            src={imageUrl}
                            alt={`Imagen de la solicitud ${solicitudId}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                            }}
                        />
                    </div>
                </Fade>
            </Modal>
        </Card>
    );
};

export default EliminarImagenSolicitud;