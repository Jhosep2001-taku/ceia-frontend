import React, { useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Button,
    Box,
    CircularProgress,
    Paper,
    Avatar,
    Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_URL } from '../../config';
import useFetchData from '../../hooks/useFetchData';
import AgregarUsuario from './AgregarUsuario';
import ActualizarUsuario from './ActualizarUsuario';
import EliminarUsuario from './EliminarUsuario';
import CustomDialog from '../Common/CustomDialog';
import useDialog from '../../hooks/useDialog';

const Usuarios = () => {
    const { data: usuarios, isLoading, setData: setUsuarios } = useFetchData(`${API_URL}/usuarios`);
    const [selectedUsuarioId, setSelectedUsuarioId] = useState(null);
    const { isOpen, dialogType, openDialog, closeDialog } = useDialog();

    const handleUsuarioAgregado = (nuevoUsuario) => {
        setUsuarios((prevUsuarios) => [...prevUsuarios, nuevoUsuario]);
        closeDialog();
    };

    const handleUsuarioActualizado = (usuarioActualizado) => {
        setUsuarios((prevUsuarios) =>
            prevUsuarios.map((usuario) =>
                usuario.IdUsuario === usuarioActualizado.IdUsuario ? usuarioActualizado : usuario
            )
        );
        closeDialog();
    };

    const handleUsuarioEliminado = (usuarioId) => {
        setUsuarios((prevUsuarios) => prevUsuarios.filter(usuario => usuario.IdUsuario !== usuarioId));
        closeDialog();
    };

    const handleOpenEditDialog = (usuarioId) => {
        setSelectedUsuarioId(usuarioId);
        openDialog('edit');
    };

    const handleOpenDeleteDialog = (usuarioId) => {
        setSelectedUsuarioId(usuarioId);
        openDialog('delete');
    };

    const renderDialogContent = () => {
        switch (dialogType) {
            case 'create':
                return <AgregarUsuario onUsuarioAgregado={handleUsuarioAgregado} />;
            case 'edit':
                return selectedUsuarioId && (
                    <ActualizarUsuario
                        usuarioId={selectedUsuarioId}
                        onUsuarioActualizado={handleUsuarioActualizado}
                    />
                );
            case 'delete':
                return (
                    <EliminarUsuario
                        open={isOpen}
                        onClose={closeDialog}
                        usuarioId={selectedUsuarioId}
                        onUsuarioEliminado={handleUsuarioEliminado}
                    />
                );
            default:
                return null;
        }
    };

    const getStatusChip = (estado) => {
        return estado === 1 ? 
            <Chip label="Activo" color="success" size="medium" /> :
            <Chip label="Inactivo" color="warning" size="medium" />;
    };

    return (
        <Container>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                        Gestión de Usuarios
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => openDialog('create')}
                        startIcon={<AddIcon />}
                        sx={{ borderRadius: '20px' }}
                    >
                        Agregar Usuario
                    </Button>
                </Box>
            </Paper>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {usuarios.map((usuario) => (
                        <Grid item xs={12} sm={6} md={4} key={usuario.IdUsuario}>
                            <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar sx={{ width: 56, height: 56, margin: 2 }} alt={usuario.NombreCompleto} src={usuario.AvatarUrl} />
                                    {getStatusChip(usuario.Estado)}
                                <CardContent sx={{ flex: '1 0 auto', textAlign: 'center' }}>
                                    <Typography variant="h6">{usuario.NombreCompleto}</Typography>
                                    <Typography color="textSecondary">{usuario.Documento}</Typography>
                                    <Typography color="textSecondary">{usuario.Correo}</Typography>
                                    <Typography color="textSecondary">{usuario.Celular}</Typography>
                                    <Typography color="textSecondary">{usuario.Rol}</Typography>
                                    
                                </CardContent>
                                <CardActions>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenEditDialog(usuario.IdUsuario)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleOpenDeleteDialog(usuario.IdUsuario)}
                                        startIcon={<DeleteIcon />}
                                    >
                                        Eliminar
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
            </Paper>

            {/* Modal */}
            <CustomDialog
                open={isOpen}
                onClose={closeDialog}
                title={
                    dialogType === 'create' ? 'Agregar Usuario' :
                    dialogType === 'edit' ? 'Editar Usuario' :
                    dialogType === 'delete' ? 'Eliminar Usuario' :
                    ''
                }
                onSubmit={dialogType === 'delete' ? () => handleUsuarioEliminado(selectedUsuarioId) : undefined}
            >
                {renderDialogContent()}
            </CustomDialog>
        </Container>
    );
};

export default Usuarios;
