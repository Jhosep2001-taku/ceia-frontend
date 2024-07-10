import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box
} from '@mui/material';
import { API_URL } from '../../config';

const ActualizarPermiso = ({ id, onUpdate, onCancel }) => {
    const [formData, setFormData] = useState({ IdUsuario: '', TipoPermiso: '' });
    const [usuarios, setUsuarios] = useState([]);
    const [focused, setFocused] = useState(false); // Agregamos un nuevo estado para el foco

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get(`${API_URL}/usuarios`);
                setUsuarios(response.data);
            } catch (error) {
                console.error('Error al obtener la lista de usuarios:', error);
            }
        };

        const fetchPermiso = async () => {
            try {
                const response = await axios.get(`${API_URL}/permisos/${id}`);
                const { IdUsuario, TipoPermiso } = response.data;
                setFormData({ IdUsuario, TipoPermiso });
            } catch (error) {
                console.error('Error fetching permission data:', error);
            }
        };

        fetchUsuarios();
        fetchPermiso();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`${API_URL}/permisos/${id}`, formData)
            .then(response => {
                onUpdate(response.data); // Actualizar el estado de permisos en el componente padre
            })
            .catch(error => {
                console.error('Error updating permission:', error);
            });
    };

    const handleFocus = () => {
        setFocused(true);
    };

    const handleBlur = () => {
        setFocused(false);
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Actualizar Permiso</Typography>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="IdUsuario">ID Usuario</InputLabel>
                    <Select
                        id="IdUsuario"
                        name="IdUsuario"
                        value={formData.IdUsuario}
                        onChange={handleChange}
                        required
                    >
                        <MenuItem value="">Selecciona un usuario</MenuItem>
                        {usuarios.map(usuario => (
                            <MenuItem key={usuario.IdUsuario} value={usuario.IdUsuario}>{usuario.NombreCompleto}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField
                        id="TipoPermiso"
                        name="TipoPermiso"
                        value={formData.TipoPermiso}
                        onChange={handleChange}
                        required
                        fullWidth
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        InputProps={{
                            startAdornment: (
                                <InputLabel
                                    position="start"
                                    htmlFor="TipoPermiso"
                                    shrink={formData.TipoPermiso !== '' || focused}
                                >
                                    Tipo de Permiso
                                </InputLabel>
                            ),
                        }}
                    />
                </FormControl>
                <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
                    Actualizar Permiso
                </Button>
                <Button type="button" onClick={onCancel} variant="outlined" color="secondary">
                    Cancelar
                </Button>
            </form>
        </Box>
    );
}

export default ActualizarPermiso;