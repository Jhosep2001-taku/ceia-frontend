import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';
import Routes from './Routes';

const drawerWidth = 240;

const Layout = ({ onLogout, userPermissions }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            width: '100vw',  // Cambiado de maxWidth a width
            overflow: 'hidden'
        }}>
            <Header onLogout={onLogout} />
            <Box sx={{ display: 'flex', flexGrow: 1, width: '100%', overflow: 'hidden' }}>
                {!isMobile && (
                    <Sidebar 
                        isMobile={isMobile} 
                        drawerWidth={drawerWidth} 
                        userPermissions={userPermissions} 
                    />
                )}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
                        maxWidth: '100%',
                        mt: { xs: '56px', sm: '64px' },
                        p: { xs: 1, sm: 2, md: 3 },
                        bgcolor: 'background.default',
                        pb: isMobile ? '60px' : '16px',
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        '& > *': {
                            maxWidth: '100%',
                            overflowX: 'hidden',
                        },
                    }}
                >
                    <Routes />
                </Box>
            </Box>
            {isMobile && <MobileNavigation onLogout={onLogout} />}
        </Box>
    );
};

export default Layout;