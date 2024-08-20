import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../axiosConfig';
import {
    Button,
    CircularProgress,
    Typography,
    Box,
    Grid,
    IconButton,
    Card,
    CardMedia,
    CardActions,
    Snackbar,
    Alert,
    Fade,
    Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_URL } from '../../../config';

const InputFile = styled('input')({
    display: 'none',
});

const ImageCard = styled(Card)(({ theme }) => ({
    position: 'relative',
    height: 200,
    '&:hover .MuiCardActions-root': {
        opacity: 1,
    },
}));

const ImageCardActions = styled(CardActions)(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
}));

const AgregarImagen = ({ equipoId, onImagenesAgregadas }) => {
    const [imagenes, setImagenes] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        return () => previewUrls.forEach(url => URL.revokeObjectURL(url));
    }, [previewUrls]);

    const handleImagenesChange = useCallback((event) => {
        const files = Array.from(event.target.files);
        setImagenes(prevImagenes => [...prevImagenes, ...files]);
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!equipoId) {
            setSnackbar({ open: true, message: 'Debe seleccionar un equipo.', severity: 'error' });
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('IdEquipo', equipoId);
        imagenes.forEach((imagen, index) => {
            formData.append(`Ruta[${index}]`, imagen);
        });

        try {
            const response = await axiosInstance.post(`${API_URL}/equipos/${equipoId}/imagenes`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (typeof onImagenesAgregadas === 'function') {
                onImagenesAgregadas(response.data);
            }
            
            setImagenes([]);
            setPreviewUrls([]);
            setSnackbar({ open: true, message: 'Imágenes agregadas con éxito', severity: 'success' });
        } catch (error) {
            console.error('Error al agregar las imágenes:', error);
            setSnackbar({ open: true, message: 'Error al agregar las imágenes', severity: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDiscardImage = useCallback((index) => {
        setImagenes(prevImagenes => prevImagenes.filter((_, i) => i !== index));
        setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
    }, []);

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Agregar Imágenes</Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InputFile
                        accept="image/*"
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={handleImagenesChange}
                    />
                    <label htmlFor="contained-button-file">
                        <Tooltip title="Seleccionar imágenes">
                            <IconButton component="span" color="primary">
                                <AddPhotoAlternateIcon fontSize="large" />
                            </IconButton>
                        </Tooltip>
                    </label>
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                        Seleccione una o más imágenes para el equipo
                    </Typography>
                </Box>
                
                <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
                    {previewUrls.map((url, index) => (
                        <Fade in={true} key={index}>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <ImageCard>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={url}
                                        alt={`Preview ${index + 1}`}
                                    />
                                    <ImageCardActions>
                                        <Tooltip title="Descartar imagen">
                                            <IconButton
                                                onClick={() => handleDiscardImage(index)}
                                                sx={{ color: 'white' }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </ImageCardActions>
                                </ImageCard>
                            </Grid>
                        </Fade>
                    ))}
                </Grid>

                {imagenes.length > 0 && (
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        sx={{ mt: 2 }} 
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isLoading ? 'Subiendo...' : 'Agregar Imágenes'}
                    </Button>
                )}
            </form>
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AgregarImagen;
