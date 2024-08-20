import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import {
    Button,
    TextField,
    FormControl,
    InputLabel,
    FormHelperText,
    Box,
    Typography,
    CircularProgress,
    Switch,
    Autocomplete
} from '@mui/material';
import { API_URL } from '../../config';

const AgregarUnidad = ({ onUnidadAgregada }) => {
    const initialState = {
        TipoUnidad: '',
        NombreUnidad: '',
        IdUsuario: '',
        CorreoEncargado: '',
        CelularEncargado: '',
        Estado: 1,
        FechaRegistro: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    const [unidad, setUnidad] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [loadingUsuarios, setLoadingUsuarios] = useState(false);
    const [focusedFields, setFocusedFields] = useState({
        TipoUnidad: false,
        NombreUnidad: false,
        IdUsuario: false,
        Estado: false
    });

    useEffect(() => {
        const fetchUsuarios = async () => {
            setLoadingUsuarios(true);
            try {
                const response = await axiosInstance.get(`${API_URL}/usuarios`);
                setUsuarios(response.data);
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
            } finally {
                setLoadingUsuarios(false);
            }
        };
        fetchUsuarios();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUnidad({ ...unidad, [name]: value });

        if (name === 'IdUsuario') {
            const selectedUser = usuarios.find(user => user.IdUsuario === parseInt(value));
            if (selectedUser) {
                setUnidad(prevState => ({
                    ...prevState,
                    CorreoEncargado: selectedUser.Correo,
                    CelularEncargado: selectedUser.Celular
                }));
            }
        }
    };

    const handleSwitchChange = () => {
        setUnidad({ ...unidad, Estado: unidad.Estado === 1 ? 0 : 1 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axiosInstance.post(`${API_URL}/unidades`, unidad);
            onUnidadAgregada(response.data);
            setUnidad(initialState);
        } catch (error) {
            console.error('Hubo un error al agregar la unidad:', error.response ? error.response.data : error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputLabelShrink = (name, value) => {
        return focusedFields[name] || value !== '';
    };

    const handleFocus = (name) => {
        setFocusedFields({ ...focusedFields, [name]: true });
    };

    const handleBlur = (name) => {
        setFocusedFields({ ...focusedFields, [name]: false });
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Agregar Unidad</Typography>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="TipoUnidad" shrink={handleInputLabelShrink('TipoUnidad', unidad.TipoUnidad)}>Tipo de Unidad</InputLabel>
                    <TextField
                        id="TipoUnidad"
                        name="TipoUnidad"
                        value={unidad.TipoUnidad}
                        onChange={handleChange}
                        onFocus={() => handleFocus('TipoUnidad')}
                        onBlur={() => handleBlur('TipoUnidad')}
                        required
                    />
                    <FormHelperText>Ingrese el tipo de unidad</FormHelperText>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="NombreUnidad" shrink={handleInputLabelShrink('NombreUnidad', unidad.NombreUnidad)}>Nombre de Unidad</InputLabel>
                    <TextField
                        id="NombreUnidad"
                        name="NombreUnidad"
                        value={unidad.NombreUnidad}
                        onChange={handleChange}
                        onFocus={() => handleFocus('NombreUnidad')}
                        onBlur={() => handleBlur('NombreUnidad')}
                        required
                    />
                    <FormHelperText>Ingrese el nombre de la unidad</FormHelperText>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <Autocomplete
                        id="IdUsuario"
                        options={usuarios}
                        getOptionLabel={(option) => option.NombreCompleto || ''}
                        value={usuarios.find(user => user.IdUsuario === parseInt(unidad.IdUsuario)) || null}
                        onChange={(event, newValue) => {
                            if (newValue) {
                                setUnidad(prevState => ({
                                    ...prevState,
                                    IdUsuario: newValue.IdUsuario,
                                    CorreoEncargado: newValue.Correo,
                                    CelularEncargado: newValue.Celular
                                }));
                            } else {
                                setUnidad(prevState => ({
                                    ...prevState,
                                    IdUsuario: '',
                                    CorreoEncargado: '',
                                    CelularEncargado: ''
                                }));
                            }
                        }}
                        loading={loadingUsuarios}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Encargado"
                                variant="outlined"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loadingUsuarios ? <CircularProgress color="inherit" size={24} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                    <FormHelperText>Seleccione el encargado de la unidad</FormHelperText>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="Estado" shrink={true}>Estado</InputLabel>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Switch
                            id="Estado"
                            checked={unidad.Estado === 1}
                            onChange={handleSwitchChange}
                        />
                        <Typography variant="body1" sx={{ ml: 1 }}>
                            {unidad.Estado === 1 ? 'Activo' : 'Baja'}
                        </Typography>
                    </Box>
                    <FormHelperText>Selecciona el estado de la unidad</FormHelperText>
                </FormControl>

                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    {isLoading ? <CircularProgress size={24} /> : 'Agregar Unidad'}
                </Button>
            </form>
        </Box>
    );
};

export default AgregarUnidad;
