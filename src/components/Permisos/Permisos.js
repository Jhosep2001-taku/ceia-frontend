import React, { useState, useMemo } from 'react';
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
    Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_URL } from '../../config';
import useFetchData from '../../hooks/useFetchData';
import AgregarPermiso from './AgregarPermiso';
import ActualizarPermiso from './ActualizarPermiso';
import EliminarPermiso from './EliminarPermiso';
import CustomDialog from '../Common/CustomDialog';
import useDialog from '../../hooks/useDialog';

const Permisos = () => {
    const { data: permisos, isLoading, setData: setPermisos } = useFetchData(`${API_URL}/permisos`);
    const { data: usuarios } = useFetchData(`${API_URL}/usuarios`);
    const [selectedPermisoId, setSelectedPermisoId] = useState(null);
    const { isOpen, dialogType, openDialog, closeDialog } = useDialog();

    const getNombreUsuario = (idUsuario) => {
        const usuario = usuarios?.find(usuario => usuario.IdUsuario === idUsuario);
        return usuario ? usuario.NombreCompleto : `Usuario ${idUsuario}`;
    };

    const esAdministrador = (permiso) => {
        return permiso.TipoPermiso === "Administrador del Sistema";
    };

    // Agrupar y ordenar los permisos por usuario
    const permisosAgrupados = useMemo(() => {
        if (!permisos) return [];

        const grupos = permisos.reduce((acc, permiso) => {
            const idUsuario = permiso.IdUsuario;
            if (!acc[idUsuario]) {
                acc[idUsuario] = [];
            }
            acc[idUsuario].push(permiso);
            return acc;
        }, {});

        return Object.entries(grupos)
            .sort(([, permisosA], [, permisosB]) => {
                const esAdminA = permisosA.some(esAdministrador);
                const esAdminB = permisosB.some(esAdministrador);
                if (esAdminA && !esAdminB) return -1;
                if (!esAdminA && esAdminB) return 1;
                return 0;
            });
    }, [permisos]);

    const handlePermisoAgregado = (nuevoPermiso) => {
        setPermisos((prevPermisos) => [...prevPermisos, nuevoPermiso]);
        closeDialog();
    };

    const handlePermisoActualizado = (permisoActualizado) => {
        setPermisos((prevPermisos) =>
            prevPermisos.map((permiso) =>
                permiso.IdPermiso === permisoActualizado.IdPermiso ? permisoActualizado : permiso
            )
        );
        setSelectedPermisoId(null);
        closeDialog();
    };

    const handlePermisoEliminado = (permisoId) => {
        setPermisos((prevPermisos) => prevPermisos.filter(permiso => permiso.IdPermiso !== permisoId));
        setSelectedPermisoId(null);
    };

    const renderDialogContent = () => {
        switch (dialogType) {
            case 'create':
                return <AgregarPermiso onAdd={handlePermisoAgregado} />;
            case 'edit':
                return selectedPermisoId && (
                    <ActualizarPermiso
                        id={selectedPermisoId}
                        onUpdate={handlePermisoActualizado}
                    />
                );
            case 'delete':
                return selectedPermisoId && (
                    <EliminarPermiso
                        id={selectedPermisoId}
                        onDelete={() => handlePermisoEliminado(selectedPermisoId)}
                        onClose={closeDialog}
                    />
                );
            default:
                return null;
        }
    };
    
    return (
        <Container>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                        Gestión de Permisos
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => openDialog('create')} 
                        startIcon={<AddIcon />}
                        sx={{ borderRadius: '20px' }}
                    >
                        Agregar Permiso
                    </Button>
                </Box>
            </Paper>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {permisosAgrupados.map(([idUsuario, permisosUsuario], index) => (
                            <React.Fragment key={idUsuario}>
                                {index > 0 && <Divider sx={{ my: 3 }} />}
                                <Typography variant="h6" gutterBottom>
                                    {getNombreUsuario(Number(idUsuario))} 
                                    {permisosUsuario.some(esAdministrador) && " (Administrador)"}
                                </Typography>
                                <Grid container spacing={3}>
                                    {permisosUsuario.map((permiso) => (
                                        <Grid item xs={12} sm={6} md={4} key={permiso.IdPermiso}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="h6">{permiso.TipoPermiso}</Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => {
                                                            setSelectedPermisoId(permiso.IdPermiso);
                                                            openDialog('edit');
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={() => {
                                                            setSelectedPermisoId(permiso.IdPermiso);
                                                            openDialog('delete');
                                                        }}
                                                        startIcon={<DeleteIcon />}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </React.Fragment>
                        ))}
                    </>
                )}
            </Paper>

            <CustomDialog
                open={isOpen}
                onClose={closeDialog}
                title={
                    dialogType === 'create' ? 'Agregar Permiso' :
                    dialogType === 'edit' ? 'Editar Permiso' :
                    dialogType === 'delete' ? 'Eliminar Permiso' :
                    ''
                }
                onSubmit={dialogType === 'delete' ? () => handlePermisoEliminado(selectedPermisoId) : undefined}
            >
                {renderDialogContent()}
            </CustomDialog>
        </Container>
    );
};

export default Permisos;