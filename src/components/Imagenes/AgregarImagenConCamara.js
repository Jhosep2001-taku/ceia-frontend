import React, { useState, useRef } from 'react';
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

const AgregarImagenConCamara = ({ equipoId, onImagenesAgregadas }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const requestCameraPermission = async () => {
    try {
      await navigator.permissions.query({ name: 'camera' });
      startCamera();
    } catch (err) {
      console.error('Error al solicitar permisos de cámara:', err);
      setError('No se pudieron obtener permisos para la cámara: ' + err.message);
    }
  };

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: { ideal: "environment" }
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      setError('No se pudo acceder a la cámara: ' + err.message);
    }
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const blob = dataURLtoBlob(dataUrl);
    const file = new File([blob], `foto_${Date.now()}.png`, { type: 'image/png' });
    setCapturedImages([...capturedImages, file]);
  };

  const dataURLtoBlob = (dataUrl) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
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
    capturedImages.forEach((imagen, index) => {
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

      setCapturedImages([]);
    } catch (error) {
      console.error('Error al agregar las imágenes:', error);
      setError('Error al agregar las imágenes: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscardSelectedImage = (index) => {
    const updatedImages = [...capturedImages];
    updatedImages.splice(index, 1);
    setCapturedImages(updatedImages);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Agregar Imágenes con Cámara</Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <Button variant="contained" onClick={requestCameraPermission}>
            Activar Cámara
          </Button>
          <video ref={videoRef} style={{ display: 'block', width: '100%', marginTop: '10px' }} autoPlay playsInline></video>
          <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480"></canvas>
          <Button variant="contained" sx={{ mt: 2 }} onClick={capturePhoto}>
            Tomar Foto
          </Button>
          <FormHelperText>Tome una o más fotos para el equipo</FormHelperText>
        </FormControl>

        {capturedImages.length > 0 && (
          <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
            {capturedImages.map((image, index) => (
              <Grid item xs={4} key={index}>
                <img src={URL.createObjectURL(image)} alt={`captured-${index}`} style={{ width: '100%' }} />
                <Button variant="contained" color="secondary" onClick={() => handleDiscardSelectedImage(index)} sx={{ mt: 1 }}>
                  Descartar
                </Button>
              </Grid>
            ))}
          </Grid>
        )}

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
          disabled={isLoading || capturedImages.length === 0}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Agregar Imágenes'}
        </Button>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      </form>
    </Box>
  );
};

export default AgregarImagenConCamara;