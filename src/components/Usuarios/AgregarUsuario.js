import React, { useState } from 'react';
import axiosInstance from '../../axiosConfig';
import {
    Button,
    TextField,
    Box,
    Typography,
    CircularProgress,
    FormControl,
    InputLabel,
    FormHelperText,
    Switch
} from '@mui/material';
import { API_URL } from '../../config';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AgregarUsuario = ({ onUsuarioAgregado }) => {
    const initialState = {
        Documento: '',
        NombreCompleto: '',
        Correo: '',
        Celular: '',
        Clave: '',
        Rol: '',
        Estado: 1,
        FechaRegistro: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    const [usuario, setUsuario] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Estado para manejar el enfoque de los campos
    const [focusedFields, setFocusedFields] = useState({
        Documento: false,
        NombreCompleto: false,
        Correo: false,
        Celular: false,
        Clave: false,
        Rol: false,
        Estado: false,
        FechaRegistro: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario({
            ...usuario,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Activar estado de carga
        try {
            const response = await axiosInstance.post(`${API_URL}/usuarios`, usuario);
            onUsuarioAgregado(response.data); // Notificar al padre que un usuario ha sido agregado
            setUsuario(initialState); // Reiniciar el estado del formulario
        } catch (error) {
            console.error('Hubo un error al agregar el usuario:', error.response ? error.response.data : error.message);
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

    const handleEstadoChange = () => {
        const newEstado = usuario.Estado === 1 ? 0 : 1;
        setUsuario({ ...usuario, Estado: newEstado });
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Agregar Usuario</Typography>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="Documento" shrink={handleInputLabelShrink('Documento', usuario.Documento)}>
                        Documento
                    </InputLabel>
                    <TextField
                        id="Documento"
                        type="text"
                        name="Documento"
                        value={usuario.Documento}
                        onChange={handleChange}
                        onClick={() => handleFocus('Documento')}
                        onBlur={() => handleBlur('Documento')}
                        required
                    />
                    <FormHelperText>Ingresa el documento del usuario</FormHelperText>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="NombreCompleto" shrink={handleInputLabelShrink('NombreCompleto', usuario.NombreCompleto)}>
                        Nombre Completo
                    </InputLabel>
                    <TextField
                        id="NombreCompleto"
                        type="text"
                        name="NombreCompleto"
                        value={usuario.NombreCompleto}
                        onChange={handleChange}
                        onClick={() => handleFocus('NombreCompleto')}
                        onBlur={() => handleBlur('NombreCompleto')}
                        required
                    />
                    <FormHelperText>Ingresa el nombre completo del usuario</FormHelperText>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="Correo" shrink={handleInputLabelShrink('Correo', usuario.Correo)}>
                        Correo
                    </InputLabel>
                    <TextField
                        id="Correo"
                        type="email"
                        name="Correo"
                        value={usuario.Correo}
                        onChange={handleChange}
                        onClick={() => handleFocus('Correo')}
                        onBlur={() => handleBlur('Correo')}
                        required
                    />
                    <FormHelperText>Ingresa el correo electrónico del usuario</FormHelperText>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="Celular" shrink={handleInputLabelShrink('Celular', usuario.Celular)}>
                        Celular
                    </InputLabel>
                    <TextField
                        id="Celular"
                        type="text"
                        name="Celular"
                        value={usuario.Celular}
                        onChange={handleChange}
                        onClick={() => handleFocus('Celular')}
                        onBlur={() => handleBlur('Celular')}
                        required
                    />
                    <FormHelperText>Ingresa el número de celular del usuario</FormHelperText>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="Clave" shrink={handleInputLabelShrink('Clave', usuario.Clave)}>
                        Contraseña
                    </InputLabel>
                    <TextField
                        id="Clave"
                        type={showPassword ? 'text' : 'password'}
                        name="Clave"
                        value={usuario.Clave}
                        onChange={handleChange}
                        onClick={() => handleFocus('Clave')}
                        onBlur={() => handleBlur('Clave')}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        onMouseDown={(e) => e.preventDefault()} // Evita el comportamiento por defecto
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormHelperText>Ingresa la contraseña del usuario</FormHelperText>
                </FormControl>


                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="Rol" shrink={handleInputLabelShrink('Rol', usuario.Rol)}>
                        Rol
                    </InputLabel>
                    <TextField
                        id="Rol"
                        type="text"
                        name="Rol"
                        value={usuario.Rol}
                        onChange={handleChange}
                        onClick={() => handleFocus('Rol')}
                        onBlur={() => handleBlur('Rol')}
                        required
                    />
                    <FormHelperText>Ingresa el rol del usuario</FormHelperText>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel htmlFor="Estado" shrink={handleInputLabelShrink('Estado', usuario.Estado)}>
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
                    {isLoading ? <CircularProgress size={24} /> : 'Agregar Usuario'}
                </Button>
            </form>
        </Box>
    );
};

export default AgregarUsuario;
