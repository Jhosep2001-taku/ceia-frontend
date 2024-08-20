import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import { API_URL } from '../../config';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

const ActualizarHistorialMantenimiento = ({ historialId, onHistorialActualizado = () => {}, onClose }) => {
    const [historial, setHistorial] = useState({
        IdEquipo: '',
        IdSolicitud: '',
        FechaMantenimiento: '',
        DescripcionTrabajo: '',
        Encargado: ''
    });
    const [equipos, setEquipos] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [equiposResponse, solicitudesResponse] = await Promise.all([
                    axiosInstance.get(`${API_URL}/equipos`),
                    axiosInstance.get(`${API_URL}/solicitudes`)
                ]);
                setEquipos(equiposResponse.data);
                setSolicitudes(solicitudesResponse.data);

                if (historialId) {
                    const historialResponse = await axiosInstance.get(`${API_URL}/mantenimientos/${historialId}`);
                    setHistorial(historialResponse.data);
                }
                setError(null);
            } catch (error) {
                console.error('Error al cargar los datos:', error);
                setError('Error al cargar los datos');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [historialId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHistorial(prevHistorial => ({
            ...prevHistorial,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            let response;
            if (historialId) {
                response = await axiosInstance.put(`${API_URL}/mantenimientos/${historialId}`, historial);
            } else {
                response = await axiosInstance.post(`${API_URL}/mantenimientos`, historial);
            }
            onHistorialActualizado(response.data);
            onClose();
        } catch (error) {
            console.error('Error al actualizar/crear el historial de mantenimiento:', error);
            setError(error.response?.data?.message || 'Error al actualizar/crear el historial de mantenimiento');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
        </Box>
    );

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
                {historialId ? 'Actualizar' : 'Crear'} Historial de Mantenimiento
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="IdEquipo-label">Equipo</InputLabel>
                    <Select
                        labelId="IdEquipo-label"
                        name="IdEquipo"
                        value={historial.IdEquipo}
                        onChange={handleChange}
                        required
                    >
                        {equipos.map((equipo) => (
                            <MenuItem key={equipo.IdEquipo} value={equipo.IdEquipo}>
                                {equipo.Equipo}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="IdSolicitud-label">Solicitud</InputLabel>
                    <Select
                        labelId="IdSolicitud-label"
                        name="IdSolicitud"
                        value={historial.IdSolicitud}
                        onChange={handleChange}
                        required
                    >
                        {solicitudes.map((solicitud) => (
                            <MenuItem key={solicitud.IdSolicitud} value={solicitud.IdSolicitud}>
                                {solicitud.Descripcion}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Descripción del Trabajo"
                    name="DescripcionTrabajo"
                    value={historial.DescripcionTrabajo}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    required
                />

                <TextField
                    label="Encargado"
                    name="Encargado"
                    value={historial.Encargado}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Guardando...' : (historialId ? 'Actualizar' : 'Crear') + ' Historial'}
                </Button>
            </form>
        </Box>
    );
};

export default ActualizarHistorialMantenimiento;