import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AgregarPermiso from './AgregarPermiso';
import ActualizarPermiso from './ActualizarPermiso';
import EliminarPermiso from './EliminarPermiso';
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
import EditIcon from '@mui/icons-material/Edit'; // Importar el ícono de editar
import { API_URL } from '../../config';

const Permisos = () => {
    const [permisos, setPermisos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [permisoActualizar, setPermisoActualizar] = useState(null);

    useEffect(() => {
        fetchPermisos();
        fetchUsuarios();
    }, []);

    const fetchPermisos = () => {
        axios.get(`${API_URL}/permisos`)
            .then(response => {
                setPermisos(response.data);
            })
            .catch(error => {
                console.error('Error fetching permisos:', error);
            });
    };

    const fetchUsuarios = () => {
        axios.get(`${API_URL}/usuarios`)
            .then(response => {
                setUsuarios(response.data);
            })
            .catch(error => {
                console.error('Error fetching usuarios:', error);
            });
    };

    const handleActualizar = (id) => {
        setPermisoActualizar(id);
    };

    const handleCancelarActualizar = () => {
        setPermisoActualizar(null);
    };

    const actualizarPermisoEnLista = (permisoActualizado) => {
        const nuevosPermisos = permisos.map(permiso =>
            permiso.IdPermiso === permisoActualizado.IdPermiso ? permisoActualizado : permiso
        );
        setPermisos(nuevosPermisos);
        setPermisoActualizar(null);
    };

    const agregarPermisoALista = (nuevoPermiso) => {
        setPermisos([...permisos, nuevoPermiso]);
    };

    const eliminarPermisoDeLista = (permisoId) => {
        setPermisos(permisos.filter(permiso => permiso.IdPermiso !== permisoId));
        setPermisoActualizar(null);
    };

    const getNombreUsuario = (idUsuario) => {
        const usuario = usuarios.find(usuario => usuario.IdUsuario === idUsuario);
        return usuario ? usuario.NombreCompleto : 'Usuario no encontrado';
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Gestión de Permisos
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <AgregarPermiso onAdd={agregarPermisoALista} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Lista de Permisos
                        </Typography>
                        <List>
                            {permisos.map(permiso => (
                                <div key={permiso.IdPermiso}>
                                    <ListItem>
                                        <ListItemText primary={`${permiso.TipoPermiso} - Usuario: ${getNombreUsuario(permiso.IdUsuario)}`} />
                                        <ListItemSecondaryAction>
                                            <Grid container spacing={2}>
                                                <Grid item>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<EditIcon />} // Añadir ícono de editar
                                                        onClick={() => handleActualizar(permiso.IdPermiso)}
                                                    >
                                                        Editar
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <EliminarPermiso
                                                        id={permiso.IdPermiso}
                                                        onDelete={() => eliminarPermisoDeLista(permiso.IdPermiso)}
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
            {permisoActualizar && (
                <ActualizarPermiso
                    id={permisoActualizar}
                    onUpdate={actualizarPermisoEnLista}
                    onCancel={handleCancelarActualizar}
                />
            )}
        </Container>
    );
};

export default Permisos;
