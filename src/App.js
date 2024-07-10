import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemText, Toolbar, AppBar, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Equipos from './components/Equipos/Equipos';
import Usuarios from './components/Usuarios/Usuarios';
import Permisos from './components/Permisos/Permisos';
import Unidades from './components/Unidad/Unidades';
import ImagenEquipo from './components/Imagenes/ImagenEquipo';

const drawerWidth = '20%';

// Define a custom theme with primary and secondary colors
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Reddish-pink color for the AppBar
        },
        secondary: {
            main: '#9c27b0', // Pinkish-purple color for the Drawer
        },
    },
});

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <AppBar
                        position="fixed"
                        sx={{
                            zIndex: (theme) => theme.zIndex.drawer + 1,
                            background: 'linear-gradient(135deg, #1976d2 10%, #9c27b0 70%)', // Degradado en la AppBar
                        }}
                    >
                        <Toolbar>
                            <Typography variant="h4" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                                <span className="display-4">CEIA</span>
                                <Typography variant="h5" component="div">
                                    <span className="display-5">Centro de Especialización Instrumental Analítica</span>
                                </Typography>
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        variant="permanent"
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            [`& .MuiDrawer-paper`]: {
                                width: drawerWidth,
                                boxSizing: 'border-box',
                                background: 'linear-gradient(135deg, #9c27b0 30%, #1976d2 90%)', // Degradado en la Drawer
                                color: 'white', // Optional: Set text color to white for better contrast
                            },
                        }}
                    >
                        <Toolbar />
                        <Box sx={{ overflow: 'auto' }}>
                            <List>
                                <ListItem
                                    button
                                    component={Link}
                                    to="/usuarios"
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Color de fondo cuando está seleccionado
                                            backdropFilter: 'blur(8px)', // Efecto de desenfoque para simular vidrio
                                            border: '1px solid rgba(255, 255, 255, 0.1)', // Borde translúcido
                                        },
                                    }}
                                >
                                    <ListItemText primary="Gestión de Usuarios" />
                                </ListItem>
                                <ListItem
                                    button
                                    component={Link}
                                    to="/permisos"
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                            backdropFilter: 'blur(8px)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                        },
                                    }}
                                >
                                    <ListItemText primary="Gestión de Permisos" />
                                </ListItem>
                                <ListItem
                                    button
                                    component={Link}
                                    to="/equipos"
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                            backdropFilter: 'blur(8px)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                        },
                                    }}
                                >
                                    <ListItemText primary="Gestión de Equipos" />
                                </ListItem>
                                <ListItem
                                    button
                                    component={Link}
                                    to="/unidades"
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                            backdropFilter: 'blur(8px)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                        },
                                    }}
                                >
                                    <ListItemText primary="Gestión de Unidades" />
                                </ListItem>
                                {/* 
                                <ListItem
                                    button
                                    component={Link}
                                    to="/imagenes-equipo"
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                            backdropFilter: 'blur(8px)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                        },
                                    }}
                                >
                                    <ListItemText primary="Imágenes de Equipo" />
                                </ListItem>
                                */}
                            </List>
                        </Box>
                    </Drawer>
                    <Box
                        component="main"
                        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginLeft: `${drawerWidth}px` }}
                    >
                        <Toolbar />
                        <Routes>
                            <Route path="/usuarios" element={<Usuarios />} />
                            <Route path="/permisos" element={<Permisos />} />
                            <Route path="/equipos" element={<Equipos />} />
                            <Route path="/unidades" element={<Unidades />} />
                            <Route path="/imagenes-equipo" element={<ImagenEquipo />} />
                            <Route path="/" element={<Typography variant="h4">Seleccione una opción del menú lateral</Typography>} />
                        </Routes>
                    </Box>
                </Box>
            </Router>
        </ThemeProvider>
    );
};

export default App;
