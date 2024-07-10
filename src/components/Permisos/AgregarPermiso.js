import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    FormHelperText,
    Box,
    Typography
} from '@mui/material';
import { API_URL } from '../../config';

const AgregarPermiso = ({ onAdd }) => {
    const [formData, setFormData] = useState({ IdUsuario: '', TipoPermiso: '' });
    const [usuarios, setUsuarios] = useState([]);
    const [focused, setFocused] = useState(false); // Nuevo estado para el foco

    useEffect(() => {
        // Obtener la lista de usuarios al cargar el componente
        axios.get(`${API_URL}/usuarios`)
            .then(response => {
                setUsuarios(response.data);
            })
            .catch(error => {
                console.error('Error al obtener la lista de usuarios:', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${API_URL}/permisos`, formData)
            .then(response => {
                onAdd(response.data); // Llamar a la función onAdd del padre con el nuevo permiso
                setFormData({ IdUsuario: '', TipoPermiso: '' }); // Limpiar el formulario después de agregar
            })
            .catch(error => {
                console.error('Error al crear el permiso:', error);
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
            <Typography variant="h5" gutterBottom>Agregar Permiso</Typography>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="IdUsuario">ID Usuario</InputLabel>
                    <Select
                        id="IdUsuario"
                        name="IdUsuario"
                        value={formData.IdUsuario}
                        onChange={handleChange}
                        required // Añadir required aquí si deseas mostrar un asterisco
                    >
                        <MenuItem value="">Selecciona un usuario</MenuItem>
                        {usuarios.map(usuario => (
                            <MenuItem key={usuario.IdUsuario} value={usuario.IdUsuario}>{usuario.NombreCompleto}</MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Selecciona el usuario para asignar el permiso</FormHelperText>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField
                        id="TipoPermiso"
                        name="TipoPermiso"
                        value={formData.TipoPermiso}
                        onChange={handleChange}
                        required // Añadir required aquí si deseas mostrar un asterisco
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
                    <FormHelperText>Ingresa el tipo de permiso a asignar</FormHelperText>
                </FormControl>
                <Button type="submit" variant="contained" color="primary">
                    Agregar Permiso
                </Button>
            </form>
        </Box>
    );
}

export default AgregarPermiso;
