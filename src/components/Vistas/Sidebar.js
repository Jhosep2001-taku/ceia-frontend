import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Box, Typography, Button, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    People as PeopleIcon, 
    Security as SecurityIcon, 
    DeviceHub as DeviceHubIcon, 
    Apartment as ApartmentIcon, 
    RequestQuote as RequestQuoteIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { API_URL } from '../../config';
import { decrypt } from '../../utils/crypto';

const permissionsRequired = {
    '/usuarios': ['Administrador del Sistema', 'Gestion Usuarios'],
    '/permisos': ['Administrador del Sistema', 'Gestion Permisos'],
    '/equipos': ['Administrador del Sistema', 'Gestion Equipos'],
    '/unidades': ['Administrador del Sistema', 'Gestion Unidades'],
    '/solicitudes': ['Administrador del Sistema', 'Gestion Solicitudes'],
    '/perfil': ['Administrador del Sistema', 'Gestion Usuarios', 'Gestion Permisos', 'Gestion Equipos', 'Gestion Unidades', 'Gestion Solicitudes'],
    '/historiales': ['Administrador del Sistema', 'Gestion Mantenimientos'], // Added
};

const menuItems = [
    { text: 'Gestión de Usuarios', icon: <PeopleIcon />, path: '/usuarios' },
    { text: 'Gestión de Permisos', icon: <SecurityIcon />, path: '/permisos' },
    { text: 'Gestión de Equipos', icon: <DeviceHubIcon />, path: '/equipos' },
    { text: 'Gestión de Unidades', icon: <ApartmentIcon />, path: '/unidades' },
    { text: 'Gestión de Solicitudes', icon: <RequestQuoteIcon />, path: '/solicitudes' },
    { text: 'Historial de Mantenimientos', icon: <RequestQuoteIcon />, path: '/historiales' }, // Added
];

const Sidebar = ({ isMobile, drawerWidth, userPermissions = [] }) => {
    const theme = useTheme();

    const filteredMenuItems = menuItems.filter(item => {
        const requiredPermissions = permissionsRequired[item.path] || [];
        return requiredPermissions.some(permission => userPermissions.includes(permission));
    });

    const handleLogout = async () => {
        try {
            const encryptedUserData = localStorage.getItem('userData');
            const userData = decrypt(encryptedUserData);
            const token = userData ? userData.token : null;

            await axios.post(`${API_URL}/logout`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error during logout', error);
        } finally {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={!isMobile}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    background: 'linear-gradient(135deg, #9c27b0 30%, #1976d2 90%)',
                    color: 'white',
                    borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto', padding: 2, flexGrow: 1 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
                    Menú Principal
                </Typography>
                <List>
                    {filteredMenuItems.map((item, index) => (
                        <ListItem 
                            button 
                            component={Link} 
                            to={item.path} 
                            key={index}
                            sx={{ 
                                mb: 1,
                                borderRadius: '8px',
                                '&:hover': { 
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    '& .MuiListItemIcon-root': {
                                        color: '#fff',
                                    },
                                } 
                            }}
                        >
                            <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.text} 
                                primaryTypographyProps={{
                                    fontSize: '0.9rem',
                                    fontWeight: 'medium'
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box sx={{ padding: 2 }}>
                <Button 
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    sx={{ 
                        borderRadius: '8px',
                        padding: '10px 16px',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        width: '100%',
                        justifyContent: 'flex-start',
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.secondary.contrastText,
                        '&:hover': {
                            backgroundColor: theme.palette.secondary.dark,
                        }
                    }}
                >
                    Cerrar sesión
                </Button>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
