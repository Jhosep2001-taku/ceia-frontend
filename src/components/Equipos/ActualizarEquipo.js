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
import ImagenEquipo from '../Imagenes/ImagenEquipo';
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

    useEffect(() => {
        const fetchEquipo = async () => {
            try {
                const response = await axios.get(`${API_URL}/equipos/${equipoId}`);
                setEquipo(response.data);
            } catch (error) {
                console.error('Hubo un error al obtener el equipo:', error);
            }
        };
        if (equipoId) {
            fetchEquipo();
        }
    }, [equipoId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEquipo({ ...equipo, [name]: value });
    };

    const handleEstadoChange = () => {
        // Toggle Estado between Activo (1) and Baja (0)
        const newEstado = equipo.Estado === 1 ? 0 : 1;
        setEquipo({ ...equipo, Estado: newEstado });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`${API_URL}/equipos/${equipoId}`, equipo)
            .then(response => {
                console.log('Equipo actualizado:', response.data);
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

                <TextField
                    label="ID de Unidad"
                    type="number"
                    name="IdUnidad"
                    value={equipo.IdUnidad}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    margin="normal"
                />

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

            {/* Agregar el componente ImagenEquipo */}
            {equipoId && <ImagenEquipo equipoId={equipoId} />}
        </Box>
    );
};

export default ActualizarEquipo;
