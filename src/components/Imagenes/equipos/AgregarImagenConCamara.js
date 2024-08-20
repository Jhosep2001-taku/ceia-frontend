import React, { useState, useRef, useCallback, useEffect } from 'react';
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
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_URL } from '../../../config';

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

const AgregarImagenConCamara = ({ equipoId, onImagenesAgregadas, cameraActive, setCameraActive }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [capturedImages, setCapturedImages] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const showSnackbar = useCallback((message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const startCamera = async () => {
        try {
            const constraints = {
                video: { facingMode: { ideal: 'environment' } }
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error('Error al acceder a la cámara:', err);
            showSnackbar('No se pudo acceder a la cámara', 'error');
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const toggleCamera = () => {
        if (cameraActive) {
            stopCamera();
        } else {
            startCamera();
        }
        setCameraActive(prev => !prev);
    };

    const capturePhoto = () => {
        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        const blob = dataURLtoBlob(dataUrl);
        const file = new File([blob], `foto_${Date.now()}.png`, { type: 'image/png' });
        setCapturedImages(prev => [...prev, file]);
    };

    const dataURLtoBlob = (dataUrl) => {
        const [header, data] = dataUrl.split(',');
        const mime = header.match(/:(.*?);/)[1];
        const bstr = atob(data);
        const u8arr = new Uint8Array(bstr.length);
        for (let i = 0; i < bstr.length; i++) {
            u8arr[i] = bstr.charCodeAt(i);
        }
        return new Blob([u8arr], { type: mime });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!equipoId) {
            showSnackbar('Debe seleccionar un equipo', 'error');
            return;
        }
        setIsLoading(true);

        const formData = new FormData();
        formData.append('IdEquipo', equipoId);
        capturedImages.forEach((imagen, index) => {
            formData.append(`Ruta[${index}]`, imagen);
        });

        try {
            const response = await axiosInstance.post(`${API_URL}/equipos/${equipoId}/imagenes`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (typeof onImagenesAgregadas === 'function') {
                onImagenesAgregadas(response.data);
            }
            setCapturedImages([]);
            setCameraActive(false);
            showSnackbar('Imágenes agregadas exitosamente', 'success');
        } catch (error) {
            console.error('Error al agregar las imágenes:', error);
            showSnackbar('Error al agregar las imágenes', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDiscardImage = useCallback((index) => {
        setCapturedImages(prev => prev.filter((_, i) => i !== index));
    }, []);

    useEffect(() => {
        if (cameraActive) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera(); // Clean up the camera on component unmount
    }, [cameraActive]);

    useEffect(() => {
        return () => {
            capturedImages.forEach(image => URL.revokeObjectURL(image));
        };
    }, [capturedImages]);

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Agregar Fotografías</Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Tooltip title={cameraActive ? "Desactivar cámara" : "Activar cámara"}>
                        <IconButton onClick={toggleCamera} color="primary">
                            <CameraAltIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                        {cameraActive ? "Tome una o más fotos para el equipo" : "Active la cámara para tomar fotos"}
                    </Typography>
                </Box>

                {cameraActive && (
                    <Box sx={{ mb: 2 }}>
                        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
                        <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
                        <Button variant="contained" onClick={capturePhoto} sx={{ mt: 1 }}>
                            Tomar Foto
                        </Button>
                    </Box>
                )}

                <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
                    {capturedImages.map((image, index) => (
                        <Fade in={true} key={index}>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <ImageCard>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={URL.createObjectURL(image)}
                                        alt={`Captured ${index + 1}`}
                                    />
                                    <ImageCardActions>
                                        <Tooltip title="Descartar imagen">
                                            <IconButton onClick={() => handleDiscardImage(index)} sx={{ color: 'white' }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </ImageCardActions>
                                </ImageCard>
                            </Grid>
                        </Fade>
                    ))}
                </Grid>

                {capturedImages.length > 0 && (
                    <Button 
                        onClick={stopCamera}
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

export default AgregarImagenConCamara;
