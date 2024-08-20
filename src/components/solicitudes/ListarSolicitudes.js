import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CrearSolicitud from './CrearSolicitud';
import ActualizarSolicitud from './ActualizarSolicitud';
import EliminarSolicitud from './EliminarSolicitud';
import ImagenSolicitud from '../Imagenes/solicitudes/ImagenSolicitud';
import useFetchData from '../../hooks/useFetchData';
import useDialog from '../../hooks/useDialog';
import CustomDialog from '../Common/CustomDialog';
import {
    Container,
    Typography,
    Button,
    Box,
    Paper,
    IconButton,
    Tooltip,
    CircularProgress,
    TextField,
    InputAdornment,
    List,
    ListItem,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Card,
    CardContent
} from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import { API_URL } from '../../config';
import { decrypt } from '../../utils/crypto';

const Solicitudes = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const obtenerUsuarioData = () => {
        try {
            const encryptedUserData = localStorage.getItem('userData');
            if (!encryptedUserData) {
                throw new Error('User data is not available in localStorage');
            }
            const userData = decrypt(encryptedUserData);
            if (!userData.IdUsuario || !userData.TipoPermiso) {
                throw new Error('User data is incomplete');
            }
            return { IdUsuario: userData.IdUsuario, TipoPermiso: userData.TipoPermiso };
        } catch (error) {
            console.error('Error al obtener la información del usuario:', error);
            return { IdUsuario: null, TipoPermiso: [] };
        }
    };

    const { IdUsuario: idUsuario, TipoPermiso: tipoPermiso } = obtenerUsuarioData();

    const { data: solicitudes, isLoading: loadingSolicitudes, setData: setSolicitudes } = useFetchData(`${API_URL}/solicitudes`);
    const { data: unidades } = useFetchData(`${API_URL}/unidades`);
    const { data: usuarios } = useFetchData(`${API_URL}/usuarios`);

    const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
    const [selectedEstado, setSelectedEstado] = useState('');
    const [selectedPrioridad, setSelectedPrioridad] = useState('');
    const [searchUnidad, setSearchUnidad] = useState('');
    const [searchDescripcion, setSearchDescripcion] = useState('');

    const { isOpen: openCreateDialog, openDialog: openCreateDialogHandler, closeDialog: closeCreateDialogHandler } = useDialog();
    const { isOpen: openEditDialog, openDialog: openEditDialogHandler, closeDialog: closeEditDialogHandler } = useDialog();
    const { isOpen: openImageDialog, openDialog: openImageDialogHandler, closeDialog: closeImageDialogHandler } = useDialog();

    const estados = [...new Set(solicitudes.map(s => s.Estado))];

    const filteredSolicitudes = solicitudes.filter(solicitud => {
        const unidadNombre = unidades.find(unidad => unidad.IdUnidad === solicitud.IdUnidad)?.NombreUnidad || '';
        const unidadMatch = unidadNombre.toLowerCase().includes(searchUnidad.toLowerCase());
        const descripcionMatch = solicitud.Descripcion.toLowerCase().includes(searchDescripcion.toLowerCase());
        const estadoMatch = selectedEstado ? solicitud.Estado === selectedEstado : true;
        const prioridadMatch = selectedPrioridad ? solicitud.Prioridad === selectedPrioridad : true;
        const usuarioMatch = tipoPermiso.includes('Administrador del Sistema') ? true : solicitud.IdUsuario === idUsuario;
        
        return unidadMatch && descripcionMatch && estadoMatch && prioridadMatch && usuarioMatch;
    });

    const handleSolicitudAgregada = (nuevaSolicitud) => {
        setSolicitudes(prev => [...prev, nuevaSolicitud]);
        closeCreateDialogHandler();
    };

    const handleSolicitudActualizada = (solicitudActualizada) => {
        setSolicitudes(prev =>
            prev.map(solicitud =>
                solicitud.IdSolicitud === solicitudActualizada.IdSolicitud ? solicitudActualizada : solicitud
            )
        );
        setSelectedSolicitudId(null);
        closeEditDialogHandler();
    };

    return (
        <Container>
            <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                            Gestión de Solicitudes
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={openCreateDialogHandler}
                            startIcon={<AddIcon />}
                            sx={{ borderRadius: '20px' }}
                        >
                            Agregar Solicitud
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            placeholder="Buscar por descripción..."
                            variant="outlined"
                            size="small"
                            value={searchDescripcion}
                            onChange={(e) => setSearchDescripcion(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            placeholder="Buscar por unidad..."
                            variant="outlined"
                            size="small"
                            value={searchUnidad}
                            onChange={(e) => setSearchUnidad(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl fullWidth variant="outlined" size="small">
                            <InputLabel>Estado</InputLabel>
                            <Select
                                value={selectedEstado}
                                onChange={(e) => setSelectedEstado(e.target.value)}
                                label="Estado"
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {estados.map(estado => (
                                    <MenuItem key={estado} value={estado}>
                                        {estado}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth variant="outlined" size="small">
                            <InputLabel>Prioridad</InputLabel>
                            <Select
                                value={selectedPrioridad}
                                onChange={(e) => setSelectedPrioridad(e.target.value)}
                                label="Prioridad"
                            >
                                <MenuItem value="">Todas</MenuItem>
                                <MenuItem value="Alta">Alta</MenuItem>
                                <MenuItem value="Media">Media</MenuItem>
                                <MenuItem value="Baja">Baja</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </Paper>

            <Paper elevation={3} sx={{ p: 3 }}>
                <List>
                    {filteredSolicitudes.map((solicitud) => {
                        const unidadNombre = unidades.find(unidad => unidad.IdUnidad === solicitud.IdUnidad)?.NombreUnidad || 'Desconocido';
                        const usuarioNombre = usuarios.find(usuario => usuario.IdUsuario === solicitud.IdUsuario)?.NombreCompleto || 'Desconocido';
                        return (
                            <ListItem
                                key={solicitud.IdSolicitud}
                                sx={{
                                    mb: 2,
                                    border: '1px solid',
                                    borderColor: solicitud.Estado === 'Pendiente' ? 'warning.main' :
                                                 solicitud.Estado === 'Concluido' ? 'success.main' : 'grey.300',
                                    borderRadius: 2,
                                    p: 2,
                                    backgroundColor: 'background.paper',
                                    boxShadow: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    '&:hover': {
                                        backgroundColor: 'grey.100'
                                    }
                                }}
                            >
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                                        {unidadNombre} - {solicitud.Descripcion}
                                    </Typography>
                                    {tipoPermiso.includes('Administrador del Sistema') && (
                                        <Typography variant="body2" component="div">
                                            Creado por: {usuarioNombre}
                                        </Typography>
                                    )}
                                    <Typography variant="body2" component="div">
                                        Codigo Solicitud: {solicitud.IdSolicitud}
                                    </Typography>
                                    <Typography variant="body2" component="div">
                                        Estado: {solicitud.Estado}
                                    </Typography>
                                    <Typography variant="body2" component="div">
                                        Fecha de Solicitud: {new Date(solicitud.FechaSolicitud).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" component="div">
                                        Prioridad: {solicitud.Prioridad}
                                    </Typography>
                                    <Typography variant="body2" component="div">
                                        Tipo de Trabajo: {solicitud.TipoTrabajo}
                                    </Typography>
                                </Box>
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        flexDirection: isMobile ? 'column' : 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        ml: isMobile ? 0 : 2,
                                        mt: isMobile ? 2 : 0,
                                        gap: isMobile ? 1 : 0, 
                                    }}
                                >
                                    <Card
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            boxShadow: 1,
                                            mr: 2
                                        }}
                                        onClick={() => {
                                            setSelectedSolicitudId(solicitud.IdSolicitud);
                                            openImageDialogHandler();
                                        }}
                                    >
                                        <CardContent>
                                            <PhotoIcon fontSize={isMobile ? "small" : "medium"} />
                                            <Typography variant="body2" color="textSecondary" sx={{ mt: isMobile ? 0 : 1, fontSize: isMobile ? '0.6rem' : '0.75rem' }}>
                                                {isMobile ? 'Carta' : 'Carta Solicitud'}
                                            </Typography>
                                    </CardContent>
                                    </Card>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: isMobile ? 'row' : 'column',
                                        ml: isMobile ? 2 : 0,
                                        mt: isMobile ? 0 : 2,
                                    }}>
                                        <Tooltip title="Editar">
                                        <IconButton
                                            color="primary"
                                            onClick={() => {
                                                setSelectedSolicitudId(solicitud.IdSolicitud);
                                                openEditDialogHandler();
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    </Box>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: isMobile ? 'row' : 'column',
                                        ml: isMobile ? 2 : 0,
                                        mt: isMobile ? 0 : 2,
                                    }}>
                                        <EliminarSolicitud
                                            solicitudId={solicitud.IdSolicitud}
                                            onSolicitudEliminada={() => {
                                                setSolicitudes(prev => prev.filter(s => s.IdSolicitud !== solicitud.IdSolicitud));
                                            }}
                                        />
                                    </Box>
                                    
                                </Box>
                            </ListItem>
                        );
                    })}
                </List>

                {loadingSolicitudes && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                        <CircularProgress />
                    </Box>
                )}
            </Paper>

            <CustomDialog
                open={openCreateDialog}
                onClose={closeCreateDialogHandler}
                title="Agregar Solicitud"
            >
                <CrearSolicitud onSolicitudAgregada={handleSolicitudAgregada} />
            </CustomDialog>

            <CustomDialog
                open={openEditDialog}
                onClose={closeEditDialogHandler}
                title="Actualizar Solicitud"
            >
                {selectedSolicitudId && (
                    <ActualizarSolicitud
                        solicitudId={selectedSolicitudId}
                        onSolicitudActualizada={handleSolicitudActualizada}
                    />
                )}
            </CustomDialog>

            <CustomDialog
                open={openImageDialog}
                onClose={closeImageDialogHandler}
                title="Imágenes de Solicitud"
            >
                {selectedSolicitudId && <ImagenSolicitud solicitudId={selectedSolicitudId} />}
            </CustomDialog>
        </Container>
    );
};

export default Solicitudes;