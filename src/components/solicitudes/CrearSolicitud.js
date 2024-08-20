import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../axiosConfig';
import { decrypt } from '../../utils/crypto'; // Asegúrate de que la ruta sea correcta
import {
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    FormHelperText,
    Grid,
    CircularProgress,
    Box,
    Typography,
} from '@mui/material';
import { API_URL } from '../../config';

const CrearSolicitud = ({ onSolicitudAgregada }) => {
    const obtenerIdUsuario = () => {
        try {
            const encryptedUserData = localStorage.getItem('userData');
            if (!encryptedUserData) {
                throw new Error('User data is not available in localStorage');
            }
            const userData = decrypt(encryptedUserData);
            if (!userData.IdUsuario) {
                throw new Error('User ID is not available in decrypted user data');
            }
            return userData.IdUsuario;
        } catch (error) {
            console.error('Error al obtener el ID del usuario:', error);
            return null;
        }
    };

    const initialSolicitudState = {
        IdUnidad: '',
        Descripcion: '',
        Prioridad: '',
        TipoTrabajo: '',
        IdUsuario: obtenerIdUsuario(), // Obtiene el IdUsuario del localStorage
        Estado: 'Pendiente' // Valor por defecto para Estado
    };

    const [solicitud, setSolicitud] = useState(initialSolicitudState);
    const [unidades, setUnidades] = useState([]);
    const [focusedFields, setFocusedFields] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const fetchUnidades = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`${API_URL}/unidades`);
            setUnidades(response.data);
        } catch (error) {
            console.error('Hubo un error al obtener las unidades:', error);
        }
    }, []);

    useEffect(() => {
        fetchUnidades();
    }, [fetchUnidades]);

    const createHistorial = async (solicitudId) => {
        const historialData = {
            IdEquipo: solicitud.IdUnidad, // Assuming IdUnidad corresponds to IdEquipo
            IdSolicitud: solicitudId,
            FechaMantenimiento: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
            DescripcionTrabajo: solicitud.Descripcion,
            Encargado: solicitud.IdUsuario
        };
    
        try {
            await axiosInstance.post(`${API_URL}/historial-mantenimiento`, historialData);
        } catch (error) {
            console.error('Hubo un error al crear el historial de mantenimiento:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const solicitudData = {
            IdUnidad: solicitud.IdUnidad,
            Descripcion: solicitud.Descripcion,
            Prioridad: solicitud.Prioridad,
            TipoTrabajo: solicitud.TipoTrabajo,
            IdUsuario: solicitud.IdUsuario,
            Estado: solicitud.Estado // Incluimos el Estado en los datos a enviar
        };

        try {
            // Primero, crea la solicitud
            const response = await axiosInstance.post(`${API_URL}/solicitudes`, solicitudData);
            const nuevaSolicitudId = response.data.IdSolicitud;

            // Luego, crea el historial de mantenimiento para la solicitud recién creada
            await createHistorial(nuevaSolicitudId);

            // Notifica que la solicitud ha sido agregada
            onSolicitudAgregada(response.data);
            // Reinicia el formulario
            resetForm();
        } catch (error) {
            console.error('Hubo un error al crear la solicitud:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setSolicitud(initialSolicitudState);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSolicitud(prev => ({ ...prev, [name]: value }));
    };

    const handleFocusChange = (fieldName, isFocused) => {
        setFocusedFields(prev => ({ ...prev, [fieldName]: isFocused }));
    };

    const renderTextField = (name, label) => (
        <FormControl fullWidth margin="normal">
            <InputLabel htmlFor={name} shrink={solicitud[name] !== '' || focusedFields[name]}>
                {label}
            </InputLabel>
            <TextField
                id={name}
                name={name}
                value={solicitud[name]}
                onChange={handleInputChange}
                onFocus={() => handleFocusChange(name, true)}
                onBlur={() => handleFocusChange(name, false)}
                required
            />
            <FormHelperText>{`Ingrese ${label.toLowerCase()} de la solicitud`}</FormHelperText>
        </FormControl>
    );

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Agregar Solicitud</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="IdUnidad">Unidad</InputLabel>
                            <Select
                                id="IdUnidad"
                                name="IdUnidad"
                                value={solicitud.IdUnidad}
                                onChange={handleInputChange}
                                required
                            >
                                <MenuItem value="">Seleccione una unidad</MenuItem>
                                {unidades.map(unidad => (
                                    <MenuItem key={unidad.IdUnidad} value={unidad.IdUnidad}>
                                        {unidad.NombreUnidad}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>Seleccione la unidad para la solicitud</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        {renderTextField('Descripcion', 'Descripción')}
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="Prioridad">Prioridad</InputLabel>
                            <Select
                                id="Prioridad"
                                name="Prioridad"
                                value={solicitud.Prioridad}
                                onChange={handleInputChange}
                                required
                            >
                                <MenuItem value="">Seleccione una prioridad</MenuItem>
                                <MenuItem value="Alta">Alta</MenuItem>
                                <MenuItem value="Media">Media</MenuItem>
                                <MenuItem value="Baja">Baja</MenuItem>
                            </Select>
                            <FormHelperText>Seleccione la prioridad de la solicitud</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        {renderTextField('TipoTrabajo', 'Tipo de Trabajo')}
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                            {isLoading ? <CircularProgress size={24} /> : 'Agregar Solicitud'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default CrearSolicitud;
