import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AgregarEquipo from './AgregarEquipo';
import ActualizarEquipo from './ActualizarEquipo';
import EliminarEquipo from './EliminarEquipo';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Button,
    Grid,
    Divider,
    Paper,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { API_URL } from '../../config';

console.log('Variables de entorno:', API_URL);
const Equipos = () => {
    const [equipos, setEquipos] = useState([]);
    const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        fetchEquipos();
    }, []);

    const fetchEquipos = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/equipos`);
            setEquipos(response.data);
            setError(null);
        } catch (error) {
            console.error('Error al obtener los equipos:', error);
            setError('Error al cargar los equipos');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEquipoAgregado = (nuevoEquipo) => {
        setEquipos(prevEquipos => [...prevEquipos, nuevoEquipo]);
        mostrarSnackbar('Equipo agregado exitosamente');
    };

    const handleEquipoActualizado = (equipoActualizado) => {
        setEquipos(prevEquipos =>
            prevEquipos.map(equipo =>
                equipo.IdEquipo === equipoActualizado.IdEquipo ? equipoActualizado : equipo
            )
        );
        setEquipoSeleccionado(null);
        mostrarSnackbar('Equipo actualizado exitosamente');
    };

    const handleEquipoEliminado = async (equipoId) => {
        setIsLoading(true);
        try {
            await axios.delete(`${API_URL}/equipos/${equipoId}`);
            setEquipos(prevEquipos => prevEquipos.filter(equipo => equipo.IdEquipo !== equipoId));
            mostrarSnackbar('Equipo eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar el equipo:', error);
            setError('Error al eliminar el equipo');
        } finally {
            setIsLoading(false);
            setEquipoSeleccionado(null);
        }
    };

    const seleccionarEquipo = (id) => {
        setEquipoSeleccionado(id);
    };

    const mostrarSnackbar = (mensaje) => {
        setSnackbarMessage(mensaje);
        setSnackbarOpen(true);
    };

    const cerrarSnackbar = () => {
        setSnackbarOpen(false);
    };

    if (isLoading) return <CircularProgress />;

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Gestión de Equipos
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <AgregarEquipo onEquipoAgregado={handleEquipoAgregado} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Lista de Equipos
                        </Typography>
                        {error && <Typography color="error">{error}</Typography>}
                        <List>
                            {equipos.map(equipo => (
                                <div key={equipo.IdEquipo}>
                                    <ListItem>
                                        <ListItemText primary={equipo.Equipo} />
                                        <ListItemSecondaryAction>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<EditIcon />}
                                                        onClick={() => seleccionarEquipo(equipo.IdEquipo)}
                                                    >
                                                        Editar
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <EliminarEquipo
                                                        equipoId={equipo.IdEquipo}
                                                        onEquipoEliminado={handleEquipoEliminado}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    <Divider />
                                </div>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
            {equipoSeleccionado && (
                <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
                    <ActualizarEquipo
                        equipoId={equipoSeleccionado}
                        onEquipoActualizado={handleEquipoActualizado}
                    />
                </Paper>
            )}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={cerrarSnackbar}
            >
                <Alert onClose={cerrarSnackbar} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Equipos;
