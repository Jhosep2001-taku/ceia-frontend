import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Typography,
    TextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Switch,
    FormHelperText
} from '@mui/material';
import { API_URL } from '../../config';

const ActualizarUnidad = ({ unidadId, onUnidadActualizada }) => {
    const [unidad, setUnidad] = useState({
        TipoUnidad: '',
        NombreUnidad: '',
        NombreEncargado: '',
        CorreoEncargado: '',
        CelularEncargado: '',
        Estado: 1
    });

    useEffect(() => {
        const fetchUnidad = async () => {
            try {
                const response = await axios.get(`${API_URL}/unidades/${unidadId}`);
                setUnidad(response.data);
            } catch (error) {
                console.error('Hubo un error al obtener la unidad:', error);
            }
        };
        fetchUnidad();
    }, [unidadId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUnidad({ ...unidad, [name]: value });
    };

    const handleSwitchChange = () => {
        setUnidad({ ...unidad, Estado: unidad.Estado === 1 ? 0 : 1 });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`${API_URL}/unidades/${unidadId}`, unidad)
            .then(response => {
                console.log('Unidad actualizada:', response.data);
                onUnidadActualizada(response.data);
            })
            .catch(error => {
                console.error('Hubo un error al actualizar la unidad:', error);
            });
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Actualizar Unidad</Typography>
            <form onSubmit={handleSubmit}>

                <TextField
                    label="Tipo de Unidad"
                    type="text"
                    name="TipoUnidad"
                    value={unidad.TipoUnidad}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Nombre de Unidad"
                    type="text"
                    name="NombreUnidad"
                    value={unidad.NombreUnidad}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Nombre del Encargado"
                    type="text"
                    name="NombreEncargado"
                    value={unidad.NombreEncargado}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Correo del Encargado"
                    type="email"
                    name="CorreoEncargado"
                    value={unidad.CorreoEncargado}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Celular del Encargado"
                    type="text"
                    name="CelularEncargado"
                    value={unidad.CelularEncargado}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

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
                    <FormHelperText>Seleccione el estado de la unidad</FormHelperText>
                </FormControl>

                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mr: 2 }}>
                    Actualizar Unidad
                </Button>

            </form>
        </Box>
    );
};

export default ActualizarUnidad;
