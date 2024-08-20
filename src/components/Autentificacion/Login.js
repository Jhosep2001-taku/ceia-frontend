import React, { useState } from 'react';
import axios from 'axios';
import {
    Button,
    TextField,
    Box,
    Typography,
    CircularProgress,
    FormControl,
    InputAdornment,
    IconButton,
    Paper,
    Snackbar,
    Alert,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { API_URL } from '../../config';
import { theme } from '../../theme'; 
import { encrypt } from '../../utils/crypto';

const Login = ({ onLoginSuccess }) => {
    const [credentials, setCredentials] = useState({ Correo: '', Clave: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.post(`${API_URL}/login`, credentials);
            const { access_token, TipoPermiso, IdUsuario, Nombre } = response.data;
            
            localStorage.clear();
            
            const encryptedData = encrypt({
                token: access_token,
                TipoPermiso,
                IdUsuario,
                Nombre
            });
            
            localStorage.setItem('userData', encryptedData);
            
            setOpenSnackbar(true);
            setTimeout(() => onLoginSuccess(response.data), 1000);
        } catch (error) {
            setError(error.response?.data?.message || 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #9c27b0 0%, #1976d2 100%)',
                    padding: 2,
                }}
            >
                <Paper
                    elevation={10}
                    sx={{
                        padding: 4,
                        borderRadius: 4,
                        maxWidth: 400,
                        width: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    }}
                >
                    <Typography variant="h4" gutterBottom align="center" color="primary" fontWeight="bold">
                        Bienvenido
                    </Typography>
                    <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 3 }}>
                        Ingresa tus credenciales para continuar
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="Correo"
                                type="email"
                                name="Correo"
                                value={credentials.Correo}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                placeholder="Correo Electrónico"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="Clave"
                                type={showPassword ? 'text' : 'password'}
                                name="Clave"
                                value={credentials.Clave}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                placeholder="Contraseña"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock color="primary" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 3, mb: 2, height: 56, borderRadius: 2 }}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
                        </Button>
                    </form>
                    {error && (
                        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                            {error}
                        </Typography>
                    )}
                </Paper>
            </Box>
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    Inicio de sesión exitoso
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
};

export default Login;
