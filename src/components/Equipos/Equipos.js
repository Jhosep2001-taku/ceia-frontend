import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CrearEquipo from './AgregarEquipo';
import ActualizarEquipo from './ActualizarEquipo';
import ImagenEquipo from '../Imagenes/equipos/ImagenEquipo';
import EliminarEquipo from './EliminarEquipo';
import {
    Container,
    Typography,
    Button,
    Box,
    Paper,
    IconButton,
    CircularProgress,
    List,
    ListItem,
    Card,
    CardContent
} from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { API_URL } from '../../config';
import CustomDialog from '../Common/CustomDialog';
import useFetchData from '../../hooks/useFetchData';
import useDialog from '../../hooks/useDialog';

const Equipos = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { data: equipos, setData: setEquipos, isLoading } = useFetchData(`${API_URL}/equipos`);
    const [tipos, setTipos] = useState([]);
    const [selectedEquipoId, setSelectedEquipoId] = useState(null);

    const { isOpen: isCreateDialogOpen, openDialog: openCreateDialog, closeDialog: closeCreateDialog } = useDialog();
    const { isOpen: isEditDialogOpen, openDialog: openEditDialog, closeDialog: closeEditDialog } = useDialog();
    const { isOpen: isImageDialogOpen, openDialog: openImageDialog, closeDialog: closeImageDialog } = useDialog();
    useEffect(() => {
        const tiposSet = new Set(equipos.map(equipo => equipo.Tipo));
        setTipos([...tiposSet]);
    }, [equipos]);

    const handleEquipoAgregado = (nuevoEquipo) => {
        setEquipos([...equipos, nuevoEquipo]);
        closeCreateDialog();
    };

    const handleEquipoActualizado = (equipoActualizado) => {
        setEquipos(equipos.map(equipo =>
            equipo.IdEquipo === equipoActualizado.IdEquipo ? equipoActualizado : equipo
        ));
        setSelectedEquipoId(null);
        closeEditDialog();
    };

    const handleEquipoEliminado = (equipoId) => {
        setEquipos(equipos.filter(equipo => equipo.IdEquipo !== equipoId));
        setSelectedEquipoId(null);
    };

    const handleOpenCreateDialog = () => openCreateDialog('create');
    const handleOpenEditDialog = (equipoId) => {
        setSelectedEquipoId(equipoId);
        openEditDialog('edit');
    };
    const handleOpenImageDialog = (equipoId) => {
        setSelectedEquipoId(equipoId);
        openImageDialog('image');
    };

    return (
        <Container>
            <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                            Gestión de Equipos
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleOpenCreateDialog} 
                            startIcon={<AddIcon />}
                            sx={{ borderRadius: '20px' }}
                        >
                            Agregar Equipo
                        </Button>
                    </Box>
                </Box>
            </Paper>
            <Paper elevation={3} sx={{ p: 3 }}>
                <List>
                    {equipos.map((equipo, index) => (
                        <ListItem
                            key={equipo.IdEquipo}
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
                                    {equipo.Equipo} - {equipo.NIA}
                                </Typography>
                                <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                                    Voltaje: {equipo.Voltaje}
                                </Typography>
                                <Typography variant="body2" component="div">
                                    Potencia: {equipo.Potencia}
                                </Typography>
                                <Typography variant="body2" component="div">
                                    Corriente: {equipo.Corriente}
                                </Typography>
                                <Typography variant="body2" component="div">
                                    Observaciones: {equipo.Observaciones}
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
                                        padding: 5,
                                        backgroundColor: 'background.paper',
                                        textAlign: 'center'
                                        
                                    }}
                                    onClick={() => handleOpenImageDialog(equipo.IdEquipo)}
                                >
                                    <CardContent>
                                        <PhotoIcon fontSize={isMobile ? "small" : "medium"} />
                                        <Typography variant="body2" color="textSecondary" sx={{ mt: isMobile ? 0 : 1, fontSize: isMobile ? '0.6rem' : '0.75rem' }}>
                                            {isMobile ? 'Imagen' : 'Imagen Equipo'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: isMobile ? 'row' : 'column',
                                    ml: isMobile ? 2 : 0,
                                    mt: isMobile ? 0 : 2,
                                }}>
                                    <IconButton onClick={() => handleOpenEditDialog(equipo.IdEquipo)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                </Box>
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: isMobile ? 'row' : 'column',
                                    ml: isMobile ? 2 : 0,
                                    mt: isMobile ? 0 : 2,
                                }}>
                                    <EliminarEquipo equipoId={equipo.IdEquipo} onEquipoEliminado={handleEquipoEliminado} />
                                </Box>
                            </Box>
                        </ListItem>
                    ))}
                </List>
                 {/* Loader */}
                    {isLoading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                            <CircularProgress />
                        </Box>
                    )}
            </Paper>

            {/* Diálogo para crear equipo */}
            <CustomDialog
                open={isCreateDialogOpen}
                onClose={closeCreateDialog}
                title="Agregar Equipo"
                onSubmit={() => {}}
            >
                <CrearEquipo onEquipoAgregado={handleEquipoAgregado} onClose={closeCreateDialog} />
            </CustomDialog>

            {/* Diálogo para editar equipo */}
            <CustomDialog
                open={isEditDialogOpen}
                onClose={closeEditDialog}
                title="Editar Equipo"
                onSubmit={() => {}}
            >
                <ActualizarEquipo
                    equipoId={selectedEquipoId}
                    onEquipoActualizado={handleEquipoActualizado}
                    onClose={closeEditDialog}
                />
            </CustomDialog>

            {/* Diálogo para ver imágenes de equipo */}
            <CustomDialog
                open={isImageDialogOpen}
                onClose={closeImageDialog}
                title="Imágenes de Equipo"
                onSubmit={() => {}}
            >
                <ImagenEquipo equipoId={selectedEquipoId} />
            </CustomDialog>

           
        </Container>
    );
};

export default Equipos;
