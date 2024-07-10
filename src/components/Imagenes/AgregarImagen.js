import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    CircularProgress,
    Typography,
    Box,
    FormControl,
    FormHelperText,
    Grid,
} from '@mui/material';
import { API_URL } from '../../config';

const AgregarImagen = ({ equipoId, onImagenesAgregadas }) => {
    const [imagenes, setImagenes] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        return () => previewUrls.forEach(url => URL.revokeObjectURL(url));
    }, [previewUrls]);

    const handleImagenesChange = (event) => {
        const files = Array.from(event.target.files);
        setImagenes(files);
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(newPreviewUrls);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!equipoId) {
            setError('Debe seleccionar un equipo.');
            return;
        }

        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('IdEquipo', equipoId);
        imagenes.forEach((imagen, index) => {
            formData.append(`Ruta[${index}]`, imagen);
        });

        try {
            const response = await axios.post(`${API_URL}/equipos/${equipoId}/imagenes`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Imágenes agregadas:', response.data);
            
            if (typeof onImagenesAgregadas === 'function') {
                onImagenesAgregadas(response.data);
            } else {
                console.warn('onImagenesAgregadas no es una función o no se proporcionó');
            }
            
            setImagenes([]);
            setPreviewUrls([]);
        } catch (error) {
            console.error('Error al agregar las imágenes:', error);
            setError('Error al agregar las imágenes');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDiscardImage = (index) => {
        const updatedImages = [...imagenes];
        updatedImages.splice(index, 1);
        setImagenes(updatedImages);

        const updatedPreviewUrls = [...previewUrls];
        updatedPreviewUrls.splice(index, 1);
        setPreviewUrls(updatedPreviewUrls);
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Agregar Imágenes</Typography>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <input
                        accept="image/*"
                        id="contained-button-file"
                        multiple
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleImagenesChange}
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" component="span">
                            Seleccionar Imágenes
                        </Button>
                    </label>
                    <FormHelperText>Seleccione una o más imágenes para el equipo</FormHelperText>
                </FormControl>
                
                {previewUrls.length > 0 && (
                    <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
                        {previewUrls.map((url, index) => (
                            <Grid item xs={4} sm={3} md={2} key={index}>
                                <img 
                                    src={url} 
                                    alt={`Preview ${index + 1}`} 
                                    style={{ width: '100%', height: 'auto', objectFit: 'cover', aspectRatio: '1 / 1' }} 
                                />
                                <Button 
                                    variant="contained" 
                                    color="secondary" 
                                    onClick={() => handleDiscardImage(index)} 
                                    sx={{ mt: 1 }}
                                >
                                    Descartar
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 2 }} 
                    disabled={isLoading || imagenes.length === 0}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Agregar Imágenes'}
                </Button>
                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
            </form>
        </Box>
    );
};

export default AgregarImagen;
