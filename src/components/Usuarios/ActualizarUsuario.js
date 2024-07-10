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

const ActualizarUsuario = ({ usuarioId, onUsuarioActualizado }) => {
    const [usuario, setUsuario] = useState({
        Documento: '',
        NombreCompleto: '',
        Correo: '',
        Celular: '',
        Clave: '',
        Rol: '',
        Estado: 1,
        FechaRegistro: ''
    });

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await axios.get(`${API_URL}/usuarios/${usuarioId}`);
                setUsuario(response.data);
            } catch (error) {
                console.error('Hubo un error al obtener el usuario:', error);
            }
        };
        fetchUsuario();
    }, [usuarioId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUsuario({ ...usuario, [name]: value });
    };

    const handleEstadoChange = (e) => {
        const newState = e.target.checked ? 1 : 0;
        setUsuario({ ...usuario, Estado: newState });
    };

    const handleInputLabelShrink = (fieldName) => {
        return Boolean(usuario[fieldName]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`${API_URL}/usuarios/${usuarioId}`, usuario)
            .then(response => {
                console.log('Usuario actualizado:', response.data);
                onUsuarioActualizado(response.data); // Notificar al padre que un usuario ha sido actualizado
            })
            .catch(error => {
                console.error('Hubo un error al actualizar el usuario:', error);
            });
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Actualizar Usuario</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Documento"
                    type="text"
                    name="Documento"
                    value={usuario.Documento}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Nombre Completo"
                    type="text"
                    name="NombreCompleto"
                    value={usuario.NombreCompleto}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Correo"
                    type="email"
                    name="Correo"
                    value={usuario.Correo}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Celular"
                    type="text"
                    name="Celular"
                    value={usuario.Celular}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Clave"
                    type="password"
                    name="Clave"
                    value={usuario.Clave}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Rol"
                    type="text"
                    name="Rol"
                    value={usuario.Rol}
                    onChange={handleInputChange}
                    required
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
                            checked={usuario.Estado === 1}
                            onChange={handleEstadoChange}
                        />
                        <Typography variant="body1" sx={{ ml: 1 }}>
                            {usuario.Estado === 1 ? 'Activo' : 'Baja'}
                        </Typography>
                    </Box>
                    <FormHelperText>Selecciona el estado del usuario</FormHelperText>
                </FormControl>
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Actualizar Usuario
                </Button>
            </form>
        </Box>
    );
};

export default ActualizarUsuario;
