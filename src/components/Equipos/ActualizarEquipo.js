import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import {
    Typography,
    TextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Switch,
    FormHelperText,
    Select,
    MenuItem
} from '@mui/material';

import { API_URL } from '../../config';

const ActualizarEquipo = ({ equipoId, onEquipoActualizado }) => {
    const [equipo, setEquipo] = useState({
        Equipo: '',
        NIA: '',
        IdUnidad: '',
        Voltaje: '',
        Potencia: '',
        Corriente: '',
        Observaciones: '',
        Estado: 1
    });
    const [unidades, setUnidades] = useState([]);

    useEffect(() => {
        const fetchEquipo = async () => {
            try {
                const response = await axiosInstance.get(`${API_URL}/equipos/${equipoId}`);
                setEquipo(response.data);
            } catch (error) {
                console.error('Hubo un error al obtener el equipo:', error);
            }
        };

        const fetchUnidades = async () => {
            try {
                const response = await axiosInstance.get(`${API_URL}/unidades`);
                setUnidades(response.data);
            } catch (error) {
                console.error('Hubo un error al obtener las unidades:', error);
            }
        };

        if (equipoId) {
            fetchEquipo();
        }
        fetchUnidades();
    }, [equipoId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEquipo({ ...equipo, [name]: value });
    };

    const handleEstadoChange = () => {
        const newEstado = equipo.Estado === 1 ? 0 : 1;
        setEquipo({ ...equipo, Estado: newEstado });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axiosInstance.put(`${API_URL}/equipos/${equipoId}`, equipo)
            .then(response => {
                
                onEquipoActualizado(response.data);
            })
            .catch(error => {
                console.error('Hubo un error al actualizar el equipo:', error);
            });
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Actualizar Equipo</Typography>
            <form onSubmit={handleSubmit}>

                <TextField
                    label="Nombre de Equipo"
                    type="text"
                    name="Equipo"
                    value={equipo.Equipo}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="NIA"
                    type="text"
                    name="NIA"
                    value={equipo.NIA}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel id="IdUnidad-label">Unidad</InputLabel>
                    <Select
                        labelId="IdUnidad-label"
                        name="IdUnidad"
                        value={equipo.IdUnidad}
                        onChange={handleInputChange}
                        required
                    >
                        {unidades.map((unidad) => (
                            <MenuItem key={unidad.IdUnidad} value={unidad.IdUnidad}>
                                {unidad.NombreUnidad}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Selecciona la unidad del equipo</FormHelperText>
                </FormControl>

                <TextField
                    label="Voltaje"
                    type="text"
                    name="Voltaje"
                    value={equipo.Voltaje}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Potencia"
                    type="text"
                    name="Potencia"
                    value={equipo.Potencia}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Corriente"
                    type="text"
                    name="Corriente"
                    value={equipo.Corriente}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Observaciones"
                    type="text"
                    name="Observaciones"
                    value={equipo.Observaciones}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="Estado" shrink={true}>
                        Estado
                    </InputLabel>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Switch
                            id="Estado"
                            checked={equipo.Estado === 1}
                            onChange={handleEstadoChange}
                        />
                        <Typography variant="body1" sx={{ ml: 1 }}>
                            {equipo.Estado === 1 ? 'Activo' : 'Baja'}
                        </Typography>
                    </Box>
                    <FormHelperText>Selecciona el estado del equipo</FormHelperText>
                </FormControl>

                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mr: 2 }}>
                    Actualizar Equipo
                </Button>

            </form>

            
        </Box>
    );
};

export default ActualizarEquipo;
