import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import { decrypt, encrypt } from '../../utils/crypto';
import {
    Typography,
    TextField,
    Button,
    Box,
    Avatar,
    CircularProgress,
    Paper,
    Grid,
    Chip,
    Divider,
    IconButton,
    Snackbar,
    Alert,
    Badge,
    Tooltip,
} from '@mui/material';
import { Edit, Save, Cancel, Visibility, VisibilityOff } from '@mui/icons-material';
import { API_URL } from '../../config';
import { styled } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    maxWidth: 800,
    margin: '40px auto',
    backgroundColor: theme.palette.background.paper,
    borderRadius: 15,
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
    width: 150,
    height: 150,
    fontSize: 64,
    margin: '0 auto 20px',
    border: `4px solid ${theme.palette.primary.main}`,
}));

const PerfilUsuario = () => {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [unidadEncargado, setUnidadEncargado] = useState(null);

    useEffect(() => {
        fetchUsuario();
    }, []);

    const fetchUsuario = async () => {
        try {
            const encryptedUserData = localStorage.getItem('userData');
            if (!encryptedUserData) {
                throw new Error('User data is not available in localStorage');
            }
            const userData = decrypt(encryptedUserData);
            if (!userData.IdUsuario) {
                throw new Error('User ID is not available in decrypted user data');
            }
            const response = await axiosInstance.get(`${API_URL}/usuarios/${userData.IdUsuario}`);
            setUsuario(response.data);
            fetchUnidadEncargado(userData.IdUsuario);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener el perfil del usuario:', error);
            setSnackbar({ open: true, message: 'Error al cargar el perfil', severity: 'error' });
            setLoading(false);
        }
    };

    const fetchUnidadEncargado = async (idUsuario) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/unidades`);
            const unidad = response.data.find(u => u.IdUsuario === idUsuario);
            setUnidadEncargado(unidad);
        } catch (error) {
            console.error('Error al obtener la información de la unidad:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUsuario((prevUsuario) => ({ ...prevUsuario, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const encryptedUserData = localStorage.getItem('userData');
            const userData = decrypt(encryptedUserData);
            await axiosInstance.put(`${API_URL}/usuarios/${userData.IdUsuario}/perfil`, usuario);
            
            const updatedUserData = { ...userData, ...usuario };
            localStorage.setItem('userData', encrypt(updatedUserData));
            
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            setSnackbar({ open: true, message: 'Error al actualizar el perfil', severity: 'error' });
        }
    };

    const handlePasswordChange = async () => {
        try {
            const encryptedUserData = localStorage.getItem('userData');
            const userData = decrypt(encryptedUserData);
            await axiosInstance.put(`${API_URL}/usuarios/${userData.IdUsuario}/perfil`, { Clave: newPassword });
            setNewPassword('');
            setSnackbar({ open: true, message: 'Contraseña actualizada con éxito', severity: 'success' });
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error);
            setSnackbar({ open: true, message: 'Error al actualizar la contraseña', severity: 'error' });
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!usuario) {
        return <Typography variant="h6">No se pudo cargar el perfil del usuario.</Typography>;
    }

    const tipoPermiso = (() => {
        const encryptedUserData = localStorage.getItem('userData');
        if (encryptedUserData) {
            const userData = decrypt(encryptedUserData);
            return userData.TipoPermiso ? userData.TipoPermiso.toString().replace(/[\[\]"']/g, '') : '';
        }
        return '';
    })();

    return (
        <StyledPaper>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <LargeAvatar>{usuario.NombreCompleto.charAt(0)}</LargeAvatar>
                    <Typography variant="h4" align="center" gutterBottom>
                        {usuario.NombreCompleto}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary" align="center" gutterBottom>
                        {tipoPermiso.replace(/[\[\]"']/g, '')}
                    </Typography>
                    {unidadEncargado && (
                        <Tooltip title="Posición de liderazgo" arrow>
                            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                <Badge
                                    badgeContent={<StarIcon fontSize="small" />}
                                    color="primary"
                                    overlap="circular"
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                        },
                                    }}
                                >
                                    <Typography 
                                        variant="h6" 
                                        align="center" 
                                        sx={{ 
                                            mt: 2,
                                            fontWeight: 'bold',
                                            color: theme => theme.palette.primary.main,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            border: theme => `2px solid ${theme.palette.primary.main}`,
                                            borderRadius: '8px',
                                            padding: '8px 16px',
                                            display: 'inline-block'
                                        }}
                                    >
                                        Encargado de {unidadEncargado.NombreUnidad}
                                    </Typography>
                                </Badge>
                            </Box>
                        </Tooltip>
                    )}
                
                    <Chip
                        label={usuario.Estado === 1 ? 'Activo' : 'Inactivo'}
                        color={usuario.Estado === 1 ? 'success' : 'error'}
                        sx={{ mt: 1, width: '100%' }}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Nombre Completo"
                                    name="NombreCompleto"
                                    value={usuario.NombreCompleto || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                    disabled={!editMode}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Correo"
                                    name="Correo"
                                    value={usuario.Correo || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                    disabled={!editMode}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Celular"
                                    name="Celular"
                                    value={usuario.Celular || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                    disabled={!editMode}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Documento"
                                    name="Documento"
                                    value={usuario.Documento || ''}
                                    fullWidth
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Rol"
                                    value={usuario.Rol || ''}
                                    fullWidth
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Fecha de Registro"
                                    value={new Date(usuario.FechaRegistro).toLocaleDateString() || ''}
                                    fullWidth
                                    disabled
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            {editMode ? (
                                <>
                                    <Button type="submit" variant="contained" color="primary" startIcon={<Save />} sx={{ mr: 1 }} onClick={() => setEditMode(false)}>
                                        Guardar
                                    </Button>
                                    <Button variant="outlined" startIcon={<Cancel />} onClick={() => setEditMode(false)}>
                                        Cancelar
                                    </Button>
                                </>
                            ) : (
                                <Button variant="contained" startIcon={<Edit />} onClick={() => setEditMode(true)}>
                                    Editar Perfil
                                </Button>
                            )}
                        </Box>
                    </form>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" gutterBottom>Cambiar Contraseña</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                        <TextField
                            label="Nueva Contraseña"
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            fullWidth
                            sx={{ mr: 1 }}
                        />
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        <Button variant="contained" onClick={handlePasswordChange} disabled={!newPassword}>
                            Actualizar Contraseña
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </StyledPaper>
    );
};

export default PerfilUsuario;