import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    Container,
    Typography,
    Box,
    Paper,
    CircularProgress,
    List,
    ListItem,
    Card,
    IconButton,
    Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { API_URL } from '../../config';
import CustomDialog from '../Common/CustomDialog';
import useFetchData from '../../hooks/useFetchData';
import useDialog from '../../hooks/useDialog';
import ActualizarHistorialMantenimiento from './ActualizarHistorialMantenimiento';
import EliminarHistorialMantenimiento from './EliminarHistorialMantenimiento';

const HistorialMantenimientos = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { data: mantenimientos, setData: setMantenimientos, isLoading, error } = useFetchData(`${API_URL}/mantenimientos`);
    const [selectedHistorialId, setSelectedHistorialId] = useState(null);

    const { isOpen: isEditDialogOpen, openDialog: openEditDialog, closeDialog: closeEditDialog } = useDialog();
    const { isOpen: isCreateDialogOpen, openDialog: openCreateDialog, closeDialog: closeCreateDialog } = useDialog();

    const handleMantenimientoActualizado = (mantenimientoActualizado) => {
        setMantenimientos(prevMantenimientos =>
            prevMantenimientos.map(mantenimiento =>
                mantenimiento.IdHistorial === mantenimientoActualizado.IdHistorial ? mantenimientoActualizado : mantenimiento
            )
        );
        setSelectedHistorialId(null);
        closeEditDialog();
    };

    const handleMantenimientoEliminado = (historialId) => {
        setMantenimientos(prevMantenimientos =>
            prevMantenimientos.filter(mantenimiento => mantenimiento.IdHistorial !== historialId)
        );
        setSelectedHistorialId(null);
    };

    const handleOpenEditDialog = (historialId) => {
        setSelectedHistorialId(historialId);
        openEditDialog();
    };

    if (isLoading) {
        return (
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error">Hubo un error al cargar los datos.</Alert>
            </Container>
        );
    }

    if (!mantenimientos.length) {
        return (
            <Container>
                <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
                    No hay mantenimientos disponibles.
                </Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                            Historial de Mantenimientos
                        </Typography>
                    </Box>
                </Box>
            </Paper>
            <Paper elevation={3} sx={{ p: 3 }}>
                <List>
                    {mantenimientos.map((mantenimiento, index) => (
                        <ListItem
                            key={mantenimiento.IdHistorial}
                            sx={{ 
                                mb: 2, 
                                p: 2, 
                                borderRadius: 2, 
                                border: '1px solid',
                                borderColor: 'grey.300',
                                backgroundColor: index % 2 === 0 ? 'grey.50' : 'white',
                                '&:hover': {
                                    backgroundColor: 'grey.100',
                                },
                                transition: 'background-color 0.3s',
                            }}
                        >
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                                    Mantenimiento ID: {mantenimiento.IdHistorial}
                                </Typography>
                                <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                                    Fecha: {mantenimiento.FechaMantenimiento}
                                </Typography>
                                <Typography variant="body2" component="div">
                                    Descripción: {mantenimiento.DescripcionTrabajo}
                                </Typography>
                                <Typography variant="body2" component="div">
                                    Encargado: {mantenimiento.Encargado}
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
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: isMobile ? 'row' : 'column',
                                    ml: isMobile ? 2 : 0,
                                    mt: isMobile ? 0 : 2,
                                }}>
                                    <IconButton onClick={() => handleOpenEditDialog(mantenimiento.IdHistorial)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                </Box>
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: isMobile ? 'row' : 'column',
                                    ml: isMobile ? 2 : 0,
                                    mt: isMobile ? 0 : 2,
                                }}>
                                    <EliminarHistorialMantenimiento historialId={mantenimiento.IdHistorial} onMantenimientoEliminado={handleMantenimientoEliminado} />
                                </Box>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Diálogo para editar mantenimiento */}
            <CustomDialog
                open={isEditDialogOpen}
                onClose={closeEditDialog}
                title="Editar Mantenimiento"
            >
                <ActualizarHistorialMantenimiento
                    historialId={selectedHistorialId}
                    onHistorialActualizado={handleMantenimientoActualizado}
                    onClose={closeEditDialog}
                />
            </CustomDialog>

            {/* Diálogo para agregar mantenimiento */}
            <CustomDialog
                open={isCreateDialogOpen}
                onClose={closeCreateDialog}
                title="Agregar Mantenimiento"
            >
                {/* Aquí deberías agregar el componente para agregar un mantenimiento */}
            </CustomDialog>
        </Container>
    );
};

export default HistorialMantenimientos;