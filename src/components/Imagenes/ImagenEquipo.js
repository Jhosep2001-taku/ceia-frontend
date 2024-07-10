import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Typography,
    Grid,
    Card,
    CardMedia,
    Box,
    CircularProgress
} from '@mui/material';
import AgregarImagen from './AgregarImagen';
import AgregarImagenConCamara from './AgregarImagenConCamara';
import EliminarImagenEquipo from './EliminarImagenEquipo';
import { API_URL } from '../../config';

const ImagenEquipo = ({ equipoId }) => {
    const [imagenes, setImagenes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchImagenes();
    }, [equipoId]);

    const fetchImagenes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/equipos/${equipoId}/imagenes`);
            setImagenes(response.data);
        } catch (error) {
            console.error('Error al obtener las imágenes:', error);
            setError('Error al obtener las imágenes');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImagenesAgregadas = (nuevasImagenes) => {
        if (Array.isArray(nuevasImagenes)) {
            setImagenes(prevImagenes => [...prevImagenes, ...nuevasImagenes]);
        } else if (nuevasImagenes && typeof nuevasImagenes === 'object') {
            setImagenes(prevImagenes => [...prevImagenes, nuevasImagenes]);
        } else {
            console.error('Formato de nuevas imágenes no válido:', nuevasImagenes);
        }
    };

    const handleImagenEliminada = (imagenId) => {
        setImagenes(prevImagenes => prevImagenes.filter(imagen => imagen.IdImagen !== imagenId));
    };

    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Gestión de Imágenes</Typography>
            <AgregarImagen equipoId={equipoId} onImagenesAgregadas={handleImagenesAgregadas} />
            <AgregarImagenConCamara equipoId={equipoId} onImagenesAgregadas={handleImagenesAgregadas} />
            <Grid container spacing={2} sx={{ mt: 2 }}>
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
        </Box>
    );
};

export default ImagenEquipo;