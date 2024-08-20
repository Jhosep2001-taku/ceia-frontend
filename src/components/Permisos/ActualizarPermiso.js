import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
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

    const tiposPermiso = [
        'Administrador del Sistema',
        'Gerente',
        'Ingeniero',
        'Técnico',
        'Encargado de Unidad',
        'Usuario Básico'
    ];

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axiosInstance.get(`${API_URL}/usuarios`);
                setUsuarios(response.data);
            } catch (error) {
                console.error('Error al obtener la lista de usuarios:', error);
            }
        };

        const fetchPermiso = async () => {
            try {
                const response = await axiosInstance.get(`${API_URL}/permisos/${id}`);
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
        axiosInstance.put(`${API_URL}/permisos/${id}`, formData)
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
                    <InputLabel htmlFor="IdUsuario">Seleccione un Usuario</InputLabel>
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
                    <InputLabel htmlFor="TipoPermiso">Tipo de Permiso</InputLabel>
                    <Select
                        id="TipoPermiso"
                        name="TipoPermiso"
                        value={formData.TipoPermiso}
                        onChange={handleChange}
                        required
                    >
                        <MenuItem value="">Selecciona un tipo de permiso</MenuItem>
                        {tiposPermiso.map((tipo, index) => (
                            <MenuItem key={index} value={tipo}>{tipo}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
                    Actualizar Permiso
                </Button>
            </form>
        </Box>
    );
}

export default ActualizarPermiso;
