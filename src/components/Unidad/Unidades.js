import React, { useState } from 'react';
import AgregarUnidad from './AgregarUnidad';
import ActualizarUnidad from './ActualizarUnidad';
import EliminarUnidad from './EliminarUnidad';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Paper,
    IconButton,
    CircularProgress,
    Button,
    Box,
    Avatar,
    Tooltip,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { API_URL } from '../../config';
import useDialog from '../../hooks/useDialog';
import useFetchData from '../../hooks/useFetchData';
import CustomDialog from '../Common/CustomDialog';

const Unidades = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { data: unidades, isLoading, setData: setUnidades } = useFetchData(`${API_URL}/unidades`);
    const { data: usuarios } = useFetchData(`${API_URL}/usuarios`);
    const [selectedUnidad, setSelectedUnidad] = useState(null);
    const { isOpen, dialogType, openDialog, closeDialog } = useDialog();

    const handleUnidadAgregada = (nuevaUnidad) => {
        setUnidades((prevUnidades) => [...prevUnidades, nuevaUnidad]);
        closeDialog();
    };

    const handleUnidadActualizada = (unidadActualizada) => {
        setUnidades((prevUnidades) =>
            prevUnidades.map((unidad) =>
                unidad.IdUnidad === unidadActualizada.IdUnidad ? unidadActualizada : unidad
            )
        );
        setSelectedUnidad(null);
        closeDialog();
    };

    const handleUnidadEliminada = (unidadId) => {
        setUnidades((prevUnidades) => prevUnidades.filter((unidad) => unidad.IdUnidad !== unidadId));
        setSelectedUnidad(null);
    };

    const getEncargadoNombre = (idUsuario) => {
        const usuario = usuarios.find((usuario) => usuario.IdUsuario === idUsuario);
        return usuario ? usuario.NombreCompleto : 'Desconocido';
    };

    const renderDialogContent = () => {
        switch (dialogType) {
            case 'create':
                return <AgregarUnidad onUnidadAgregada={handleUnidadAgregada} />;
            case 'edit':
                return selectedUnidad && (
                    <ActualizarUnidad
                        unidad={selectedUnidad}
                        onUnidadActualizada={handleUnidadActualizada}
                    />
                );
            case 'delete':
                return selectedUnidad && (
                    <EliminarUnidad
                        unidadId={selectedUnidad.IdUnidad}
                        onUnidadEliminada={handleUnidadEliminada}
                        onClose={closeDialog}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                        Gestión de Unidades
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => openDialog('create')} 
                        startIcon={<AddIcon />}
                        sx={{ borderRadius: '20px' }}
                    >
                        Agregar Unidad
                    </Button>
                </Box>
            </Paper>
            <Paper elevation={3} sx={{ p: 3 }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <List>
                        {unidades.map((unidad, index) => (
                            <ListItem
                                key={unidad.IdUnidad}
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
                                    flexDirection: isMobile ? 'column' : 'row', 
                                    alignItems: isMobile ? 'center' : 'center', 
                                    textAlign: isMobile ? 'center' : 'left',
                                    justifyContent: isMobile ? 'center' : 'flex-start', 
                                }}
                            >
                                <Avatar sx={{ 
                                    mr: isMobile ? 0 : 4, 
                                    mb: isMobile ? 2 : 0, 
                                    width: 56, 
                                    height: 56 
                                }}>
                                    {unidad.TipoUnidad.charAt(0)}
                                </Avatar>
                                <ListItemText
                                    primary={
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                fontWeight: 'bold',
                                                whiteSpace: 'nowrap',  
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {`${unidad.TipoUnidad} - ${unidad.NombreUnidad}`}
                                        </Typography>
                                    }
                                    secondary={
                                        <>
                                            <Typography 
                                                component="span" 
                                                variant="body2" 
                                                color="text.secondary" 
                                                display="block" 
                                                sx={{ mb: 1 }}
                                            >
                                                {`Encargado: ${getEncargadoNombre(unidad.IdUsuario)}`}
                                            </Typography>
                                            <Typography 
                                                component="span" 
                                                variant="body2" 
                                                color="text.secondary" 
                                                display="block" 
                                                sx={{ mb: 1 }}
                                            >
                                                {`Correo: ${unidad.CorreoEncargado}`}
                                            </Typography>
                                            <Typography 
                                                component="span" 
                                                variant="body2" 
                                                color="text.secondary" 
                                                display="block"
                                            >
                                                {`Celular: ${unidad.CelularEncargado}`}
                                            </Typography>
                                        </>
                                    }
                                />
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        flexDirection: isMobile ? 'row' : 'row',  
                                        alignItems: 'center', 
                                        justifyContent: isMobile ? 'center' : 'flex-start', 
                                        gap: isMobile ? 1 : 2,
                                        mt: isMobile ? 2 : 0,
                                        width: isMobile ? '100%' : 'auto', 
                                    }}
                                >
                                    <Tooltip title="Editar">
                                        <IconButton
                                            color="primary"
                                            onClick={() => {
                                                setSelectedUnidad(unidad);
                                                openDialog('edit');
                                            }}
                                            sx={{ mr: isMobile ? 1 : 2 }} 
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <EliminarUnidad
                                        unidadId={unidad.IdUnidad}
                                        onUnidadEliminada={handleUnidadEliminada}
                                        onClose={closeDialog}
                                    />
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>

            <CustomDialog
                open={isOpen}
                onClose={closeDialog}
                title={
                    dialogType === 'create' ? 'Agregar Unidad' :
                    dialogType === 'edit' ? 'Editar Unidad' :
                    dialogType === 'delete' ? 'Eliminar Unidad' :
                    ''
                }
                onSubmit={dialogType === 'delete' ? () => handleUnidadEliminada(selectedUnidad?.IdUnidad) : undefined}
            >
                {renderDialogContent()}
            </CustomDialog>
        </Container>
    );
};

export default Unidades;
