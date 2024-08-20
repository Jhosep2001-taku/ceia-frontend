import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../axiosConfig';
import {
    Button,
    TextField,
    FormControl,
    FormHelperText,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Autocomplete,
    CircularProgress
} from '@mui/material';
import { API_URL } from '../../config';

const AgregarHistorialMantenimiento = ({ onHistorialAgregado }) => {
    const initialHistorialState = {
        IdEquipo: '',
        IdSolicitud: '',
        FechaMantenimiento: '',
        DescripcionTrabajo: '',
        Encargado: ''
    };

    const [historial, setHistorial] = useState(initialHistorialState);
    const [equipos, setEquipos] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);
    const [loadingEquipos, setLoadingEquipos] = useState(false);
    const [loadingSolicitudes, setLoadingSolicitudes] = useState(false);

    const fetchEquipos = useCallback(async () => {
        setLoadingEquipos(true);
        try {
            const response = await axiosInstance.get(`${API_URL}/equipos`);
            setEquipos(response.data);
        } catch (error) {
            console.error('Hubo un error al obtener los equipos:', error);
        } finally {
            setLoadingEquipos(false);
        }
    }, []);

    const fetchSolicitudes = useCallback(async () => {
        setLoadingSolicitudes(true);
        try {
            const response = await axiosInstance.get(`${API_URL}/solicitudes`);
            setSolicitudes(response.data);
        } catch (error) {
            console.error('Hubo un error al obtener las solicitudes:', error);
        } finally {
            setLoadingSolicitudes(false);
        }
    }, []);

    useEffect(() => {
        fetchEquipos();
        fetchSolicitudes();
    }, [fetchEquipos, fetchSolicitudes]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post(`${API_URL}/mantenimientos`, historial);
            onHistorialAgregado(response.data);
            resetForm();
        } catch (error) {
            console.error('Hubo un error al agregar el historial de mantenimiento:', error);
        }
    };

    const resetForm = () => {
        setHistorial(initialHistorialState);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHistorial(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title="Agregar Historial de Mantenimiento" />
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth margin="normal">
                                <Autocomplete
                                    id="IdEquipo"
                                    options={equipos}
                                    getOptionLabel={(option) => option.Equipo || ''}
                                    value={equipos.find(equipo => equipo.IdEquipo === historial.IdEquipo) || null}
                                    onChange={(event, newValue) => {
                                        setHistorial(prev => ({ ...prev, IdEquipo: newValue ? newValue.IdEquipo : '' }));
                                    }}
                                    loading={loadingEquipos}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Equipo"
                                            variant="outlined"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingEquipos ? <CircularProgress color="inherit" size={24} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                                <FormHelperText>Seleccione el equipo correspondiente</FormHelperText>
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <Autocomplete
                                    id="IdSolicitud"
                                    options={solicitudes}
                                    getOptionLabel={(option) => `Solicitud ${option.IdSolicitud}` || ''}
                                    value={solicitudes.find(solicitud => solicitud.IdSolicitud === historial.IdSolicitud) || null}
                                    onChange={(event, newValue) => {
                                        setHistorial(prev => ({ ...prev, IdSolicitud: newValue ? newValue.IdSolicitud : '' }));
                                    }}
                                    loading={loadingSolicitudes}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Solicitud"
                                            variant="outlined"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingSolicitudes ? <CircularProgress color="inherit" size={24} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                                <FormHelperText>Seleccione la solicitud correspondiente</FormHelperText>
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="FechaMantenimiento"
                                    name="FechaMantenimiento"
                                    label="Fecha de Mantenimiento"
                                    type="date"
                                    value={historial.FechaMantenimiento}
                                    onChange={handleInputChange}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    required
                                />
                                <FormHelperText>Ingrese la fecha del mantenimiento</FormHelperText>
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="DescripcionTrabajo"
                                    name="DescripcionTrabajo"
                                    label="Descripción del Trabajo"
                                    value={historial.DescripcionTrabajo}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={4}
                                    fullWidth
                                    required
                                />
                                <FormHelperText>Describa el trabajo realizado durante el mantenimiento</FormHelperText>
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="Encargado"
                                    name="Encargado"
                                    label="Encargado"
                                    value={historial.Encargado}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                />
                                <FormHelperText>Ingrese el nombre del encargado del mantenimiento</FormHelperText>
                            </FormControl>

                            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                                Agregar Historial
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default AgregarHistorialMantenimiento;
