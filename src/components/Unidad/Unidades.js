import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AgregarUnidad from './AgregarUnidad';
import ActualizarUnidad from './ActualizarUnidad';
import EliminarUnidad from './EliminarUnidad';
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
    Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { API_URL } from '../../config';

const Unidades = () => {
    const [unidades, setUnidades] = useState([]);
    const [selectedUnidadId, setSelectedUnidadId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUnidades = () => {
        setIsLoading(true);
        axios.get(`${API_URL}/unidades`)
            .then(response => {
                setUnidades(response.data);
            })
            .catch(error => {
                console.error('Hubo un error al obtener las unidades:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchUnidades();
    }, []); // Aquí incluimos fetchUnidades como dependencia para evitar la advertencia

    const handleUnidadAgregada = (nuevaUnidad) => {
        setUnidades([...unidades, nuevaUnidad]);
    };

    const handleUnidadActualizada = (unidadActualizada) => {
        setUnidades(unidades.map(unidad =>
            unidad.IdUnidad === unidadActualizada.IdUnidad ? unidadActualizada : unidad
        ));
        setSelectedUnidadId(null);
    };

    const handleUnidadEliminada = (unidadId) => {
        setUnidades(unidades.filter(unidad => unidad.IdUnidad !== unidadId));
        setSelectedUnidadId(null);
    };

    const selectUnidad = (id) => {
        setSelectedUnidadId(id);
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Gestión de Unidades
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <AgregarUnidad onUnidadAgregada={handleUnidadAgregada} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Lista de Unidades
                        </Typography>
                        <List>
                            {unidades.map(unidad => (
                                <div key={unidad.IdUnidad}>
                                    <ListItem>
                                        <ListItemText primary={unidad.NombreUnidad} />
                                        <ListItemSecondaryAction>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<EditIcon />}
                                                        onClick={() => selectUnidad(unidad.IdUnidad)}
                                                    >
                                                        Editar
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <EliminarUnidad
                                                        unidadId={unidad.IdUnidad}
                                                        onUnidadEliminada={handleUnidadEliminada}
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
            {selectedUnidadId && (
                <div className="mt-4">
                    <ActualizarUnidad
                        unidadId={selectedUnidadId}
                        onUnidadActualizada={handleUnidadActualizada}
                    />
                </div>
            )}
        </Container>
    );
};

export default Unidades;
