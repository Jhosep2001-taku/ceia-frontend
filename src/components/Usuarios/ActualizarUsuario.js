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
    IconButton,
    InputAdornment
} from '@mui/material';
import { API_URL } from '../../config';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const ActualizarUsuario = ({ usuarioId, onUsuarioActualizado }) => {
    const [usuario, setUsuario] = useState({
        Documento: '',
        NombreCompleto: '',
        Correo: '',
        Celular: '',
        Rol: '',
        Estado: 1,
        FechaRegistro: ''
    });
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await axiosInstance.get(`${API_URL}/usuarios/${usuarioId}`);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedUser = {...usuario};
        if (newPassword) {
            updatedUser.Clave = newPassword;
        }
        axiosInstance.put(`${API_URL}/usuarios/${usuarioId}`, updatedUser)
            .then(response => {
                
                onUsuarioActualizado(response.data);
            })
            .catch(error => {
                console.error('Hubo un error al actualizar el usuario:', error);
            });
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
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
                    label="Nueva Contraseña"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowPassword} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <FormHelperText>Deja en blanco para mantener la contraseña actual</FormHelperText>
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