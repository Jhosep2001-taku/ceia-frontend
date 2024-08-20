import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../axiosConfig';
import {
    Typography,
    Grid,
    Card,
    Box,
    CircularProgress,
    Alert,
    Snackbar,
    Tabs,
    Tab
} from '@mui/material';
import AgregarImagen from './AgregarImagen';
import AgregarImagenConCamara from './AgregarImagenConCamara';
import EliminarImagenEquipo from './EliminarImagenEquipo';
import { API_URL } from '../../../config';

const ImagenEquipo = ({ equipoId }) => {
    const [imagenes, setImagenes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [tabValue, setTabValue] = useState(0);
    const [cameraActive, setCameraActive] = useState(false);

    const fetchImagenes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get(`${API_URL}/equipos/${equipoId}/imagenes`);
            setImagenes(response.data);
        } catch (error) {
            console.error('Error al obtener las imágenes:', error);
            setError('Error al obtener las imágenes');
            setSnackbar({ open: true, message: 'Error al cargar las imágenes', severity: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [equipoId]);

    useEffect(() => {
        fetchImagenes();
    }, [fetchImagenes]);

    const handleImagenesAgregadas = (nuevasImagenes) => {
        if (Array.isArray(nuevasImagenes)) {
            setImagenes(prevImagenes => [...prevImagenes, ...nuevasImagenes]);
            setSnackbar({ open: true, message: 'Imágenes agregadas con éxito', severity: 'success' });
        } else if (nuevasImagenes && typeof nuevasImagenes === 'object') {
            setImagenes(prevImagenes => [...prevImagenes, nuevasImagenes]);
            setSnackbar({ open: true, message: 'Imagen agregada con éxito', severity: 'success' });
        } else {
            console.error('Formato de nuevas imágenes no válido:', nuevasImagenes);
            setSnackbar({ open: true, message: 'Error al agregar imágenes', severity: 'error' });
        }
    };

    const handleImagenEliminada = (imagenId) => {
        setImagenes(prevImagenes => prevImagenes.filter(imagen => imagen.IdImagen !== imagenId));
        setSnackbar({ open: true, message: 'Imagen eliminada con éxito', severity: 'success' });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
        if (newValue !== 1) {
            setCameraActive(false);
        }
    };

    if (isLoading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Imágenes del equipo</Typography>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tabValue} onChange={handleChangeTab} aria-label="imagen upload tabs">
                    <Tab label="Subir Imagen" />
                    <Tab label="Usar Cámara" />
                </Tabs>
            </Box>
            
            <Box sx={{ mb: 4 }}>
                {tabValue === 0 && (
                    <AgregarImagen equipoId={equipoId} onImagenesAgregadas={handleImagenesAgregadas} />
                )}
                {tabValue === 1 && (
                    <AgregarImagenConCamara
                        equipoId={equipoId}
                        onImagenesAgregadas={handleImagenesAgregadas}
                        cameraActive={cameraActive}
                        setCameraActive={setCameraActive}
                    />
                )}
            </Box>

            <Typography variant="h6" gutterBottom>Imágenes actuales</Typography>
            <Grid container spacing={2}>
                {imagenes.map((imagen) => (
                    <Grid item xs={12} sm={6} md={4} key={imagen.IdImagen}>
                        <Card>  
                            <EliminarImagenEquipo
                                equipoId={equipoId}
                                imagen={imagen}
                                onDelete={() => handleImagenEliminada(imagen.IdImagen)}
                            />
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ImagenEquipo;