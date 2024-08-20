import React from 'react';
import { Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import ApartmentIcon from '@mui/icons-material/Apartment';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import { Link } from 'react-router-dom';
import { decrypt } from '../../utils/crypto';

const permissionsRequired = {
    '/usuarios': ['Administrador del Sistema', 'Gestion Usuarios'],
    '/permisos': ['Administrador del Sistema', 'Gestion Permisos'],
    '/equipos': ['Administrador del Sistema', 'Gestion Equipos'],
    '/unidades': ['Administrador del Sistema', 'Gestion Unidades'],
    '/solicitudes': ['Administrador del Sistema', 'Gestion Solicitudes'],
    '/perfil': ['Administrador del Sistema', 'Gestion Usuarios', 'Gestion Permisos', 'Gestion Equipos', 'Gestion Unidades', 'Gestion Solicitudes'],
    '/historiales': ['Administrador del Sistema', 'Gestion Mantenimientos'] // Agregado
};

const getUserPermissions = () => {
    const encryptedUserData = localStorage.getItem('userData');
    if (encryptedUserData) {
        try {
            const userData = decrypt(encryptedUserData);
            return userData?.TipoPermiso || [];
        } catch (error) {
            console.error("Error decrypting user data:", error);
            return [];
        }
    }
    return [];
};

const MobileNavigation = () => {
    const userPermissions = getUserPermissions();
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const hasPermission = (path) => {
        const requiredPermissions = permissionsRequired[path];
        return requiredPermissions ? requiredPermissions.some(permission => userPermissions.includes(permission)) : false;
    };

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    return (
        <Box>
            <IconButton onClick={toggleDrawer(true)} color="inherit">
                <MenuIcon />
            </IconButton>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 250 }}>
                    <Typography variant="h6" sx={{ p: 2 }}>Navigation</Typography>
                    <Divider />
                    <List>
                        {hasPermission('/usuarios') && (
                            <ListItem button component={Link} to="/usuarios" onClick={toggleDrawer(false)}>
                                <ListItemIcon><PeopleIcon /></ListItemIcon>
                                <ListItemText primary="Usuarios" />
                            </ListItem>
                        )}
                        {hasPermission('/permisos') && (
                            <ListItem button component={Link} to="/permisos" onClick={toggleDrawer(false)}>
                                <ListItemIcon><SecurityIcon /></ListItemIcon>
                                <ListItemText primary="Permisos" />
                            </ListItem>
                        )}
                        {hasPermission('/equipos') && (
                            <ListItem button component={Link} to="/equipos" onClick={toggleDrawer(false)}>
                                <ListItemIcon><DeviceHubIcon /></ListItemIcon>
                                <ListItemText primary="Equipos" />
                            </ListItem>
                        )}
                        {hasPermission('/unidades') && (
                            <ListItem button component={Link} to="/unidades" onClick={toggleDrawer(false)}>
                                <ListItemIcon><ApartmentIcon /></ListItemIcon>
                                <ListItemText primary="Unidades" />
                            </ListItem>
                        )}
                        {hasPermission('/solicitudes') && (
                            <ListItem button component={Link} to="/solicitudes" onClick={toggleDrawer(false)}>
                                <ListItemIcon><RequestQuoteIcon /></ListItemIcon>
                                <ListItemText primary="Solicitudes" />
                            </ListItem>
                        )}
                        {hasPermission('/historiales') && (
                            <ListItem button component={Link} to="/historiales" onClick={toggleDrawer(false)}>
                                <ListItemIcon><RequestQuoteIcon /></ListItemIcon>
                                <ListItemText primary="Historiales" />
                            </ListItem>
                        )}
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
};

export default MobileNavigation;
