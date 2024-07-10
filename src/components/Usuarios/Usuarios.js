import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AgregarUsuario from './AgregarUsuario';
import ActualizarUsuario from './ActualizarUsuario';
import EliminarUsuario from './EliminarUsuario';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Button,
    Divider,
    Box,
    CircularProgress,
    Grid,
    Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { API_URL } from '../../config';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [selectedUsuarioId, setSelectedUsuarioId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = () => {
        if (!isLoading) {
            setIsLoading(true);
            axios.get(`${API_URL}/usuarios`)
                .then(response => {
                    setUsuarios(response.data);
                })
                .catch(error => {
                    console.error('Hubo un error al obtener los usuarios:', error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    const handleUsuarioAgregado = (nuevoUsuario) => {
        setUsuarios([...usuarios, nuevoUsuario]);
    };

    const handleUsuarioActualizado = (usuarioActualizado) => {
        setUsuarios(usuarios.map(usuario =>
            usuario.IdUsuario === usuarioActualizado.IdUsuario ? usuarioActualizado : usuario
        ));
        setSelectedUsuarioId(null);
    };

    const handleUsuarioEliminado = (usuarioId) => {
        setUsuarios(usuarios.filter(usuario => usuario.IdUsuario !== usuarioId));
        setSelectedUsuarioId(null);
    };

    const selectUsuario = (id) => {
        setSelectedUsuarioId(id);
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Gestión de Usuarios
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <AgregarUsuario onUsuarioAgregado={handleUsuarioAgregado} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h5" component="h2">
                            Lista de Usuarios
                        </Typography>
                        {isLoading ? (
                            <Box display="flex" justifyContent="center" mt={2}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <List>
                                {usuarios.map(usuario => (
                                    <Box key={usuario.IdUsuario}>
                                        <ListItem>
                                            <ListItemText primary={usuario.NombreCompleto} />
                                            <ListItemSecondaryAction>
                                                <Grid container spacing={2}>
                                                    <Grid item>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            startIcon={<EditIcon />}
                                                            onClick={() => selectUsuario(usuario.IdUsuario)}
                                                        >
                                                            Editar
                                                        </Button>
                                                    </Grid>
                                                    <Grid item>
                                                        <EliminarUsuario
                                                            usuarioId={usuario.IdUsuario}
                                                            onUsuarioEliminado={handleUsuarioEliminado}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider />
                                    </Box>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Grid>
            </Grid>
            {selectedUsuarioId && (
                <Box mt={4}>
                    <ActualizarUsuario
                        usuarioId={selectedUsuarioId}
                        onUsuarioActualizado={handleUsuarioActualizado}
                    />
                </Box>
            )}
        </Container>
    );
};

export default Usuarios;
