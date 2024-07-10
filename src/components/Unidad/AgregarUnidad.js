import React, { useState } from 'react';
import axios from 'axios';
import {
    Button,
    TextField,
    FormControl,
    InputLabel,
    FormHelperText,
    Box,
    Typography,
    CircularProgress,
    Switch
} from '@mui/material';
import { API_URL } from '../../config';

const AgregarUnidad = ({ onUnidadAgregada }) => {
    const initialState = {
        TipoUnidad: '',
        NombreUnidad: '',
        NombreEncargado: '',
        CorreoEncargado: '',
        CelularEncargado: '',
        Estado: 1,
        FechaRegistro: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    const [unidad, setUnidad] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedFields, setFocusedFields] = useState({
        TipoUnidad: false,
        NombreUnidad: false,
        NombreEncargado: false,
        CorreoEncargado: false,
        CelularEncargado: false,
        Estado: false,
        FechaRegistro:false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUnidad({ ...unidad, [name]: value });
    };

    const handleSwitchChange = () => {
        setUnidad({ ...unidad, Estado: unidad.Estado === 1 ? 0 : 1 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Activar estado de carga

        try {
            const response = await axios.post(`${API_URL}/unidades`, unidad);
            onUnidadAgregada(response.data); // Notificar al padre que una unidad ha sido agregada
            setUnidad(initialState); // Reiniciar el estado del formulario
        } catch (error) {
            console.error('Hubo un error al agregar la unidad:', error.response ? error.response.data : error.message);
        } finally {
            setIsLoading(false); // Desactivar estado de carga
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
                        onClick={() => handleFocus('TipoUnidad')}
                        onBlur={() => handleBlur('TipoUnidad')}
                        required
                    />
                    <FormHelperText>Ingrese el tipo de unidad</FormHelperText>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="NombreUnidad" shrink={handleInputLabelShrink('NombreUnidad', unidad.NombreUnidad)} >Nombre de Unidad</InputLabel>
                    <TextField
                        id="NombreUnidad"
                        name="NombreUnidad"
                        value={unidad.NombreUnidad}
                        onChange={handleChange}
                        onClick={() => handleFocus('NombreUnidad')}
                        onBlur={() => handleBlur('NombreUnidad')}
                        required
                    />
                    <FormHelperText>Ingrese el nombre de la unidad</FormHelperText>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="NombreEncargado" shrink={handleInputLabelShrink('NombreEncargado', unidad.NombreEncargado)}>Nombre Encargado</InputLabel>
                    <TextField
                        id="NombreEncargado"
                        name="NombreEncargado"
                        value={unidad.NombreEncargado}
                        onClick={() => handleFocus('NombreEncargado')}
                        onBlur={() => handleBlur('NombreEncargado')}
                        onChange={handleChange}
                    />
                    <FormHelperText>Ingrese el nombre del encargado de la unidad</FormHelperText>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="CorreoEncargado" shrink={handleInputLabelShrink('CorreoEncargado', unidad.CorreoEncargado)}>Correo Encargado</InputLabel>
                    <TextField
                        id="CorreoEncargado"
                        name="CorreoEncargado"
                        value={unidad.CorreoEncargado}
                        onClick={() => handleFocus('CorreoEncargado')}
                        onBlur={() => handleBlur('CorreoEncargado')}
                        onChange={handleChange}
                    />
                    <FormHelperText>Ingrese el correo del encargado de la unidad</FormHelperText>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="CelularEncargado" shrink={handleInputLabelShrink('CelularEncargado', unidad.CelularEncargado)}>Celular Encargado</InputLabel>
                    <TextField
                        id="CelularEncargado"
                        name="CelularEncargado"
                        value={unidad.CelularEncargado}
                        onClick={() => handleFocus('CelularEncargado')}
                        onBlur={() => handleBlur('CelularEncargado')}
                        onChange={handleChange}
                    />
                    <FormHelperText>Ingrese el celular del encargado de la unidad</FormHelperText>
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
